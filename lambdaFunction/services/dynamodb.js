const awsDynamo = require("@aws-sdk/lib-dynamodb");
const awsDynamoClient = require("@aws-sdk/client-dynamodb");
const { DynamoDBClient } = awsDynamoClient;

const {
  ScanCommand,
  QueryCommand,
  DeleteCommand,
  PutCommand,
  UpdateCommand,
  GetCommand,
} = awsDynamo;

const awsSettings = {
  region: "us-east-1",
};

/**
 * Create the {@link DynamoDBDocumentClient} with the given configuration.
 */
function createDynamoDBClient() {
  //   logger.info(`Creating DynamoDBClient for region ${awsSettings.region}`);

  const client = new DynamoDBClient(awsSettings);
  //   return DynamoDBDocumentClient.from(client);

  return client;
}

class DynamoDBService {
  #dynamoDBClient;
  #config;
  constructor({ config }) {
    // { basicHelper, dynamoDBClient, sendMetric, config }
    // this.#basicHelper = basicHelper;
    this.#dynamoDBClient = createDynamoDBClient();
    // this.#sendMetric = sendMetric;

    this.#config = config;
  }

  async send(requestName, command) {
    var status = "success";
    try {
      return await this.#dynamoDBClient.send(command);
    } catch (err) {
      status = "failure";
      throw err;
    } finally {
      console.log("Dynamo Res status: ", status);
    }
  }

  async scanCommand(params) {
    const command = new ScanCommand(params);
    const scanResults = [];
    let items = [];
    do {
      items = await this.send("scan", command);
      items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    return scanResults;
  }

  async queryFirstItem(params, allowEmpty) {
    const command = new QueryCommand(params);

    const queryResponse = await this.send("query", command);
    if (queryResponse.Count === 0 && !allowEmpty) {
      // QUESTION - log here with some identifier?
      throw new Error(`No records found`);
    } else if (queryResponse.Count === 0 && allowEmpty) {
      return null;
    }
    return queryResponse.Items[0];
  }

  async queryItems(params, nextPageKey = false) {
    const command = new QueryCommand(params);

    const queryResponse = await this.send("query", command);
    if (queryResponse.Count === 0) {
      // QUESTION - log here with some identifier?
      throw new Error(`No records found`);
    }

    if (nextPageKey) {
      return [queryResponse.Items, res.LastEvaluatedKey];
    }
    return queryResponse.Items;
  }

  async queryAllItems(userID, nextPageKey = "") {
    let params = {
      TableName: this.#config.mainDynamodbTable,
      IndexName: "userId_idx",
      KeyConditionExpression: "#userID=:userID",
      ExpressionAttributeNames: {
        "#userID": "userID",
      },
      ExpressionAttributeValues: {
        ":userID": userID,
      },
      ScanIndexForward: false,
      // Limit: 100,
    };

    // if (nextPageKey) {
    //   params.ExclusiveStartKey = { threadId: nextPageKey };
    // }

    const command = new QueryCommand(params);

    const res = await this.send("query", command);
    return {
      items: res.Items,
      nextPageKey: res.LastEvaluatedKey,
    };
  }

  async createItem(item) {
    const command = new PutCommand({
      TableName: this.#config.mainDynamodbTable,
      Item: item,
    });
    return this.send("put", command);
  }

  async deleteThought(itemID, threadID) {
    const command = new DeleteCommand({
      TableName: this.#config.mainDynamodbTable,
      Key: {
        threadID,
        itemID,
      },
    });
    return this.send("delete", command);
  }

  async updateThought({ itemID, modifiedOn, type, title, tags }) {
    const command = new UpdateCommand({
      TableName: this.#config.mainDynamodbTable,
      Key: {
        itemID,
      },
      UpdateExpression:
        "set modifiedOn = :modifiedOn, #thought_type = :type, title = :title, tags = :tags", // For example, "'set Title = :t, Subtitle = :s'"
      ExpressionAttributeValues: {
        ":modifiedOn": modifiedOn,
        ":type": type,
        ":title": title,
        ":tags": tags,
      },
      ExpressionAttributeNames: {
        "#item_type": "type",
      },
      ReturnValues: "ALL_NEW",
    });

    const res = await this.send("update", command);
    return res.Attributes;
  }
}

module.exports.DynamoDBService = DynamoDBService;

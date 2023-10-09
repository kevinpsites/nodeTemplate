const awsDynamo = require("@aws-sdk/lib-dynamodb");
const awsDynamoClient = require("@aws-sdk/client-dynamodb");

const generateThreadId = () => "";

const { DynamoDBClient } = awsDynamoClient;

const {
  ScanCommand,
  QueryCommand,
  DeleteCommand,
  PutCommand,
  UpdateCommand,
  GetCommand,
} = awsDynamo;

const c = require("../config");

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
  constructor() {
    // { basicHelper, dynamoDBClient, sendMetric, config }
    // this.#basicHelper = basicHelper;
    this.#dynamoDBClient = createDynamoDBClient();
    // this.#sendMetric = sendMetric;

    this.#config = c.config;
  }

  async send(requestName, command) {
    var status = "success";
    try {
      return await this.#dynamoDBClient.send(command);
    } catch (err) {
      status = "failure";
      throw err;
    } finally {
      //   this.#sendMetric(
      //     "dynamodb_request",
      //     1,
      //     `request:${requestName}`,
      //     `status:${status}`
      //   );
      // console.log("")
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

  async queryItem(params) {
    const command = new QueryCommand(params);

    const queryResponse = await this.send("query", command);
    if (queryResponse.Count === 0) {
      // QUESTION - log here with some identifier?
      throw new Error(`No records found`);
    }
    return queryResponse.Items[0];
  }

  //   async scanAllConfigsFromTrackV2Form() {
  //     var params = {
  //       TableName: this.#config.trackV2FormTable,
  //       ExpressionAttributeNames: {
  //         "#accountId": "account_id",
  //         "#description": "description",
  //         "#formId": "form_id",
  //         "#name": "name",
  //       },
  //       ProjectionExpression: "#formId, #accountId, #description, #name",
  //     };
  //     return await this.scanCommand(params);
  //   }

  async queryAllUserThoughts(userId, nextPageKey = "") {
    let params = {
      TableName: this.#config.mainDynamodbTable,
      IndexName: "userId_idx",
      KeyConditionExpression: "#userId=:userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
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

  async queryAllUserThreads(userId) {
    var params = {
      TableName: this.#config.mainDynamodbTable,
      KeyConditionExpression: "#threadId=:threadId",
      ExpressionAttributeNames: {
        "#threadId": "threadId",
      },
      ExpressionAttributeValues: {
        ":threadId": generateThreadId(userId, ""),
      },
    };
    const command = new QueryCommand(params);

    const res = await this.send("query", command);
    return res.Items.sort((a, b) => a.createdOn - b.createdOn);
  }

  async queryAllThreadThoughts(threadId) {
    var params = {
      TableName: this.#config.mainDynamodbTable,
      KeyConditionExpression: "#threadId=:threadId",
      ExpressionAttributeNames: {
        "#threadId": "threadId",
      },
      ExpressionAttributeValues: {
        ":threadId": threadId,
      },
    };
    const command = new QueryCommand(params);

    const res = await this.send("query", command);
    return res.Items;
  }

  async getThought(thoughtId, threadId) {
    var params = {
      TableName: this.#config.mainDynamodbTable,
      Key: {
        threadId,
        thoughtId,
      },
    };
    const command = new GetCommand(params);

    const res = await this.send("get", command);
    return res.Item;
  }

  async createThought(thoughtItem) {
    const command = new PutCommand({
      TableName: this.#config.mainDynamodbTable,
      Item: thoughtItem,
    });
    return this.send("put", command);
  }

  async deleteThought(thoughtId, threadId) {
    const command = new DeleteCommand({
      TableName: this.#config.mainDynamodbTable,
      Key: {
        threadId,
        thoughtId,
      },
    });
    return this.send("delete", command);
  }

  async updateThought({
    thoughtId,
    threadId,
    modifiedOn,
    type,
    thought,
    title,
    tags,
  }) {
    const command = new UpdateCommand({
      TableName: this.#config.mainDynamodbTable,
      Key: {
        threadId,
        thoughtId,
      },
      UpdateExpression:
        "set modifiedOn = :modifiedOn, #thought_type = :type, thought = :thought, title = :title, tags = :tags", // For example, "'set Title = :t, Subtitle = :s'"
      ExpressionAttributeValues: {
        ":modifiedOn": modifiedOn,
        ":type": type,
        ":thought": thought,
        ":title": title,
        ":tags": tags,
      },
      ExpressionAttributeNames: {
        "#thought_type": "type",
      },
      ReturnValues: "ALL_NEW",
    });

    const res = await this.send("update", command);
    return res.Attributes;
  }
}

module.exports.DynamoDBService = DynamoDBService;

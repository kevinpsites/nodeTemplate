/* eslint-disable no-console */
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.port || 3000;

const contentTypeKey = "content-type";
const jsonContentType = "application/json";

const lambdaAppServiceName = `lambda-app:8080`;

const lambdaURL = `http://${lambdaAppServiceName}/2015-03-31/functions/function/invocations`;

const getRequest = async (method = "GET", req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: method,
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;

    if (req.contentType) {
      res.setHeader(contentTypeKey, headers[contentTypeKey]);
    } else if (response.headers[contentTypeKey]) {
      res.setHeader(contentTypeKey, headers[contentTypeKey]);
    } else {
      res.setHeader(contentTypeKey, jsonContentType);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log(`${method} - ERROR: `, error.message);
    res.send({
      error: error.message,
    });
  }
};

app.use(express.json());
app.use(express.text());
app.get("/", (req, res) => {
  res.send(`Auth Portal Node listening on port ${port}`);
});

app.get("*", async (req, res) => {
  return await getRequest("GET", req, res);
});

app.post("*", async (req, res) => {
  return await getRequest("POST", req, res);
});

app.put("*", async (req, res) => {
  return await getRequest("PUT", req, res);
});

app.patch("*", async (req, res) => {
  return await getRequest("PATCH", req, res);
});

app.delete("*", async (req, res) => {
  return await getRequest("DELETE", req, res);
});

app.listen(port, () => {
  console.log(`Auth Portal Node listening on port ${port}`);
});

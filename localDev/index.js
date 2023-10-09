/* eslint-disable no-console */
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.port || 3000;

const contentType = "content-type";

const lambdaURL =
  "http://lambda-app:8080/2015-03-31/functions/function/invocations";

app.use(express.json());
app.use(express.text());
app.get("/", (req, res) => {
  res.send(`Auth Portal Node listening on port ${port}`);
});

app.get("*", async (req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: "GET",
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;
    if (req.contentType) {
      res.setHeader(contentType, headers[contentType]);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log("Get Error", error);
    res.send("Failed");
  }
});

app.post("*", async (req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: "POST",
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;
    if (contentType) {
      res.setHeader(contentType, headers[contentType]);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log("Post Error", error);
    res.send("Failed");
  }
});

app.put("*", async (req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: "PUT",
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;
    if (contentType) {
      res.setHeader(contentType, headers[contentType]);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log("Put Error", error);
    res.send("Failed");
  }
});

app.patch("*", async (req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: "PATCH",
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;
    if (contentType) {
      res.setHeader(contentType, headers[contentType]);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log("Put Error", error);
    res.send("Failed");
  }
});

app.delete("*", async (req, res) => {
  try {
    let response = await axios.get(lambdaURL, {
      data: {
        httpMethod: "DELETE",
        path: req.url,
        headers: req.headers,
        body: req.body,
        queryStringParameters: req.query,
      },
    });
    let { body, statusCode, headers } = response.data;
    if (contentType) {
      res.setHeader(contentType, headers[contentType]);
    }
    res.status(statusCode);
    res.send(body);
  } catch (error) {
    console.log("Delete Error", error);
    res.send("Failed");
  }
});

app.listen(port, () => {
  console.log(`Auth Portal Node listening on port ${port}`);
});

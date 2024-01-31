const Koa = require("koa");
const cors = require("koa2-cors");
const routes = require("koa-route");
const app = new Koa();
app.use(cors());

const PORT = 3001;

app.use(
  routes.get("/items", async (ctx) => {
    let response = {
      result: {
        items: [],
      },
      message: "",
      status: "SUCCESS",
    };

    ctx.type = "json";
    ctx.body = response;
  })
);

app.use(
  routes.post("/items", async (ctx) => {
    const newAssessment = genNewAssessment();
    assessments.push(newAssessment);

    let response = {
      result: {
        item: {
          id: "test",
        },
      },
      message: "",
      status: "SUCCESS",
    };

    ctx.type = "json";
    ctx.body = response;
  })
);

app.listen(PORT);
console.log(`Dev Server listening on port ${PORT}`);

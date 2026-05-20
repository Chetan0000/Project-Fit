import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "FIT API Running",
  });
});

export default {
  port: 3001,
  fetch: app.fetch,
};
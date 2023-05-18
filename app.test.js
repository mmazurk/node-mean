const request = require("supertest");
const app = require("./app"); // Assuming your main app file is named "app.js"

describe("GET /mean", () => {
  test("returns the correct mean value", async () => {
    const response = await request(app).get("/mean?nums=1,2,3,4");
    expect(response.status).toBe(200);
    expect(response.body.operation).toBe("mean");
    expect(response.body.value).toBe(2.5);
  });
});


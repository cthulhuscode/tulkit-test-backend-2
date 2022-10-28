import chai from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../..";

process.env.NODE_ENV = "testing";

const should = chai.should();
chai.use(chaiHttp);

describe("Test cases", function () {
  describe("USERS", function () {
    it("Should return the users list, each user with their own completed tasks", async function () {
      const response = await chai.request(server).get("/users");

      response.should.have.status(200);
      response.body.should.be.an("object");
      response.body.data[0].should.have.all.keys([
        "id",
        "name",
        "email",
        "phone",
        "username",
        "tasks",
      ]);
      response.body.data[0].tasks.should.be.an("array");
      if (response.body.data[0].tasks[0].length !== 0)
        response.body.data[0].tasks[0].should.have.all.keys(["id", "title"]);
    });
  });

  describe("TODOS", function () {
    it("Should return the tasks list, each task must include its own user", async function () {
      const response = await chai.request(server).get("/todos");

      response.should.have.status(200);
      response.body.should.be.an("object");
      response.body.data[0].should.have.all.keys([
        "id",
        "title",
        "completed",
        "user",
      ]);
      response.body.data[0].user.should.have.all.keys([
        "id",
        "name",
        "username",
        "email",
      ]);
    });
  });
});

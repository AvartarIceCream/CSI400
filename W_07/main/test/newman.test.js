const newman = require("newman");
const { expect } = require("chai");
const path = require("path");
describe("Postman collection via Newman", function () {
  this.timeout(120000);
  it("collection should have no failures", function (done) {
    newman.run(
      {
        collection: require(path.join(
          __dirname,
          "..",
          "postman",
          "collection.json"
        )),
        environment: require(path.join(__dirname, "..", "postman", "env.json")),
        reporters: ["cli"],
      },
      function (err, summary) {
        if (err) return done(err);
        const failures = summary.run.failures || [];
        try {
          expect(failures.length).to.equal(0);
          done();
        } catch (e) {
          done(e);
        }
      }
    );
  });
});

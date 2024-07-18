const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const solutions = require("../controllers/puzzle-strings.js");
const validPuzzle =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

const invalidPuzzle =
  "..9..5.1.85.4...a2432.X..X.1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const shortPuzzle = "....69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

const solvedPuzzle = validPuzzle.replace(".", "#");
chai.use(chaiHttp);

const requester = chai.request(server).keepOpen();

suite("Functional Tests", () => {
  suite("POST /api/solve -> solve a puzzle ", function () {
    test("with valid puzzle string", function (done) {
      requester
        .post("/api/solve")
        .send({ puzzle: solutions.puzzlesAndSolutions[0][0] })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, {
            solution: solutions.puzzlesAndSolutions[0][1],
          });
          assert.equal(res.status, 200);
          done();
        });
    });

    test("with missing puzzle string", function (done) {
      requester.post("/api/solve").end(function (err, res) {
        if (err) {
          console.error({ error: err });
          done(err);
        }
        assert.deepEqual(res.body, { error: "Required field missing" });
        assert.equal(res.status, 200);
        done();
      });
    });
    test("with invalid characters", function (done) {
      requester
        .post("/api/solve")
        .send({ puzzle: invalidPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with incorrect length", function (done) {
      requester
        .post("/api/solve")
        .send({ puzzle: shortPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("that cannot be solved", function (done) {
      let puzzle = validPuzzle.substring(0, 4) + "5" + validPuzzle.substring(5);
      requester
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }

          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });
  suite("POST /api/check -> check a puzzle placement", function () {
    test("with all fields", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A1", value: 7, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { valid: true });
          assert.equal(res.status, 200);
        });
      requester
        .post("/api/check")
        .send({ coordinate: "C3", value: 2, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { valid: true });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with single placement conflict", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A2", value: 1, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { valid: false, conflict: ["row"] });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with multiple placement conflicts", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A1", value: 1, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row", "column"],
          });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with all placement conflicts", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A2", value: 5, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, {
            valid: false,
            conflict: ["row", "column", "region"],
          });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with missing required fields", function (done) {
      requester.post("/api/check").end(function (err, res) {
        if (err) {
          console.error({ error: err });
          done(err);
        }
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        assert.equal(res.status, 200);
        done();
      });
    });
    test("with invalid characters", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A1", value: 7, puzzle: invalidPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }

          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("with incorrect length", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A1", value: 7, puzzle: shortPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("invalid placement coordinate", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "K2", value: 3, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { error: "Invalid coordinate" });
          assert.equal(res.status, 200);
        });
      requester
        .post("/api/check")
        .send({ coordinate: "A10", value: 7, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { error: "Invalid coordinate" });
          assert.equal(res.status, 200);
          done();
        });
    });
    test("invalid placement value", function (done) {
      requester
        .post("/api/check")
        .send({ coordinate: "A2", value: 10, puzzle: validPuzzle })
        .end(function (err, res) {
          if (err) {
            console.error({ error: err });
            done(err);
          }
          assert.deepEqual(res.body, { error: "Invalid value" });
          assert.equal(res.status, 200);
          done();
        });
    });
  });
});

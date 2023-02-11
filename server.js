const express = require("express");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const diff = require("dialogflow-fulfillment");
var mysql = require("mysql");
var app = express();
app.use(cors());

var con = mysql.createConnection({
  host: "localhost", //when using with other device use ngrok.......
  user: "root",
  password: "",
  database: "SDB",
});

con.connect();

app.post("/", express.json(), (req, res) => {
  const agent = new diff.WebhookClient({
    request: req,
    response: res,
  });

  // function demo(agent){

  //     agent.add("Sending response from Webhook server");
  // }

  async function resultq(agent) {
    let cgpa;
    var sql =
      "SELECT CGPA FROM studentdb WHERE Enrollment_No = " +
      agent.parameters.number[0];
    console.log(sql);
    if (
      agent.parameters.number[0] > 92000103000 &&
      agent.parameters.number[0] < 92000103021
    ) {
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result[0].CGPA);
        cgpa = result[0].CGPA;
        return result[0].CGPA;
      });
      // wait for the query to finish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      agent.add("Your CGPA is " + cgpa);
    } else {
      agent.add("Please enter a valid Enrollment Number!");
    }
  }

  async function fee(agent) {
    var fee_status;
    var resp = "";
    var sql1 =
      "SELECT Fees FROM studentdb WHERE Enrollment_No = " +
      agent.parameters.number[0];
    if (
      agent.parameters.number[0] > 92000103000 &&
      agent.parameters.number[0] < 92000103021
    ) {
      con.query(sql1, function (err, result1) {
        if (err) throw err;
        console.log(result1[0].Fees);
        fee_status = result1[0].Fees;
        return result1[0].Fees;
      });
      // wait for the query to finish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resp = "Your fee is " + fee_status;
    } else {
      resp = "Please enter a valid Enrollment Number!";
    }
    agent.add(resp);
  }

  async function attend(agent) {
    var attendance;
    var resp = "";
    var sql2 =
      "SELECT Attendance FROM studentdb WHERE Enrollment_No = " +
      agent.parameters.number[0];
    if (
      agent.parameters.number[0] > 92000103000 &&
      agent.parameters.number[0] < 92000103021
    ) {
      con.query(sql2, function (err, result2) {
        if (err) throw err;
        console.log(result2[0].Attendance);
        attendance = result2[0].Attendance;
        return result2[0].Attendance;
      });
      // wait for the query to finish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resp = "Your Attendance is " + attendance + "%";
    } else {
      resp = "Please enter a valid Enrollment Number!";
    }
    agent.add(resp);
  }

  async function placement(agent) {
    var cgpa;
    var branch;
    var resp = "";
    var sql2 =
      "SELECT CGPA,Branch FROM studentdb WHERE Enrollment_No = " +
      agent.parameters.number[0];
    if (
      agent.parameters.number[0] > 92000103000 &&
      agent.parameters.number[0] < 92000103021
    ) {
      con.query(sql2, function (err, result2) {
        if (err) throw err;
        console.log("aaaaa", result2[0].cgpa);
        cgpa = result2[0].CGPA;
        branch = result2[0].Branch;
      });
      // wait for the query to finish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("aaa", cgpa);
      // round off cgpa to 0 decimal places
      var cgpa1 = cgpa;
      cgpa = Math.round(cgpa);
      const sql3 =
        "SELECT Companies FROM placement WHERE cgpa > " +
        cgpa +
        " AND branch = '" +
        branch +
        "'";
      // SELECT Companies from placement WHERE CGPA > 8 AND Branch = 'LAW'
      var companies = [];
      con.query(sql3, function (err, result2) {
        if (err) throw err;
        console.log(result2[0].Companies);
        companies = result2;
        // branch = result2[0].Branch;
      });
      // wait for the query to finish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resp =
        "Your eligible companies are " +
        (companies[0].Companies + ", as your CGPA is " + cgpa1);
    } else {
      resp = "Please enter a valid Enrollment Number!";
    }
    agent.add(resp);
  }

  var intentMap = new Map();
  intentMap.set("Result");
  intentMap.set("fees", fee);
  intentMap.set("attendance", attend);
  intentMap.set("Placement", placement);
  agent.handleRequest(intentMap);
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM studentdb WHERE Class = 'FN1'", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/df/server", (req, res) => {
  res.send("Hi, from Server");
});

require("./routes/df-routes")(app);

app.listen(port, () => {
  console.log("server is running");
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      `SELECT * FROM studentdb WHERE Class = '${id}'`,
      function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      }
    );
  });
});

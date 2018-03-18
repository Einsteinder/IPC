const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const redisConnection = require("./redis-connection");

app.use(bodyParser.json());

app.get("/api/people/:id", async (req, res) => {
  redisConnection.emit(`getpeople:${req.params.id}`, {
    requestId: req.params.id
  });
  redisConnection.on(`results-return:${req.params.id}`, (data, channel) => {
    res.json({ data });
  })
  
  });

  app.post("/api/people", async (req, res) => {
    redisConnection.emit("postpeople", {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender:req.body.gender,
      ip_address:req.body.ip_address
    });
    redisConnection.on(`postresults-return`, (data, channel) => {
      res.json({ data });
    })
  });

  app.delete("/api/people/:id", async (req, res) => {
    redisConnection.emit(`deletepeople:${req.params.id}`, {
      requestId: req.params.id
    });
    redisConnection.on(`results-return:${req.params.id}`, (data, channel) => {
      res.json({ data });
    })
    
    });
  
    app.put("/api/people/:id", async (req, res) => {
      redisConnection.emit("updatepeople", {
        id:req.params.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender:req.body.gender,
        ip_address:req.body.ip_address
      });
      redisConnection.on(`updateResults-return`, (data, channel) => {
        res.json({ data });
      })
    });

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

import express from 'express';
const http = require("http");
const fs = require("fs");
const path = require("path")
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;
var corsOptions = {
  origin: 'http://localhost:8080'
}

const resultCache = [];
const config = JSON.parse(fs.readFileSync(path.resolve('config.json')));

app.use(bodyParser.text())
app.options('/', cors(corsOptions));
app.post('/post-number', cors(corsOptions),  (req, res) => {
  const num: number = parseInt(req.body);
  if (Number.isNaN(num) || num < 1 || num > 1000){
    res.sendStatus(500);
    return;
  }
  /*
    Alternative variant.
    result = resultCache.slice(num);
  */
  const result = [];
  for (let i = num - 1; i > 0; i--){
    result.push(i);
  }
  axios.post(config.logServicePath, result).then(()=>{
    res.send(result);
  }).catch((err)=>{
    res.sendStatus(200);
  });
});
app.listen(port, () => {
  console.log(`server config is:`, config);
  console.log(`server is listening on ${port}`);
});

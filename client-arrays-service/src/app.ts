import express from 'express';
const http = require("http");
const fs = require("fs");
const path = require("path")
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const ws = require("ws");
var corsOptions = {
  origin: 'http://localhost:8080'
}
//Node js community are not recommend to use "require" for config
const config = JSON.parse(fs.readFileSync(path.resolve('config.json')));

const app = express();
app.use(bodyParser.text())
app.options('/', cors(corsOptions));

const server = http.createServer(app);
const webSocketServer = new ws.Server({ server });
//For Alternative method of number generation.
/*
const resultCache = [];
for (let i = 999; i > 0; i--){
  resultCache.push(i);
}
*/
function getResult(num: number):Array<number> {
  if (Number.isNaN(num) || num < 1 || num > 1000){
    throw new Error("The number is outside of range, or have incorrect format");
  }
  /*
    Alternative variant.
    result = resultCache.slice(num);
  */
  const result = [];
  for (let i = num - 1; i > 0; i--){
    result.push(i);
  }
  return result;
}

app.post('/post-number', cors(corsOptions),  (req, res) => {
  try{
    let result: Array<number> = getResult(parseInt(req.body));
    axios.post(config.logServicePath, result).then(()=>{
      res.send(JSON.stringify(result));
    }).catch((err)=>{
      res.send(JSON.stringify(result));
    });
  } catch(error){
    res.status(500).send(error.message);
  }
});
server.listen(config.apiPort, () => {
  console.log(`server config is:`, config);
  console.log(`Rest and WS server is listening on ${config.apiPort}`);
});



webSocketServer.on('connection', socket => {
  socket.on('message', (data: number) => {
    try{
      //In general case it is simplier to use text messages over socket
      //But this method faster for server and communication channel
      let result: Int16Array = new Int16Array(getResult(data));
      axios.post(config.logServicePath, result).then(()=>{
        socket.send(result);
      }).catch((err)=>{
        socket.send(result);
      });
    } catch(error){
      socket.emit("error", error.message);
      socket.close();
    }
  });
});

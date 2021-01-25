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

const resultCache = [];
for (let i = 10000000; i > 0; i--){
  resultCache.push(i);
}

console.log("Result cache ready and calculated to 100 000 000");

function getOldResult(num: number):Array<number> {
  if (Number.isNaN(num) || num < 1){
    throw new Error("The number is outside of range, or have incorrect format");
  }
  /*
    Alternative variant.
    result = resultCache.slice(num);
  */
  console.log('\x1b[33m N=', num);
  const timeOld = new Date().valueOf();
  console.log(timeOld);
  const result = [];
  for (let i = num - 1; i > 0; i--){
    result.push(i);
  }
  const timeNew = new Date().valueOf();
  console.log(timeNew);
  console.log('\x1b[32m The "stupid" algorithm from monday result is ', timeNew - timeOld, ' ticks \x1b[0m');
  return result;
}

function getNewResult(num: number):Array<number> {
  if (Number.isNaN(num) || num < 1){
    throw new Error("The number is outside of range, or have incorrect format");
  }
  /*
    Alternative variant.
    result = resultCache.slice(num);
  */
  console.log('\x1b[33m N=', num);
  const timeOld = new Date().valueOf();
  console.log(timeOld);
  const result = resultCache.slice(0, num);
  const timeNew = new Date().valueOf();
  console.log(timeNew);
  console.log('\x1b[32m The new algorithm from monday result is ', timeNew - timeOld, ' ticks \x1b[0m');
  return result;
}

app.post('/post-number', cors(corsOptions),  (req, res) => {
  try{
    let result: Array<number> = getOldResult(parseInt(req.body));
    res.send(JSON.stringify(result));
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
      let result: Uint32Array = new Uint32Array(getNewResult(data));
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

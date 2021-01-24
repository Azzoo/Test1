import express from 'express';
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();
const port = 3001;
var corsOptions = {
  origin: 'http://localhost:8080'
}
app.use(bodyParser.json())
app.options('/', cors(corsOptions));
app.post('/log-info', cors(corsOptions),  (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});
app.listen(port, () => {
  return console.log(`log-server is listening on ${port}`);
});

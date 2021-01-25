import './App.css';
import React, { useState } from 'react';

let socket = null;

function App() {
  const [result, setResult] = useState('waiting for connection');
  let param = 1;

  if (!socket){
    socket = new WebSocket('ws://localhost:3000');
  }

  socket.onopen = () => {
    setResult("ready and connected");
  };

  socket.onclose = () => {
    setResult("connection closed");
  };

  socket.onerror = () => {
    setResult("communication error");
  };

  socket.onmessage = message => {
    //In general case it is simplier to use text messages over socket
    //But this method faster for server and communication channel
    /*
    const fr = new FileReader();
    fr.onload = () => {
        const array = new Uint32Array(fr.result);
        setResult(JSON.stringify(Array.from(array)));
    };
    fr.readAsArrayBuffer(message.data);*/
    console.log(message.length);
  };

  function sendFunction(){
    //The olf rest api usage
    /*
    fetch("http://localhost:3000/post-number", {method: 'POST', body: param+""})
    .then((serviceResult)=>{
      return serviceResult.text()
    })
    .then((data)=>{
      setResult(data);
    })*/
    socket.send(param);
  }
  return (
    <div className="App">
      <header className="App-header">
      <label>Enter number 1-1000 and click the button.</label>
      <input type="text" onChange={(event)=>{param = event.target.value;} } id='testInput'/>
      <button onClick={sendFunction}>Send</button>
      <div id="result">{result}</div>
      </header>
    </div>
  );
}

export default App;

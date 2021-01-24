import './App.css';
import React, { useState } from 'react';

function App() {
  const [result, setResult] = useState('no result');
  let param = 1;
  function sendFunction(){
    fetch("http://localhost:3000/post-number", {method: 'POST', body: param+""})
    .then((serviceResult)=>{
      return serviceResult.text()
    })
    .then((data)=>{
      setResult(data);
    })
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

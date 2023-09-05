import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/*
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
window.addEventListener("DOMContentLoaded",function() {
  renderAskAmount();
  renderAskHoga();
  renderBidHoga();
  renderBidAmount();
  const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
  ws.onopen = function(event) {
    console.log("ws.onopen");
    this.send('[{"ticket":"test"},{"type":"ticker","codes":["KRW-BTC"]},{"type":"orderbook","codes":["KRW-BTC"]}]');
  }
  ws.onclose = function(event) {
    console.log("ws.onclose");
  }
  ws.onerror = function() {
    console.log("ws.onerror");
  }
  ws.onmessage = function(event) {
    const reader = new FileReader();
    reader.readAsText(event.data);
    reader.onload = function() {
      const result = JSON.parse(reader.result as string);
      console.log(result);
      switch(result.type) {
        case "ticker" :
          const tickerData: Ticker = result;
        break;

        case "orderbook" :
          const orderbookData: Orderbook = result;
        break;
      }
    }
  }
  this.window.addEventListener("beforeunload",function() {
    ws.close();
    return "window close";
  });
  const buttonVal = this.document.querySelector("button");
  buttonVal?.addEventListener("click",(e)=>ws.close());
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

function renderAskAmount(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=15;index>0;index--) {
    const item = document.createElement("div");
    item.id = `ask-amount-item${index}`;
    item.classList.add("ask-item");
    item.textContent = `매도잔량${index}`;
    documentFragment.append(item);
  }
  const askAmountArea = document.getElementById("ask-amount-area");
  askAmountArea?.append(documentFragment);
}

function renderAskHoga(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=15;index>0;index--) {
    const item = document.createElement("div");
    item.id = `ask-hoga-item${index}`;
    item.classList.add("ask-item");
    const hogaItem = document.createElement("div");
    hogaItem.id = `ask-hoga${index}`;
    hogaItem.classList.add("hoga-item");
    hogaItem.textContent = `매도호가${index}`;
    item.append(hogaItem);
    const changeRateItem = document.createElement("div");
    changeRateItem.id = `ask-change-rate${index}`;
    changeRateItem.classList.add("change-rate-item");
    changeRateItem.textContent = `변화율${index}`;
    item.append(changeRateItem);
    documentFragment.append(item);
  }
  const askAmountArea = document.getElementById("ask-hoga-area");
  askAmountArea?.append(documentFragment);
}

function renderBidHoga(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=1;index<=15;index++) {
    const item = document.createElement("div");
    item.id = `bid-hoga-item${index}`;
    item.classList.add("bid-item");
    const hogaItem = document.createElement("div");
    hogaItem.id = `bid-hoga${index}`;
    hogaItem.classList.add("hoga-item");
    hogaItem.textContent = `매수호가${index}`
    item.append(hogaItem);
    const changeRateItem = document.createElement("div");
    changeRateItem.id = `bid-change-rate${index}`;
    changeRateItem.classList.add("change-rate-item");
    changeRateItem.textContent = `변화율${index}`;
    item.append(changeRateItem);
    documentFragment.append(item);
  }
  const askAmountArea = document.getElementById("bid-hoga-area");
  askAmountArea?.append(documentFragment);
}

function renderBidAmount(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=1;index<=15;index++) {
    const item = document.createElement("div");
    item.id = `bid-amount-item${index}`;
    item.classList.add("bid-item");
    item.textContent = `매수잔량${index}`;
    documentFragment.append(item);
  }
  const askAmountArea = document.getElementById("bid-amount-area");
  askAmountArea?.append(documentFragment);
}
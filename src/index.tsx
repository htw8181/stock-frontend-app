import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

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
let tickerData: Ticker|null = null;
let tradeDataArray: Trade[] = [];
window.addEventListener("DOMContentLoaded",function() {
  renderAskAmount();
  renderAskHoga();
  renderBidHoga();
  renderBidAmount();
  renderTradeDataArea();

  const marketCode = "KRW-BTC";
  const asyncResult = (async function (code: string) {
    const result = await new Promise(resolve => {
      //체결내역 조회
      axios({
        method:"GET",          
        url: 'https://api.upbit.com/v1/trades/ticks',
        params: { market: code, count: 20}
      }).then(response => {
        resolve(response.data);
      })
      .catch(error => new Error(error));
    });
    return result;
  })(marketCode);
  asyncResult.then(result => {    
    tradeDataArray = result as Trade[];

    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    ws.onopen = function(event) {
      console.log("ws.onopen");
      this.send(`[{"ticket":"test"},{"type":"ticker","codes":[${marketCode}]},{"type":"orderbook","codes":[${marketCode}]},{"type":"trade","codes":[${marketCode}]}]`);
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
            tickerData = result;
            updateTickerData(tickerData);
          break;

          case "orderbook" :
            const orderbookData: Orderbook = result;
            updateOrderbookData(orderbookData);
          break;

          case "trade" :
            const tradeData: Trade = result;
            updateTradeData(tradeData);
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
    }).catch(error => {
      console.log(error);
    });  
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

function renderAskAmount(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=15;index>0;index--) {
    const area = document.createElement("div");
    area.classList.add("ask-item-area");
    
    const askAmountBox = document.createElement("div");
    askAmountBox.id = `ask-amount-box${index}`;
    askAmountBox.classList.add("ask-item-box");
    askAmountBox.style.position = 'absolute';
    area.append(askAmountBox);

    const askAmountItem = document.createElement("div");
    askAmountItem.id = `ask-amount-item${index}`;
    askAmountItem.classList.add("ask-item");
    askAmountItem.style.position = 'relative';
    askAmountItem.textContent = `매도잔량${index}`;
    area.append(askAmountItem);

    documentFragment.append(area);
  }
  const askAmountArea = document.getElementById("ask-amount-area");
  askAmountArea?.append(documentFragment);
}

function renderAskHoga(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=15;index>0;index--) {
    const item = document.createElement("div");
    item.id = `ask-hoga-item${index}`;
    item.classList.add("ask-item-area");
    
    const hogaItem = document.createElement("div");
    hogaItem.id = `ask-hoga${index}`;
    hogaItem.classList.add("hoga-item");
    hogaItem.classList.add("ask-item");
    hogaItem.textContent = `매도호가${index}`;
    item.append(hogaItem);

    const changeRateItem = document.createElement("div");
    changeRateItem.id = `ask-change-rate${index}`;
    changeRateItem.classList.add("change-rate-item");
    changeRateItem.classList.add("ask-item");
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
    item.classList.add("bid-item-area");
    
    const hogaItem = document.createElement("div");
    hogaItem.id = `bid-hoga${index}`;
    hogaItem.classList.add("hoga-item");
    hogaItem.classList.add("bid-item");
    hogaItem.textContent = `매수호가${index}`
    item.append(hogaItem);
    
    const changeRateItem = document.createElement("div");
    changeRateItem.id = `bid-change-rate${index}`;
    changeRateItem.classList.add("change-rate-item");
    changeRateItem.classList.add("bid-item");
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
    const area = document.createElement("div");
    area.classList.add("bid-item-area");

    const bidAmountBox = document.createElement("div");
    bidAmountBox.id = `bid-amount-box${index}`;
    bidAmountBox.classList.add("bid-item-box");
    bidAmountBox.style.position = 'absolute';
    area.append(bidAmountBox);

    const bidAmountItem = document.createElement("div");
    bidAmountItem.id = `bid-amount-item${index}`;
    bidAmountItem.classList.add("bid-item");
    bidAmountItem.style.position = 'relative';
    bidAmountItem.textContent = `매수잔량${index}`;
    area.append(bidAmountItem);

    documentFragment.append(area);
  }
  const askAmountArea = document.getElementById("bid-amount-area");
  askAmountArea?.append(documentFragment);
}

function renderTradeDataArea(): void {
  const documentFragment = document.createDocumentFragment();
  for(let index=20;index>0;index--) {    
    const tradePrice = document.createElement("div");
    tradePrice.id = `trade-price${index}`;
    tradePrice.classList.add("trade-item");
    documentFragment.append(tradePrice);

    const tradeVolume = document.createElement("div");
    tradeVolume.id = `trade-volume${index}`;
    tradeVolume.classList.add("trade-item");
    documentFragment.append(tradeVolume);
  }
  const tradeDataArea = document.getElementById("trade-data-area");
  tradeDataArea?.append(documentFragment);
}

function updateTickerData(data: Ticker|null): void {
  if(data != null) {
    const currentTradePrice = data.trade_price;

    const tradeAmount = document.getElementById('trade-amount');
    if(tradeAmount != null) tradeAmount.textContent = Number(data.acc_trade_volume_24h.toFixed(0)).toLocaleString('ko-KR');

    const tradePrice = document.getElementById('trade-price');
    if(tradePrice != null) tradePrice.textContent = `${Number((data.acc_trade_price_24h * 0.000001).toFixed(0)).toLocaleString('ko-KR')}백만원`;

    const week52HighestPrice = document.getElementById('52week-highest-price');
    if(week52HighestPrice != null) {
      week52HighestPrice.textContent = data.highest_52_week_price.toLocaleString('ko-KR');
      if(data.highest_52_week_price > currentTradePrice) {
        week52HighestPrice.style.color = 'red';
      } else if(data.highest_52_week_price < currentTradePrice) {
        week52HighestPrice.style.color = 'blue';
      } else {
        week52HighestPrice.style.color = 'black';
      }
    }

    const week52HighestPriceDate = document.getElementById('52week-highest-price-date');
    if(week52HighestPriceDate != null) week52HighestPriceDate.textContent = `(${data.highest_52_week_date.replaceAll('-','.')})`;

    const week52LowestPrice = document.getElementById('52week-lowest-price');
    if(week52LowestPrice != null) {
      week52LowestPrice.textContent = data.lowest_52_week_price.toLocaleString('ko-KR');
      if(data.lowest_52_week_price > currentTradePrice) {
        week52LowestPrice.style.color = 'red';
      } else if(data.lowest_52_week_price < currentTradePrice) {
        week52LowestPrice.style.color = 'blue';
      } else {
        week52LowestPrice.style.color = 'black';
      }
    }

    const weekLowestPriceDate = document.getElementById('52week-lowest-price-date');
    if(weekLowestPriceDate != null) weekLowestPriceDate.textContent = `(${data.lowest_52_week_date.replaceAll('-','.')})`;

    const prevClosingPrice = document.getElementById('prev-closing-price');
    if(prevClosingPrice != null) prevClosingPrice.textContent = data.prev_closing_price.toLocaleString('ko-KR');

    const highPrice = document.getElementById('high-price');
    if(highPrice != null) {
      highPrice.textContent = data.high_price.toLocaleString('ko-KR');
      if(data.high_price > data.prev_closing_price) {
        highPrice.style.color = 'red';
      } else if(data.high_price < data.prev_closing_price) {
        highPrice.style.color = 'blue';
      } else {
        highPrice.style.color = 'black';
      }
    }

    const highPriceChangeRate = document.getElementById('high-price-change-rate');
    if(highPriceChangeRate != null) {
      const changeRate = (((data.high_price - data.prev_closing_price) / data.prev_closing_price) * 100).toFixed(2);
      if(data.high_price > data.prev_closing_price) {
        highPriceChangeRate.style.color = 'red';
        highPriceChangeRate.textContent = `+${changeRate}%`;
      } else if(data.high_price < data.prev_closing_price) {
        highPriceChangeRate.style.color = 'blue';
        highPriceChangeRate.textContent = `${changeRate}%`;
      } else {
        highPriceChangeRate.style.color = 'black';
        highPriceChangeRate.textContent = `${changeRate}%`;
      }
    }

    const lowPrice = document.getElementById('low-price');
    if(lowPrice != null) {
      lowPrice.textContent = data.low_price.toLocaleString('ko-KR');
      if(data.low_price > data.prev_closing_price) {
        lowPrice.style.color = 'red';
      } else if(data.low_price < data.prev_closing_price) {
        lowPrice.style.color = 'blue';
      } else {
        lowPrice.style.color = 'black';
      }
    }

    const lowPriceChangeRate = document.getElementById('low-price-change-rate');
    if(lowPriceChangeRate != null) {
      const changeRate = (((data.low_price - data.prev_closing_price) / data.prev_closing_price) * 100).toFixed(2);
      if(data.low_price > data.prev_closing_price) {
        lowPriceChangeRate.textContent = `+${changeRate}%`;
        lowPriceChangeRate.style.color = 'red';
      } else if(data.low_price < data.prev_closing_price) {
        lowPriceChangeRate.textContent = `${changeRate}%`;
        lowPriceChangeRate.style.color = 'blue';
      } else {
        lowPriceChangeRate.textContent = `${changeRate}%`;
        lowPriceChangeRate.style.color = 'black';
      }
    }

    const tradeStrength = document.getElementById('trade-strength');
    //체결강도 : (당일 누적 매수수량 / 당일 누적 매도수량)
    const strength = data.acc_bid_volume / data.acc_ask_volume * 100;
    const strengthSymbol = strength > 0 ? "+" : "";
    if(tradeStrength != null) tradeStrength.textContent = `${strengthSymbol}${(strength).toFixed(2)}%`;
  }
}

function updateOrderbookData(data: Orderbook): void {
  const orderBookUnits: OrderbookUnit[] = data.orderbook_units;
  const totalAskSize = data.total_ask_size;
  const totalBidSize = data.total_bid_size;
  for(let index=1;index<=15;index++) {
    const askSize = orderBookUnits[index-1].ask_size;
    let askGraphWidth = (askSize / totalAskSize * 30);
    if(askGraphWidth > 30) askGraphWidth = 30;
        
    const askAmountBox = document.getElementById(`ask-amount-box${index}`);
    if(askAmountBox != null) askAmountBox.style.width = `${askGraphWidth}%`;

    const askAmountItem = document.getElementById(`ask-amount-item${index}`);
    if(askAmountItem != null) askAmountItem.firstChild!!.textContent = `${askSize.toFixed(3)}`;
    
    const askHogaItem = document.getElementById(`ask-hoga${index}`);
    if(askHogaItem != null) askHogaItem.textContent = `${orderBookUnits[index-1].ask_price.toLocaleString('ko-KR')}`;
    
    const bidHogaItem = document.getElementById(`bid-hoga${index}`);
    if(bidHogaItem != null) bidHogaItem.textContent = `${orderBookUnits[index-1].bid_price.toLocaleString('ko-KR')}`;
   
    const bidSize = orderBookUnits[index-1].bid_size;
    let bidGraphWidth = (bidSize / totalBidSize * 30);
    if(bidGraphWidth > 30) bidGraphWidth = 30;

    const bidAmountBox = document.getElementById(`bid-amount-box${index}`);
    if(bidAmountBox != null) bidAmountBox.style.width = `${bidGraphWidth}%`;

    const bidAmountItem = document.getElementById(`bid-amount-item${index}`);
    if(bidAmountItem != null) bidAmountItem.firstChild!!.textContent = `${bidSize.toFixed(3)}`;

    if(tickerData != null) {
      const prevClosingPrice = tickerData.prev_closing_price;
      const askHoga = orderBookUnits[index-1].ask_price;
      const askChangeRate = (askHoga - prevClosingPrice) / prevClosingPrice * 100;
      const askChangeRateSymbol = askChangeRate === 0 ? "" : (askChangeRate > 0 ? "+" : "-");
      const askChangeRateItem = document.getElementById(`ask-change-rate${index}`);
      if(askChangeRateItem != null) askChangeRateItem.textContent = `${askChangeRateSymbol}${askChangeRate.toFixed(2)}%`;

      const bidHoga = orderBookUnits[index-1].bid_price;
      const bidChangeRate = (bidHoga - prevClosingPrice) / prevClosingPrice * 100;
      const bidChangeRateSymbol = bidChangeRate === 0 ? "" : (bidChangeRate > 0 ? "+" : "-");
      const bidChangeRateItem = document.getElementById(`bid-change-rate${index}`);
      if(bidChangeRateItem != null) bidChangeRateItem.textContent = `${bidChangeRateSymbol}${bidChangeRate.toFixed(2)}%`;
    }
  }
}

function updateTradeData(data: Trade): void {
  if(tradeDataArray.length >= 20) {
    tradeDataArray.shift();
  } 
  tradeDataArray.push(data);

  for(let index=20;index>0;index--) {    
    const tradePrice = document.getElementById(`trade-price${index}`);
    if(tradePrice != null) {
      tradePrice.textContent = tradeDataArray[index-1].trade_price.toLocaleString('ko-KR');
    }

    const tradeVolume = document.getElementById(`trade-volume${index}`);
    if(tradeVolume != null) {
      const textColor = tradeDataArray[index-1].ask_bid === 'ASK' ? 'blue' : 'red';
      tradeVolume.textContent = tradeDataArray[index-1].trade_volume.toFixed(3);
      tradeVolume.style.color = textColor;
    }
  }
}
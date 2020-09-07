/* The single strategy is intended to automatically trade the fluxuations
 * in a single stock.
 *
 * It functions by simple reading the SMA and RSI indicators. Intended for
 * use with larger cap stocks with more liquidity.
 *
 */

class Single {
  constructor(stock, money, percent) {
    // Initialize constants for money use
    this.use = money * percent;
    this.percent = percent;
    this.money = money;
    this.data = {};
    this.stock = stock;
    this.sma = {};

    // Create WebSocket connection
    const WebSocket = require("ws");
    this.socket = new WebSocket(
      "wss://ws.finnhub.io?token=" + require("../config/key")
    );

    // register the stock, Connection opened -> Subscribe
    this.socket.on("open", (event) => {
      console.log("Now Single trading " + this.stock);
      this.socket.send(JSON.stringify({ type: "subscribe", symbol: stock }));
    });

    // Listen for messages
    this.socket.on("message", (event) => {
      let data = JSON.parse(event).data;
      if (data) {
        this.data = JSON.parse(event).data[0];
      } else {
        console.log("No Data");
      }
    });
  }

  currentTime() {
    Math.floor(+new Date() / 1000);
  }

  price() {
    return this.data.p;
  }

  run(finnhubClient) {
    let int = setInterval(
      (client) => {
        console.log(this.price());

        // get SMA value
        client.technicalIndicator(
          this.stock,
          "1",
          currentTime() - 1,
          currentTime(),
          "sma",
          9,
          (error, data, response) => {
            console.log(data);
          }
        );
      },
      1000,
      finnhubClient
    );
  }

  done() {
    this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
  }
}

module.exports = Single;

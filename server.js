const finnhub = require("finnhub");

const key = require("./config/key");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = key;
const finnhubClient = new finnhub.DefaultApi();

// Strategies
const Single = require("./strategies/single");
//const swing = require("./strategies/swing");

var money = 10000; // money to begin the simulation with

var single = new Single("AAPL", money, 0.05);

single.run();

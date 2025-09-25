const { setup } = require('../lib/setup'); //import setup function
setup(); //first setup invocation
setup(); //second setup invocation
const axios = require('axios'); //load axios after setup
const winston = require('winston'); //load winston after setup
const stubAxios = require('../stubs/axios'); //reference stub for axios
const stubWinston = require('../stubs/winston'); //reference stub for winston
const result = { //prepare result object for parent test
  axiosStub: axios === stubAxios, //true if axios is stub
  winstonStub: winston === stubWinston //true if winston is stub
};
console.log(JSON.stringify(result)); //output result

const express = require("express");
const { extractExcel } = require("./services/excelExtractor");
const { sendSms } = require("./services/smsMessenger");
// const cors = require(cors());

// const app = express();

// const port  = 3000;

// app.use(cors())

extractExcel("Book.xlsx").then(res => {
    console.log(res.length);
})

//sendSms();



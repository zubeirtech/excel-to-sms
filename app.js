const express = require("express");
const { extractExcel } = require("./services/excelExtractor");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { sendSms } = require("./services/smsMessenger");
const cors = require("cors");

const app = express();

const port  = 3000;

app.use(express.urlencoded({ extended: false }));

app.use(cors())


// extractExcel("Book.xlsx").then(res => {
//     console.log(res.length);
// })

//sendSms();

app.post('/token', async (req, res) => {
    try {        
        const { username, password, grant_type } = req.body;
        const raw = fs.readFileSync('./db.json');
        const db = JSON.parse(raw);

        if (grant_type === 'password') {
            if(username === db.username && password === db.password) {
                const payload = {
                    secret: "addis"
                }
                const token = await jwt.sign(payload, process.env.JWT_SECRET);
                res.status(200).send(`{ "access_token": "${token}"}`);
            }
        } else {
            res.status(400).send('{"error": "invalid_grant"}');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
})


const { PORT } = process.env;
app.listen(PORT || 3000, console.log(`Server started on port ${PORT}`));
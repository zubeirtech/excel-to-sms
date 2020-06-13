const express = require("express");
const { extractExcel } = require("./services/excelExtractor");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { sendSms } = require("./services/smsMessenger");
const cors = require("cors");

const app = express();

const port  = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(fileUpload());


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
                    secret: process.env.SECRET
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
});

app.post('/upload', async (req, res) => {
    try {
        const file = req.files.file;
        if (!req.files || Object.keys(req.files).length === 0) {
          res.status(400).send('No files were uploaded.');
          next()
          return;
        }      
  
        const uploadPath = `./files/${file.name}`;
  
        file.mv(uploadPath, function (err) {
          if (err) {
            console.log(err);
            return res.status(500).send('Error');
            next()
          }
         });
  
        // fs.unlinkSync(uploadPath, (err) => {
        //   if (err) {
        //     console.error(err)
        //     return
        //   }
  
        //   //file removed
        // })
  
  
        res.status(200).send('File uploaded succesfully');
    } catch (error) {
        console.error(error);
        // await fs.unlinkSync(uploadPath)
    }
})

app.post('/send-sms', async (req, res) => {
    try {
        
    } catch (error) {
        throw error;
    }
})


const { PORT } = process.env;
app.listen(PORT || 3000, console.log(`Server started on port ${PORT}`));
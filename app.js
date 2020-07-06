const express = require("express");
const { extractExcel } = require("./services/excelExtractor");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const { sendSms } = require("./services/smsMessenger");
const cors = require("cors");
const Sentry = require('@sentry/node');


const app = express();

Sentry.init({ dsn: 'https://add1676dcffa49c9b601287d272cae5d@o297291.ingest.sentry.io/5275888' });

app.use(Sentry.Handlers.requestHandler());

app.use(cors());


app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

    
    app.get('/debug-sentry', function mainHandler(req, res) {
        throw new Error('My first Sentry error!');
    });
    
    app.post('/token', async(req, res) => {
        try {
            const { username, password, grant_type } = req.body;
            const raw = fs.readFileSync('./db.json');
            const db = JSON.parse(raw);
            
            if (grant_type === 'password') {
                if (username === db.username && password === db.password) {
                    const payload = {
                        secret: process.env.SECRET
                    }
                    const token = await jwt.sign(payload, process.env.JWT_SECRET);
                    res.status(200).send(`{ "access_token": "${token}"}`);
                } else {
                    res.status(400).send('{"error": "password or username wrong"}')
                }
            } else {
                res.status(400).send('{"error": "invalid_grant"}');
            }
        } catch (error) {
            console.log(error);
            res.status(400).send('{ "error": "unsupported_grant_type" }');
        }
    });
    
    app.post('/upload', async(req, res) => {
        try {
            const file = req.files.file;
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            next()
            return;
        }
        
        const uploadPath = `./files/${file.name}`;
        
        file.mv(uploadPath, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send('Error');
            }
        });
        
        //await fs.unlinkSync(uploadPath)
        
        res.status(200).send({
            success: true,
        });
    } catch (error) {
        res.status(500).send(error);
        // await fs.unlinkSync(uploadPath)
    }
})

app.post('/send-sms', async(req, res) => {
    try {        
        const { fileName, message } = req.body;
        const filePath = `./files/${fileName}`;
        
        extractExcel(fileName).then(nums => {
            //sendSms(nums, message);
        });
        fs.unlinkSync(filePath, (err) => {
            if (err) {
                console.error(err)
                return
            }
        });
        res.status(200).send({ success: true });
        
    } catch (error) {
        res.status(500).send(error);
        throw error;
    }
});


app.post('/credentials', async(req, res) => {
    try {
        const { username, password, token } = req.body;
        console.log(token);
        
        await jwt.verify(token, process.env.JWT_SECRET);
        
        const rawdata = fs.readFileSync('db.json');
        const db = JSON.parse(rawdata);
        
        if(username) {
            db.username = username;
        }
        
        if(password) {
            db.password = password;
        }
        
        fs.writeFileSync('db.json', JSON.stringify(db));
        
        res.status(200).send({ success: true });
        
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

app.use(Sentry.Handlers.errorHandler());

const { PORT } = process.env;
app.listen(PORT || 3000, console.log(`Server started on port ${PORT}`));
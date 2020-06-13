require('dotenv').config();
const TMClient = require('textmagic-rest-client');

const c = new TMClient(process.env.TMUSERNAME, process.env.TMKEY);

module.exports = {
    async sendSms(numbers) {
        c.Messages.send({text: 'this is a test message from zubeir', phones: numbers}, function(err, res) {
            if(err) {
                console.error(err);
            } else {
                console.log("Messages send ", res);
            }
        })
    }
}
const express = require('express')
const request = require('request-promise')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message'
const CAToken = 'DlAZ42w+L6TXQUzGH2+3xgCocmWkWUgzw9BdJ27hGabA7Vux7An3eHnLtigyOV/hYkHatr+1z0C+mqAQcrR6yTaa6o/JtvJRKxiHL9RJ8oA/BaiI2BG4wd1wCGQSE6cLN61wJtnI4vhAfYrwsnB5gwdB04t89/1O/w1cDnyilFU='
const LINE_HEADER = {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${CAToken}`
}

const sendMessage = (bodyResponse, res) => {
    //let userId = bodyResponse.events[0].source.userId
    let replyToken = bodyResponse.events[0].replyToken
    //let message = bodyResponse.events[0].message.text
    let messageStr = JSON.stringify(bodyResponse)

    return request.post({
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: replyToken,
            messages: [{
                type: 'text',
                text: messageStr
            }]
        })
    }).then(() => {
        return res.status(200).send('Done')
    }).catch((error) => {
        return Promise.reject(error)
    })
}

app.post('/webhookLineBot', (req, res) => {
    if (req.body.events[0].type !== 'message') {
        const ret = { message: 'Text not found' }
        return res.status(400).send(ret)
    }
    sendMessage(req.body, res)
    res.status(200)
})

app.get('/', (req, res) => {
    //res.json({ message: 'H! Chat Bot' })
    res.send('Welcome to Chat Bot API...')
})
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})


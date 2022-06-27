//const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("./debug/consolelogs")
const express = require('express')
const app = express()

app.use(express.static(__dirname+"/test_webpage"))
const PORT = process.env.PORT || 3000

app.get("/", (req,res) => {
    res.render(index)
})

app.listen(PORT, () => {
    console.log(`Application ouverte sur le port ${PORT}`)
})
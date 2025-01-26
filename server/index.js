const express = require("express")
const path = require("path")
const app = express()
const bunyan = require('bunyan');
const port = process.env.PORT || 3001

const log = bunyan.createLogger({
    name: 'bunyan-best-practices',
    serializers: bunyan.stdSerializers
});



app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("/api/hello", (req, res) => {
    // Correct
log.info({
   
    requestId: '268c3da8-a068-4c85-9a94-a845f8199f5f'
}, 'Hello from the server!');
  res.json({ message: "Hello from the server!" })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

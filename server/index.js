const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the server!" })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"))
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

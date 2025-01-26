import React, { useState, useEffect } from "react"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>React and Node.js Sample</h1>
      <p>{message}</p>
    </div>
  )
}

export default App


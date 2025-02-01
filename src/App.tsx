import React, { useState, useEffect } from "react"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">React1 and Node.js Sample</h1>
      <p className="text-xl">{message}</p>
    </div>
  )
}

export default App
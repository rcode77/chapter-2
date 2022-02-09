// Pemanggilan Package Express
const express = require('express')

// Menggunakan Package Express
const app = express()

// Set Endpoint
app.get('/', function (req, res) {
    res.send("Hello World")
})

// Konfigurasi Port Aplikasi
const port = 5000
app.listen(port, function () {
    console.log(`Server running on port ${port}`)
})
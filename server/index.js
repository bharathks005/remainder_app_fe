const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const ngrok = require('@ngrok/ngrok');
const path = require('path');
require('dotenv').config();


// Middleware to parse JSON
app.use(express.json());

app.use(express.static("../build"));

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ngrok.connect({ addr: PORT, authtoken: process.env.NGROK_TOKEN })
    .then(listener => {
      console.log(`Ingress established at: ${listener.url()}`);
    });
});

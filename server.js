const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const rateLimit = 50; // Maximum requests per second
const requestHistory = [];
const maxRequests = 1000;

app.use(express.static(__dirname));

app.use(express.json());

app.post('/api', (req, res) => {
  const currentTime = Date.now();
  
  while (requestHistory.length > 0 && requestHistory[0] <= currentTime - 1000) {
    requestHistory.shift();
  }

  if (requestHistory.length >= rateLimit) {
    return res.status(429).send('Too Many Requests');
  }

  requestHistory.push(currentTime);

  const delay = Math.floor(Math.random() * 1000) + 1;
  setTimeout(() => {
    res.send({ index: req.body.index });
  }, delay);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

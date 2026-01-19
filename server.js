#!/usr/bin/env node
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const queryParams = parsedUrl.searchParams;
  
  // Get the 'a' and 'b' query parameters
  const a = parseInt(queryParams.get('a') || 0);
  const b = parseInt(queryParams.get('b') || 0)  ;
  let c = a + b;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`The message is: ${c}`);
});

server.listen(3000, () => {
  console.log('Server on port 3000');
});

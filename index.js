const http = require('http');
const net = require('net');

const server = net.createServer((socket) => {
  const headers = [
    'HTTP/1.1 200 OK',
    'Server: nginx/1.26.1',
    'Date: Mon, 19 May 2025 15:37:11 GMT',
    'Content-Type: text/event-stream',
    'Connection: Keep-Alive',
    'Cache-Control: no-cache',
    'Some-Custom-Header: test',
  ].join('\r\n');

  socket.write(headers);

  let counter = 0;
  const intervalId = setInterval(() => {
    socket.write(`data: Event ${counter++}\r\n\r\n`);
  }, 1000);

  socket.on('close', () => clearInterval(intervalId));
});

server.listen(8081, () => {
  console.log('SSE server running on port 8081');
});


function startClient(targetUrl) {
    const proxy = { hostname:'192.168.0.9', port: 9091 };

    const options = {
        protocol: 'http:',
        hostname: proxy.hostname,
        port: proxy.port,
        path: targetUrl, 
        headers: {
            'Host': 'localhost:8081',
            'Connection': 'Keep-Alive',
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'gzip',
            'User-Agent': 'okhttp/4.12.0'
        }
    };

    const req = http.request(options, (res) => {
        Object.entries(res.headers).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
    });

    req.end();
}

startClient('http://localhost:8081/events');
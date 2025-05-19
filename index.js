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
    'Some-Custom-Header: Custom 1',
    'X-Custom-Header: Custom 2',
    '', // <== This empty string adds the required \r\n
    ''  // <== Ensures final output ends with \r\n\r\n
  ].join('\r\n');

  socket.write(headers); // Headers + \r\n\r\n now correctly sent

  let counter = 0;
  const intervalId = setInterval(() => {
    const chunk = `data: Event ${counter++}\n\n`;
    socket.write(chunk);
  }, 1000);

  socket.on('close', () => clearInterval(intervalId));
});

server.listen(8081, () => {
  console.log('SSE server running on port 8081');
});

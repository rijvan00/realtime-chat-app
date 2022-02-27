var http = require('http')
var fs = require('fs')
var path = require('path')
const APP_PORT = process.env.PORT || 3000
const app = http.createServer(requestHandler)

app.listen(APP_PORT)

// handles all http requests to the server
function requestHandler(request, response) {
  // append /client to serve pages from that folder
  var filePath = './client' + request.url
  if (filePath == './client/') {
    // serve index page on request /
    filePath = './client/index.html'
  }
  var extname = String(path.extname(filePath)).toLowerCase()
  var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  }
  var contentType = mimeTypes[extname] || 'application/octet-stream'
  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        fs.readFile('./client/404.html', function (error, content) {
          response.writeHead(404, { 'Content-Type': contentType })
          response.end(content, 'utf-8')
        })
      } else {
        response.writeHead(500)
        response.end('Sorry, there was an error: ' + error.code + ' ..\n')
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}
const io = require('socket.io')(app, {
    path: '/socket.io',
  })
  
  // io.attach(app, {
  //   // includes local domain to avoid CORS error locally
  //   // configure it accordingly for production
  //   cors: {
  //     origin: 'http://localhost:5500',
  //     methods: ['GET', 'POST'],
  //     credentials: true,
  //     transports: ['websocket', 'polling'],
  //   },
  //   allowEIO3: true,
  // })
  const users = {};


  io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    socket.on('send', message =>{
      socket.broadcast.emit('receive', {message: message, name: users[socket.
      id]})
  });
   
  socket.on('disconnect', name =>{
      socket.broadcast.emit('left', users[socket.id])
      delete users[socket.id];
  });
  });







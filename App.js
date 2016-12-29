var http = require('http');
var express = require('express')
	, app = express()
	, server = http.createServer(app).listen(8080)
	, io = require('socket.io').listen(server);

app.set('view engine', 'jade');

app.use(express.static(__dirname));

app.get('/draw', function(req, res) {
    res.render('draw.jade');
});

io.on('connection', function (socket) {
  console.log('connec');
  // (2): The server recieves a ping event
  // from the browser on this socket
  socket.on('ping', function ( data ) {
  
    console.log('socket: server recieves ping (2)');

    // (3): Emit a pong event all listening browsers
    // with the data from the ping event
    io.sockets.emit( 'pong', data );   
    
    console.log('socket: server sends pong to all (3)');
  });
  socket.on( 'drawCircle', function( data, session ) {

    console.log( "session " + session + " drew:");
    console.log( data );


    socket.broadcast.emit( 'drawCircle', data );

});
});


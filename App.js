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

  socket.on( 'drawEmit', function( data, session, strokeColor, strokeWidth ) {
    console.log( "session " + session + " drew sth");
    socket.broadcast.emit( 'drawEmit', data, strokeColor, strokeWidth);
  });
  socket.on( 'undoEmit', function(session) {
    console.log( "session " + session + " undid sth");
    socket.broadcast.emit( 'undoEmit');
  });
});


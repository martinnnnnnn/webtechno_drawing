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

  socket.on( 'drawEmit', function(session, path) {
    console.log( "session " + session + " drew sth");
    socket.broadcast.emit( 'drawEmit', path);
  });
  socket.on( 'undoEmit', function(session) {
    console.log( "session " + session + " undid sth");
    socket.broadcast.emit( 'undoEmit');
  });
  socket.on( 'changeEmit', function(session, oldPathData, newPathData) {
    console.log( "session " + session + " changed sth");
    socket.broadcast.emit( 'changeEmit',oldPathData, newPathData);
  });
  socket.on( 'delEmit', function(session, pathData) {
    console.log( "session " + session + " deleted sth");
    socket.broadcast.emit( 'changeEmit',pathData);
  });
  socket.on( 'sendEmit', function(session, paths) {
    console.log( "session " + session + " sent sth");
    socket.broadcast.emit( 'sendEmit',paths);
  });
});


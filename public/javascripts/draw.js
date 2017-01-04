var socket = io.connect('/');

paper.install(window);

paper.setup('draw');

var path;
var strokeColor = 'black';
var tools = new Array();
var paths = new Array();
var eraseWidth = 40;

//Tool 0
tools[0] = new Array();
tools[0][1] = 'eraser';
tools[0][0] = new Tool();
tools[0][0].onMouseDown = function(event) {
	path = new Path();
	path.add(event.point);
	path.strokeColor = 'white';
	path.strokeWidth = eraseWidth;
};

tools[0][0].onMouseDrag = function(event) {
	path.add(event.point);
}
tools[0][0].onMouseUp = function(event){
	paths.push(path);
	drawEmit(path.pathData, 'white', eraseWidth);
}

//Tool 1
tools[1] = new Array();
tools[1][1] = 'freeLine';
tools[1][0] = new Tool();
tools[1][0].onMouseDown = function(event) {
	path = new Path();
	path.add(event.point);
	strokeColor = 'black';
	path.strokeColor = strokeColor;
};

tools[1][0].onMouseDrag = function(event) {
	path.add(event.point);
}

tools[1][0].onMouseUp = function(event){
	paths.push(path);
	drawEmit(path.pathData, strokeColor);
}

//Tool 2
tools[2] = new Array();
tools[2][1] = 'circle';
tools[2][0] = new Tool();
tools[2][0].onMouseDown = function(event) {
	strokeColor = 'black';
	path = new Path.Circle({
		center: event.point,
		radius: 30,
		strokeColor: strokeColor
	});
}
tools[2][0].onMouseDrag = function(event) {
	path.position = event.point;
}
tools[2][0].onMouseUp = function(event) {
	paths.push(path);
	drawEmit(path.pathData, strokeColor);
}

//Tool 3
tools[3] = new Array();
tools[3][1] = 'rectangle';
tools[3][0] = new Tool();
tools[3][0].onMouseDown = function(event) {
	strokeColor = 'black';
	path = new Path.Rectangle({
		position: event.point,
		size: new Size(80,40),
		strokeColor: strokeColor
	});
}
tools[3][0].onMouseDrag = function(event) {
	path.position = event.point;
}
tools[3][0].onMouseUp = function(event) {
	paths.push(path);
	drawEmit(path.pathData, strokeColor);
}

//Tool 4
tools[4] = new Array();
tools[4][1] = 'straightLine';
tools[4][0] = new Tool();
tools[4][0].onMouseDown = function(event) {
	path = new Path();
	path.add(event.point);
	path.add(event.point);
	strokeColor = 'black';
	path.strokeColor = strokeColor;
};

tools[4][0].onMouseDrag = function(event) {
	path.lastSegment.point = event.point;
}
tools[4][0].onMouseUp = function(event){
	path.add(event.point);
	paths.push(path);
	drawEmit(path.pathData, strokeColor);
}

//Create buttons to switch tools
for(i = 0; i < tools.length; i++){
	var btn = document.createElement("BUTTON");
	var t = document.createTextNode(tools[i][1]);
	btn.appendChild(t);
	btn.setAttribute("id", "b"+i);
	btn.setAttribute("class", "toolButton");
	btn.addEventListener('click', function(index) { 
            return function () {
                tools[index][0].activate();
            };
        }(i), true);
	document.body.appendChild(btn);
}

//Undo button
$("#undo").click(function(){
	if(paths.length > 0){
		paths[paths.length - 1].remove();
		paths.pop();
		undoEmit();
	}
});

//Emit SVG-Data to server
function drawEmit(pathData, strokeColor, strokeWidth){
	var sessionId = socket.io.engine.id;
	socket.emit('drawEmit', pathData, sessionId, strokeColor, strokeWidth);
	console.log("you drew sth");
}

//Emit Undo-Event
function undoEmit(){
	var sessionId = socket.io.engine.id;
	socket.emit('undoEmit', sessionId);
	console.log("you undid sth");
}

//Receive and draw SVG-Data from other clients
socket.on('drawEmit', function(pathData, strokeColor, strokeWidth){
	console.log("sth has been drawn");
	var foreignPath = new Path(pathData);
	foreignPath.strokeColor = strokeColor;
	if(strokeWidth != null && strokeWidth != undefined){	
		foreignPath.strokeWidth = strokeWidth;
	}
	paths.push(foreignPath);
});

//Receive Undo-Event and undo last path
socket.on('undoEmit', function(){
	paths[paths.length - 1].remove();
	paths.pop();
	console.log("sth has been undone");
});

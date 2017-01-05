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
tools[0][1] = 'erase';
tools[0][0] = new Tool();
var index;

tools[0][0].onMouseDown = function(event) {
	index = grab(event.point);
};

tools[0][0].onMouseUp = function(event){
	if(index != null){
		delEmit(paths[index].pathData);
		paths[index].remove();
		paths.splice(index,1);
	}
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
	drawEmit(path);
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
	drawEmit(path);
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
	drawEmit(path);
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
	drawEmit(path);
}

//Tool 5
tools[5] = new Array();
tools[5][1] = 'move';
tools[5][0] = new Tool();
var oldPathData;
var index;
tools[5][0].onMouseDown = function(event) {
	index = grab(event.point);
	if(index != null){
		path = paths[index];		
		oldPathData = path.pathData
	}
};

tools[5][0].onMouseDrag = function(event) {
	if(index != null){	
		path.position = event.point;
	}
}
tools[5][0].onMouseUp = function(event){
	if(index != null){	
		changeEmit(oldPathData, path.pathData);
	}
}

//Grab item at point
function grab(point){
	for(i = paths.length - 1; i >= 0; i--){
		if(paths[i].hitTest(point, {fill: true, stroke: true, segments: true, tolerance: 20}) != null ){
			return i;
		}
	}
	return null;
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

//Send button
$("#send").click(function(){
	if(paths.length > 0){
				
		//sendEmit(project.exportJSON(););
	}
});

//Emit Draw-Event to server
function drawEmit(path){
	var sessionId = socket.io.engine.id;
	socket.emit('drawEmit', sessionId, path.exportJSON());
	console.log("you drew sth");
}

//Emit Undo-Event
function undoEmit(){
	var sessionId = socket.io.engine.id;
	socket.emit('undoEmit', sessionId);
	console.log("you undid sth");
}

//Emit Change-Event, i.e. move
function changeEmit(oldPathData, newPathData){
	var sessionId = socket.io.engine.id;
	socket.emit('changeEmit', sessionId, oldPathData, newPathData);
	console.log("you changed sth");
}

//Emit Delete-Event
function delEmit(pathData){
	var sessionId = socket.io.engine.id;
	socket.emit('delEmit', sessionId, pathData);
	console.log("you deleted sth");
}

//Emit Send-Event
function sendEmit(paths){
	var sessionId = socket.io.engine.id;
	socket.emit('sendEmit', sessionId, paths);
	console.log("you send sth");
}

//Receive Draw-Event from other clients
socket.on('drawEmit', function(newPath){
	console.log("sth has been drawn");
	path = new Path();
	path.importJSON(newPath);
	paths.push(path);
});

//Receive Undo-Event and undo last path
socket.on('undoEmit', function(){
	if(paths.length > 0){
		paths[paths.length - 1].remove();
		paths.pop();
		console.log("sth has been undone");
	}
});

//Receive Change-Event and apply changes
socket.on('changeEmit', function(oldPathData, newPathData){
	for(i = paths.length - 1; i >= 0; i--){
		if(paths[i].pathData == oldPathData){
			paths[i].pathData = newPathData;
			console.log("sth has been changed");	
			break;
		}
	}
});

//Receive Delete-Event and delete path
socket.on('changeEmit', function(pathData){
	for(i = paths.length - 1; i >= 0; i--){
		if(paths[i].pathData == pathData){
			paths[i].remove();
			paths.splice(i,1);
			console.log("sth has been deleted");
			break;
		}
	}
});

//Receive Send-Event and apply new paths
socket.on('sendEmit', function(newPaths){
	var b = 0;
	for(i = 0; i < newPaths.length; i++){
		for(j = 0; j < paths.length; j++){
		 	if (paths[j].pathData == newPaths[i].pathData){
				b = 1;
				alert("gleich");
				break;
			}
		}	 
		if(b==0){
			path = new Path(newPaths[i].pathData);
			path.strokeColor = 'black';
			paths.push(path);	
		}else{
			b = 0;
		}	
	}
	console.log("sth has been sent");
});

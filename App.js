var app = require('express')();
//var bodyParser = require('body-parser')
//app.use(bodyParser.json());

app.use(require('./middleware/serviceMiddleware')());

app.use('/api/mitarbeiter', require('./routes/mitarbeiterRoute'));

//catch 404
app.use(function(req,res,next){
	var err = new Error('Not Found')
	err.status = 404; next(err);
});

app.listen(8080,console.log('App listening on port 8080'));

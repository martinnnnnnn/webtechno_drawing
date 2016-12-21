var DBManager = require('./DBManager');
var db, mitarbeiterCollection;

module.exports = function mitarbeiterService(dbURL){
	DBManager.getConnection(dbURL,(database)=>{
		db = database;
		mitarbeiterCollection = db.collection('mitarbeiter');
	});

	mitarbeiterService.listAll=(callback)=>{
		mitarbeiterService.listAllByQuery({},callback);
	}

	mitarbeiterService.listAllByQuery = (query,callback)=>{
		mitarbeiterCollection.find(query).toArray((err,array)=>{
			if(err) throw err;
			callback(array);
		})
	}
	
	mitarbeiterService.create = (data,callback)=>{
		mitarbeiterCollection.insertOne(data);
		callback();
	}

	mitarbeiterService.deleteById = (query,callback)=>{
		mitarbeiterCollection.deleteOne(query);
		callback();
	}	

	return mitarbeiterService;
}

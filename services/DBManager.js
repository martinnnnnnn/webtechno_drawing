var MongoClient = require('mongodb').MongoClient;
var connections = new Map();

module.exports={
	getConnection:(dbURL,callback)=>{
		if(!dbURL || dbURL.length === 0){
			console.log("error:empty string");
			return;
		}
		var connectionPool = connections.get(dbURL);
		if(connectionPool){
			callback(connectionPool);
		}else{
			MongoClient.connect(dbURL,(err,connectionPool)=>{
				if(err) throw err;
				connections.set(dbURL, connectionPool);
				callback(connectionPool);
			});
		}
	}
};

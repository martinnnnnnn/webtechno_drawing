var DBManager = ('../services/DBManager');
var router = require('express').Router()

router.get('/:mID',function(req,res,next){
	var id = require('mongodb').ObjectID(req.params.mID);
	req.services.mitarbeiter.listAllByQuery({"_id": id}, (array)=>res.send(array))
});

router.get('/',function(req,res,next){
	req.services.mitarbeiter.listAll((array)=>res.send(array));

});

router.post('/',function(req,res,next){
	var firstname = req.param('firstname');
	var surname = req.param('surname');
	var age = req.param('age');
	var hours = req.param('hours');
	req.services.mitarbeiter.create({"firstname": firstname, "surname": surname, "age": age, "hours": hours},()=>res.send("Done"));
});

router.delete('/',function(req,res,next){
	var qid = require('mongodb').ObjectID(req.param('id'));
	req.services.mitarbeiter.deleteById({"_id": qid},()=>res.send("Done"));
});

module.exports = router;

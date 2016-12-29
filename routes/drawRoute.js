var router = require('express').Router()

router.get('/',function(req,res,next){
	res.render('draw',{pagetitle:'draw!'});
});

module.exports = router;

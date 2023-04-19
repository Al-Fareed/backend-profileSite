const express = require('express');

const router = express.Router(); 

router.get('/',(req,res,next)=>{
    console.log('GET request in Places');
    res.json({message:'Working bro!'});
});

module.exports = router;
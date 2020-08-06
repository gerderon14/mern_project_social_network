const express = require('express');

const router = express.Router();
const {check,validationResult}=require('express-validator/check')
// route GET api/users

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Invalid email').isEmail(),
    check('password','Passwordlenght must be >5 symbols').isLength({min:6})],
    (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    console.log(req.body)
    res.send('Users route')
})
module.exports = router;
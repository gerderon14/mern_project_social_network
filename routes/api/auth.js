const express = require('express');
const auth = require('../../middleware/auth')
const router = express.Router();
const User = require('../../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


// route GET api/auth

router.get('/',auth, async(req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }catch (err) {
        console.error(err.massage)
        res.status(500).send('Server error')
    }
})

router.post('/',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password is required').exists()
    ]
    ,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email,password} = req.body
        try {
            //See if user exists
            let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({errors:[{msg:'Invalid credentials'}]})
            }


            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({errors:[{msg:'Invalid credentials'}]})
            }


            const payload= {
                user:{
                    id:user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn:360000},
                (err,token)=>{
                    if(err) throw err;
                    res.json({token,id:payload.user.id})
                })
            // res.send('User registred')
        }catch (err) {
            console.error(err.massage);
            res.status(500).send('Server error')
        }



    })
module.exports = router;
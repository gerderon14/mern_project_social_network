const express = require('express');
const gravatar = require('gravatar')
const router = express.Router();
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
// route post api/users

const User = require('../../models/User')

router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password lenght must be >5 symbols').isLength({min: 6})],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {name,email,password} = req.body
        try {
            //See if user exists
            let user = await User.findOne({email})
            if(user){
                return res.status(400).json({errors:[{msg:'User already exists'}]})
            }
            //Get users avatar
            const avatar= gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            })
            user = new User({
                name,
                email,
                password,
                avatar
            })
            //Encrypt pass
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password,salt);
            // Save user to db
            await user.save();
            //Return jsonwebtoken
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
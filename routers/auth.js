const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
// const passport = require('passport')
const key = require('./../setup/myurl')

const Person = require('./../models/Person')

router.get('/',(req,res)=>res.json({test:"success"}))




// @type   POST
// @route   /api/auth/register
// @desc   This route for user register
// @access   PUBLIC

router.post('/register',(req,res)=>{
    Person.findOne({email:req.body.email})
    .then(person=>{
        if(person){
            return res.status(400).json({
                emailError:"Email is already registered in system"
            })
        }else{
            const newPerson = new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            })

            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(newPerson.password, salt, (err, hash)=> {
                    if(err) throw err;
                    newPerson.password = hash;
                    newPerson.save()
                    .then(person=>res.json(person))
                    .catch(err=>console.log(err))
                });
            });
        }
    })
    .catch(err=>console.log(err))
})



// @type   POST
// @route   /api/auth/register
// @desc   This route for user register
// @access   PUBLIC


router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    Person.findOne({email})
    .then(person=>{
        if(!person){
            return res.status(404).json({emailError:'User not found with this email.'})
        }
        bcrypt.compare(password,person.password)
        .then(isCorrect=>{
            if(isCorrect){
                // res.json({success:"User login success"})
                const payload = {
                    id:person.id,
                    name:person.name,
                    email:person.email
                }
                jsonwt.sign(
                    payload,
                    key.secret,
                    {expiresIn:3600},
                    (err,token)=>{
                        if(err){
                            res.status(400).json({
                                success:false,
                                err
                            })
                        }
                        res.status(200).json({
                            success:true,
                            token:"Bearer "+ token
                        })
                    }
                )
            }
            else{
                res.status(400).json({error:'Password incorrect'})
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router;

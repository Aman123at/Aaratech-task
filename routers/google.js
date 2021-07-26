const express = require('express')
const router = express.Router()
const passport = require('passport');
// const app = express()


// app.set('view engine', 'ejs');


router.get('/', (req, res, next) => {
    const { user } = req;
    console.log(user)
    res.render('success', { user });
});

//initial entry route for google login
router.get('/auth', (req, res, next) => {
    
    res.render('auth');
});

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/google/auth');
});

router.get('/return', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res, next) => {
      console.log(req)
      const {user} = req
    // res.redirect('/google');
    res.render('success', { user });
});




// router.get('/info',passport.authenticate('google',{failureRedirect:'/'}),
router.get('/info',

(req,res,next)=>{
    res.json({
        success:true,
        user:req.user
    })
})

module.exports = router;

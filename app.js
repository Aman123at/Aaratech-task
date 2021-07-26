const express  = require('express')
const app = express();
const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const passport = require('passport')
const auth = require('./routers/auth')
const google = require('./routers/google')
require('dotenv').config();
const {SESSION_SECRET} = process.env;
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(passport.initialize())
app.set('view engine', 'ejs');
app.use(require('express-session')({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
app.use(passport.session());

app.use('/google', google);

require('./strategies/jsonwtStrategy')(passport)

const db = require('./setup/myurl').mongoURL

mongoose.connect(db,{ useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false})
.then(()=>console.log("MongoDB connected successfully."))
.catch((err)=>console.log(err))



app.get('/',(req,res)=>{
    res.send("Running success")
})

app.use('/api/auth',auth)


app.listen(port,()=>console.log(`Server running at ${port}`))
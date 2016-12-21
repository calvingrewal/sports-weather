const express = require('express')
const User = require('../models/user')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')

const router = express.Router()


router.get('/login', (req,res) => {
  res.render('login.pug', {
    signedIn: req.user ? true : false
  })
})

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post('/login',  (req, res, next) => {
  const { email, password } = req.body

  req.checkBody('email').notEmpty()
  req.checkBody('password').notEmpty()

  const errors = req.validationErrors()

  if (errors) {
    const error = errors[0]
    return res.render('login.pug', {error})
  }

  passport.authenticate('local', {session:true}, (err, user, info) => {
    console.log('userr', user)
    console.log('logging in', info);
    if (!user){
      const error = info.message

      return res.render('login.pug', {error})
    } else {
      req.logIn(user, (err) => {

        return res.redirect('/dashboard')
      })
    }

  })(req, res, next)
})

module.exports = router

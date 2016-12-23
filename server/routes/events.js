const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/events', (req,res) => {
  if (req.user) {
    res.render('events.pug', {
      events: req.user.events,
      signedIn: req.user ? true : false
    })
  } else {
    res.redirect('/login')
  }
})

router.post('/events', (req,res) => {
  const { date, title, description, city } = req.body
  if (!isDate(date)) {
    const formData = {date, title, description, city}

    return res.render('events.pug', {
      error: 'Invalid date',
      events: req.user.events,
      signedIn: req.user ? true : false,
      formData
    })
  }
  if(req.user.email) {
    const newEvent = {date,title,description,city}

    User.addEvent(req.user.email, newEvent, () => {
      return res.redirect('/events')
    })
  } else{
    return res.send('failed')
  }
})
router.delete('/events', (req,res) => {
  const { id, time } = req.body
  const { email } = req.user

  if (email) {
    req.method = 'GET'

    User.deleteEvent(email, id, time, () => {
        return res.send({redirect:'/dashboard'})
    })

  } else{
    return res.send('failed')
  }
})
function isDate(date) {
  return !isNaN(Date.parse(date))
}
module.exports = router

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var JourneyModel = require ('../models/journey')
var UserModel = require('../models/user')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET sign in page. */
router.get('/sign-in', function(req, res, next) {
  res.render('signin')
});

/* GET sign-up page. */
router.post('/sign-up', async function(req, res, next) {
  var searchUser = await UserModel.findOne({
    email: req.body.emailFromFront
  })
  if(!searchUser && req.body.nameFromFront.length > 0 && req.body.lastNameFromFront > 0 && req.body.emailFromFront > 0 && req.body.passwordFromFront > 0){
    var newUser = new UserModel ({
      firstName : req.body.nameFromFront,
      lastName : req.body.lastNameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })
    
    var userSaved = await newUser.save()
    // console.log(">>userSaved", newUser)
    
    req.session.user = {
      name: userSaved.firstName,
      id: userSaved._id
    }
    // console.log(">>req.session.user", req.session.user)
    
    res.redirect('/')
  }else{
    res.redirect('/sign-in')
  }
});


/* POST sign in page */
router.post('/sign-in', async function(req, res, next) {
  var users = await UserModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  });
  
  if(users != null){
    req.session.user = {
      name: users.firstName,
      id: users._id,
      tickets : []
    }
    res.redirect('/')
  } else {
    res.render('signin')
  }

})

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user === undefined) {
    res.redirect('/sign-in')
  }
  res.render('home');
});

/* POST home page*/ 
router.post('/', async function(req, res, next) {
  var dateFront = req.body.date;
  req.body.date = new Date (`${req.body.date}T00:00:00.000Z`);
  var disponible = false;
  
  var journeys = await JourneyModel.find(
    {
      departure: req.body.departure,
      arrival: req.body.arrival,
      date: req.body.date
    }
  );

  disponible = true;

  if (disponible){
    console.log('-------0-----------')
    res.render('ticket-available',{journeyAvailable: journeys, dateFront})
  } else {
    console.log('-------1-----------')
    res.redirect ('/erreur')
  }  
})

/* GET ticket-available */
router.get('/ticket-available', function(req, res, next) {
  res.render('ticket-available',{journeyAvailable});
});


/* GET my-tickets */
router.get('/my-tickets', async function(req, res, next) {
  /* On verifie que l'utilisateur est connecté */
  if (req.session.user === undefined) {
    res.redirect('/sign-in')
  }

  /* On met les tickets dans req.session.user.tickets : []  */
  var userTickets = await JourneyModel.findById(req.query.idJourney)
  req.session.user.tickets.push(userTickets);

  /* On push les tickets dans my last trips */
  var user = await UserModel.findById(req.session.user.id)
  for (var index = 0; index < req.session.user.tickets.length; index++ ) {
      var ticket = req.session.user.tickets[index]
      user.lastTrip.push(ticket);
  }
  var tripSaved = await user.save(); // On enregistre les last trip dans la bdd 
   
  res.render('my-tickets', {myTickets: req.session.user.tickets})
})


/* GET my-last-trip */
router.get('/my-last-trips', async function(req, res, next) {
  var user = await UserModel.findById(req.session.user.id)
  // console.log('GET my-last-trip req.session.user', req.session.user);
  // console.log('GET my-last-trip await user', user);
  // console.log('GET /my-last-trips user.lastTrip', user.lastTrip)
  res.render('my-last-trips', {userFront: user.lastTrip})
})


/* GET erreur */
router.get('/erreur', function(req, res, next) {
  res.render('erreur');
});


module.exports = router;

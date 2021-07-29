var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var JourneyModel = require ('../models/journey')
var UserModel = require('../models/user')
 
var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET sign in page. */
router.get('/sign-in', function(req, res, next) {
  res.render('signin', {title: 'Express'})
});

/* POST sign in page */
router.post('/sign-in', function(req, res, next) {
  console.log('POST /sign-in req.body:', req.body.emailFromFront)
  res.render('signin', {title: 'Express'})
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new JourneyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    JourneyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, Journey) {

          console.log(`Nombre de trajets au départ de ${Journey[0].departure} : `, Journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;

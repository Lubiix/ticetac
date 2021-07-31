var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var JourneyModel = require ('../models/journey')
var UserModel = require('../models/user')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET sign in page. */
router.get('/sign-in', function(req, res, next) {
  // console.log('/GET my last trip USER', req.session.user)
  res.render('signin')
});

/* GET sign-up page. */
router.post('/sign-up', async function(req, res, next) {
  // console.log(">>req.body", req.body)
  var searchUser = await UserModel.findOne({
    email: req.body.emailFromFront
  })
  if(!searchUser && req.body.nameFromFront.length > 0 && req.body.lastNameFromFront.length > 0 && req.body.emailFromFront.length > 0 && req.body.passwordFromFront.length > 0){
    var newUser = new UserModel ({
      firstName : req.body.nameFromFront,
      lastName : req.body.lastNameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront
    })
    
    var userSaved = await newUser.save()
    // console.log(">>userSaved", userSaved)
    
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
  // console.log('POST /sign-in req.body:', req.body.emailFromFront)
  var users = await UserModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  });
  
  if(users != null){
    req.session.user = {
      name: users.firstName,
      id: users._id
    }
    res.redirect('/')
  } else {
    res.render('signin')
  }

})

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user == undefined) {
    res.redirect('sign-in')
  }else{
  res.render('home');
  }
});

/* POST home page*/ 
router.post('/', async function(req, res, next) {
  // console.log('POST / req.body', req.body);
  // var search = await JourneyModel.find();
  var dateFront = req.body.date;
  req.body.date = new Date (`${req.body.date}T00:00:00.000Z`);
  var journeyAvailable = [];
  var disponible = false;

  var journeys = await JourneyModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.date
  });
  disponible = true;
  console.log('journeys', journeys)
  
  if (disponible){
    console.log('-------0-----------')
    res.render('ticket-available',{journeyAvailable: journeys, dateFront})
  } else {
    console.log('-------1-----------')
    res.redirect ('/erreur')
  }  
})

router.get('/ticket-available', function(req, res, next) {
  res.render('ticket-available',{journeyAvailable});
});
/*----------MY TICKETS------------------------- */
router.get('/my-tickets', async function(req, res, next) {
  // console.log('>>GET /my-tickets', req.query.idJourney)
  var search = await JourneyModel.findById(req.query.idJourney)
  // console.log('MY TICKET search', search)
  var myTickets = [];
  myTickets.push(search);

  var last = await UserModel.findById(req.session.user.id)
  console.log(last.lastTrip);
  last.lastTrip = myTickets;
  console.log('MY TICKETS', last.lastTrip);
   

  // console.log('GET myTickets', myTickets);
  res.render('my-tickets')
})
/*-------------LAST TRIP----------------------*/
router.get('/my-last-trips', async function(req, res, next) {
  var last = await UserModel.findById(req.session.user.id)
  console.log('>>>last trip',last.lastTrip);
  res.render('my-last-trips', {})
})

router.get('/erreur', function(req, res, next) {
  res.render('erreur');
});


// // Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new JourneyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
// router.get('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     JourneyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, Journey) {

//           console.log(`Nombre de trajets au départ de ${Journey[0].departure} : `, Journey.length);
//       }
//     )

//   }


//   res.render('index', { title: 'Express' });
// });

module.exports = router;

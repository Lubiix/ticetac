var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}
options,
function(err) {
 if (err) {
   console.log(`error, failed to connect to the database because --> ${err}`);
 } else {
   console.info('*** Database Ticketac connection : Success ***');
 }
}

mongoose.connect('mongodb+srv://maxgeo:Lacapsule@cluster0.elhtd.mongodb.net/Ticetac?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);


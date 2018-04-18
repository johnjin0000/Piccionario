const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


//Init App
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

mongoose.connect(config.database,{
  useMongoClient:true
});
mongoose.Promise = Promise;
let db = mongoose.connection;


//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Bring in models
let Words = require('./models/set');

//Body-parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middlware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

connectedUsers = [];
connections = [];
var artist='';
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) {
//Room
    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length);

    socket.on('roomfixer', function(myRoom){
      socket.join(myRoom);
      socket.room = myRoom;
    });

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Send it to all other clients
        //socket.broadcast.emit('mouse', data);
        io.to(socket.room).emit('mouse',data);
      });
    socket.on('send message', function(data){
      io.to(socket.room).emit('new message', {msg: data, user: socket.username});
    });
    socket.on('new user', function(data){
      socket.username = data;
      connectedUsers.push(socket.username);
      updateUsernames();
      });
    socket.on('changeArtist', function(data){
      artist = data;
      updateArtist();
      io.to(socket.room).emit('clearCanvas');
    });

    function updateArtist(){
      io.to(socket.room).emit('getArtist', artist);
    }

    function updateUsernames(){
      io.sockets.emit('get users', connectedUsers);
    }



    //Disconnect
    socket.on('disconnect', function() {
      if(!socket.username) return;
      connectedUsers.splice(connectedUsers.indexOf(socket.username), 1);
      updateUsernames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected', connections.length);

    });
  });
//Home route
app.get('/', function(req, res){
  Words.find({}, function(err, sets){
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {
        sets:sets
      });
    }
  });
});


//Route files
let users = require('./routes/users');
let sets = require('./routes/sets');
app.use('/users', users);
app.use('/sets', sets);


//Start Server
const server =  http.listen(process.env.Port || 4000, function(){
  console.log('Server started on port 4000...');
});

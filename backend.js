const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const hbs = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
// const games = require('./games');
// const mmaking = require('./mmaking');
const db = require('./database');

//--------DEPENDENCIES----------------

class Client
{
  constructor(){
    this.socket;
    this.username;
  }
}

const port = 3000;
var htmlPath = path.join(__dirname, 'static');
var userId = 0;
var clients = [];
app.use(express.static(htmlPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
var sessionMiddleware = session({secret:"nwejcowmc291838972189yudhnci2!21wdksc0sjeiof3983p2jfsmdlasndquiw983978y"});
app.use(sessionMiddleware);
app.engine('hbs', hbs({defaultLayout: 'main', extname:".hbs"}));
app.set('view engine', 'hbs');
app.get(['/', '/index.html'], (req, res)=>{
  res.render('index', {username:req.session.username, style: "index", script:"index"});
});
app.get('/firstvisit.html', (req, res) => {
  res.render('firstvisit', {style: "firstvisit", script: "firstvisit"});
});
app.post('/firstvisit.html', (req, res)=>
{
  req.session.username = req.body.username;
  console.log("Username recieved: " + req.session.username);
  res.redirect("/index.html");
});
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

//-----SOCKET IO MESSAGES--------------
io.on('connection', (socket)=>{
  // console.log('a user connected ' + socket.id);
  // var newClient = new mmaking.Client();
  var newClient = new Client();
  newClient.socket = socket;
  newClient.state = 0;
  // console.log(socket.request.session.username);
  if(socket.request.session.username == undefined)
  {
    socket.emit('redirect', "/firstvisit.html");
    socket.disconnect();
  }
  newClient.username = socket.request.session.username;
  db.addClient(newClient);
  clients.push(newClient);
  // mmaking.clients.push(newClient);
  // socket.on('username', function(username){
  //   console.log("username entry: " + username + " (" + socket + ")");
  //   mmaking.findClientBySocket(socket).username = username;
  // });
  // socket.on('chat message', function(chat){
  //   console.log("chat: " + chat);
  //   io.emit('chat message', chat);
  // });
  // socket.on('disconnect', ()=>{
  //   console.log('user disconnected');
  // });
  // socket.on('looking', (mmMsg)=>{
  //   var msg = JSON.parse(mmMsg);
  //   var client = mmaking.findClientBySocket(socket);
  //   client.gameWanted = msg.gameCode;
  //   client.bet = msg.bet;
  //   if(!mmaking.clientsLooking.includes(client))
  //   {
  //     mmaking.clientsLooking.push(client);
  //   }
  // });
  socket.on('action', (action)=>{
    // mmaking.findGameBySocket(socket).handleInput(mmaking.findClientBySocket(socket), action);
    // db.logAction(mmaking.findClientBySocket(socket).username, action);
    db.logAction(findClientsBySocket(socket).username, JSON.parse(action));
  });
});
//----------------AFTER REDESIGN----------------
function findClientsBySocket(socket)
{
  return clients.find((element)=>
  {
    if(element.socket == socket)
    {
      return element;
    }
  });
}
function findClientsByUsername(username)
{
  return clients.find((element)=>
  {
    if(element.username == username)
    {
      return element;
    }
  });
}
//-----CONINUALLY CHECK PENDING MATCHES AND UPDATE ALL GAMES-----------
// setInterval(()=>{
//   mmaking.links.forEach((link)=>{link.update();});
//   mmaking.matchClients(mmaking.clientsLooking);
// }, 50);

//----------START SERVER------------------
http.listen(port, () => {console.log('Express is listening...');});

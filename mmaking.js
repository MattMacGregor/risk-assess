const games = require('./games');
const extend = require('extend');
class Client
{
  constructor(){
    this.socket;
    this.username;
  }
}
class Link
{
  constructor(game)
  {
    this.clients = new Array();
    this.game = game;
    console.log("in constructor this.game == undefined " + (this.game == undefined));
    this.message = this.game.getMessages();
    // this.game.setFunctions(gameId);
  }
  update(){
    var state = this.game.update();
    var results = this.game.checkWin();
    console.log("results: " + results[0] + " " + results[1]);
    this.clients.forEach((element, index)=>{
      element.socket.emit("gameUpdate", JSON.stringify(extend(findMessageById(this.message, results[index]), this.game.getHeader())));
      if(results[index] != "update"){
        removeLink(this);
      }
    });
  }
}

function findClientBySocket(socket)
{
  return module.exports.clients.find(function(element)
  {
    return element.socket == socket;
  });
}
function findClientsByUsername(username)
{
  return module.exports.clients.find(function(element)
  {
    return element.username == username;
  });
}
function findLinkBySocket(socket)
{
  return module.exports.links.find((element)=>{
    return element.clients.find((element)=>{
      return element.socket == socket;
    }) != undefined;
  });
}
function findGameBySocket(socket)
{
  return findLinkBySocket(socket).game;
}
function findMessageById(messages, id){
  return messages.find((element) => {
    if(element.id == id)
    {
      return element;
    }
  });
}
function match(client1, client2, game){
  var newLink = new Link(game);
  newLink.clients.push(client1);
  newLink.clients.push(client2);
  module.exports.links.push(newLink);
  module.exports.clientsLooking.splice(module.exports.clientsLooking.findIndex((client)=>{return client == client1;}), 1);
  module.exports.clientsLooking.splice(module.exports.clientsLooking.findIndex((client)=>{return client == client1;}), 1);
}
function removeLink(link)
{
  module.exports.links.splice(module.exports.links.findIndex((link2)=>{return link==link2;}), 1);
}
function matchClients(clientsLooking){
  module.exports.clientsLooking.forEach((client1)=>{
    module.exports.clientsLooking.forEach((client2)=>{
      if(client2 != client1 && client2.gameWanted == client1.gameWanted && client2.bet == client1.bet){
        match(client1, client2, games.retrieveGame(client2.gameWanted, client1.bet));
      }
    })
  });
}
module.exports.Client= Client;
module.exports.findClientBySocket = findClientBySocket;
module.exports.findClientsByUsername = findClientsByUsername;
module.exports.findLinkBySocket = findLinkBySocket;
module.exports.findGameBySocket = findGameBySocket;
module.exports.matchClients = matchClients;
module.exports.links = new Array();
module.exports.numbUsers = 0;
module.exports.clients = new Array();
module.exports.clientsLooking = new Array();

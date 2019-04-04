const r = require('rethinkdb');
var conn = undefined;
var clientsLoaded;
class Action {
  constructor(time, type){
    this.time = time;
    this.type = type;
  }
}

function addClient(client)
{
  var d = new Date();
  console.log("IN ADD CLIENT");
  console.log(JSON.stringify({username: "test", actions: []}));
  r.connect(function(err, conn){
    var arr = new Array();
    r.db("riskapp").table("clients").insert({username: client.username || null, actions:[]}).run(conn, function(err, results){
      console.log("Inserted: " + results);
    });
  });
}
function logAction(username, action)
{
  console.log(username);
  var d = new Date();
   r.connect(function(err, conn){

      //WORKING INSERT STATEMENT
      r.db("riskapp").table("clients").filter({username: username || null}).update({actions:r.row("actions").append({type: action, date: d, timestamp: r.epochTime(d.getTime()/1000)})}, {returnChanges: true}).run(conn, function(err, results){
        console.log("Append results: " + JSON.stringify(results));
      });//

  });
}
// function updateClient(query, change);
module.exports.logAction = logAction;
module.exports.addClient = addClient;

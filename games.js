const mmaking = require('./mmaking');
class RPS {
  constructor(_gameCode, _bet)
  {
    this.decisions = new Array();
    this.gameCode = _gameCode;
    this.bet = _bet;
  }
  handleInput(client, action)
  {
    var foundClient = mmaking.findLinkBySocket(client.socket).clients.findIndex((element)=>{return element==client});
    this.decisions[foundClient] = action;
  }
  checkWin()
  {
    var results = new Array();
    if(this.decisions[0] == undefined || this.decisions[1] == undefined)
    {
      results.push("update");
      results.push("update");
    }
    else if(this.decisions[0] == "r")
    {
      if(this.decisions[1] == "r")
      {
        results.push("tie");
        results.push("tie");
      }
      else if(this.decisions[1] == "s")
      {
        results.push("win");
        results.push("lose");
      }
      else if(this.decisions[1] == "p")
      {
        results.push("lose");
        results.push("win");
      }
    }
    else if(this.decisions[0] == "s")
    {
      if(this.decisions[1] == "r")
      {
        results.push("lose");
        results.push("win");
      }
      else if(this.decisions[1] == "s")
      {
        results.push("tie");
        results.push("tie");
      }
      else if(this.decisions[1] == "p")
      {
        results.push("win");
        results.push("lose");
      }
    }
    else if(this.decisions[0] == "p")
    {
      if(this.decisions[1] == "r")
      {
        results.push("win");
        results.push("lose");
      }
      else if(this.decisions[1] == "s")
      {
        results.push("lose");
        results.push("win");
      }
      else if(this.decisions[1] == "p")
      {
        results.push("tie");
        results.push("tie");
      }
    }
    return results;
  }
  getMessages()
  {
    return [
      {
        id:"win",
        description: "You won!"
      },
      {
        id:"lose",
        description: "You lost"
      },
      {
        id:"tie",
        description: "It's a tie"
      },
      {
        id:"update"
      }
    ]
  }
  getHeader()
  {
    return {
      gameCode: this.gameCode,
      gameDescription: "Rock Paper Scissors"
    };
  }
  update(){
    this.checkWin();
  }
}
class PD{
  constructor(_gameCode, _bet){
    this.decisions = new Array();
    this.effect = 0;
    this.gameCode = _gameCode;
    this.bet = _bet;
  }
  checkWin()
  {
    var results = new Array();
    if(this.decisions[0] == undefined || this.decisions[1] == undefined)
    {
      results.push("update");
      results.push("update");
    }
    else if(this.decisions[0] == "1")
    {
      if(this.decisions[1] == "1")
      {
        results.push("tieG");
        results.push("tieG");
      }
      else if(this.decisions[1] == "2")
      {
        results.push("lose");
        results.push("win");
      }
    }
    else if(this.decisions[0] == "2")
    {
      if(this.decisions[1] == "1")
      {
        results.push("win");
        results.push("lose");
      }
      else if(this.decisions[1] == "2")
      {
        results.push("tieB");
        results.push("tieB");
      }
    }
    return results;
  }
  update(){
    this.checkWin();
  }
  getMessages(){
    return [
      {
        id:"win",
        opponentsChoice: "Stay Silent",
        yourChoice: "Betray",
        penalty: this.bet * 1.05,
        description:"They stayed silent, and you betrayed them."
      },
      {
        id:"lose",
        opponentsChoice: "Betray",
        yourChoice: "Stay Silent",
        penalty: -(this.bet * 1.05),
        description: "You stayed silent and they betrayed you"
      },
      {
        id:"tieG",
        penalty: this.bet * .05,
        description: "You both stayed silent"
      },
      {
        id:"tieB",
        penalty: -(this.bet * .05),
        description: "You both tried to betray the other"
      },
      {
        id:"update"
      }
    ]
  }
  getHeader()
  {
    return {
      gameCode: this.gameCode,
      gameDescription: "Prisoners Dilema"
    };
  }
  handleInput(client, action){
    var foundClient = mmaking.findLinkBySocket(client.socket).clients.findIndex((element)=>{return element==client});
    console.log("Received Action: " + action);
    this.decisions[foundClient] = action;
  }
}
function retrieveGame(gameCode, bet)
{
  console.log("Game retrieved gameCode:" + gameCode);
  if(gameCode == "rps"){
    return new RPS(gameCode, bet);
  }
  if(gameCode == "pd"){
    return new PD(gameCode, bet);
  }
}
module.exports.retrieveGame = retrieveGame;
module.exports.PD = PD;
module.exports.RPS = RPS;

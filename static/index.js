$(() => {
  // socket.on('chat message', function(msg){
  //   $('#messages').append($('<li>').text(msg));
  // });
  socket.on('redirect', (destination)=>{
    window.location.href = destination;
  });
  // socket.on('gameUpdate', function(msg){
  //   console.log("resultsRecieved: " + msg);
  //   var msgParsed = JSON.parse(msg);
  //   if(msgParsed.id != "update")
  //   {
  //     console.log("gameOver: " + "#" + msgParsed.gameCode + "Results");
  //     $("#" + msgParsed.gameCode + "Results").append(msgParsed.description);
  //     Math.round(changeMoney(msgParsed.penalty));
  //   }
  // });
  $(document).bind("keyup", (event)=>
  {
    if(event.key === 'd')
    {
      event.preventDefault();
      input({
        pressed: "incorrect",
        answer: currentAnswer,
        score: score
      });
      if(currentAnswer !== "correct")
      {
        $("#poly").css("fill", "green");
        changeScore(1.2);
      }
      else {
        $("#poly").css("fill", "red");
        changeScore(.6);
        paused = true;
        $("#game").html('<b>You got one wrong. New Score: ' + score + '</b><br><button onClick="unpause()">Continue</button><button onClick="quit()">Quit</button>')
      }
    }
    else if(event.key === 'j')
    {
      input({
        pressed: "incorrect",
        answer: currentAnswer,
        score: score
      });
      console.log(currentAnswer);
      if(currentAnswer !== "incorrect")
      {
        $("#poly").css("fill", "green");
        changeScore(1.2);
      }
      else {
        $("#poly").css("fill", "red");
        changeScore(.6);
        paused = true;
        $("#game").html('<b>You got one wrong. New Score: ' + score + '</b><br><button onClick="unpause()">Continue</button><button onClick="quit()">Quit</button>')
      }
    }
    else if(event.key === ' ')
    {
      input({
        pressed: "pause",
        answer: currentAnswer,
        score: score
      });
      paused = true;
      $("#game").html('<b>Paused</b><br><button onClick="unpause()">Continue</button><button onClick="quit()">Quit</button>')
    }
  });
});
// $("#chatInput").ready(()=>
// {
//   $("#chatInput").bind("keyup", function(event) {
//     if (event.keyCode === 13) {
//       event.preventDefault();
//       sendChat($("chatInput").val());
//     }
//   });
// function sendChat()
// {
//   var text = $("#chatInput").val();
//   $("#chatInput").val("");
//   socket.emit('chat message', text);
// }
var socket = io();
var score = 1000;
var time = 1000;
var paused = false;
function updateTime(){
  document.getElementById("timernumber").innerHTML = time;
}
var currentAnswer;
function ngone(r,n) {
    // r -> radius ( max size )
    // n -> vertices count
    var d=Math.floor(n/2);
    var p=[];
    var a=2*Math.PI/n;
    var ai;
    var s='<svg width="' + (2*r) + '" height="' + (2*r) + '"><polygon id="poly" points="';
    var nstar="";
    for (var i=0; i<n; i++) {
        ai=a*i;
        p[i] = {};
        p[i].x = r*Math.cos(ai) + r;
        p[i].y = r*Math.sin(ai) + r;
        s+=" "+p[i].x+","+p[i].y+" ";
    }
    var dispNumb = ((Math.floor(Math.random() * 2) == 1) ? n : (Math.floor(Math.random() * 4) + 5));
    currentAnswer = (n == dispNumb) ? "correct":"incorrect";
    return s+'"></polygon><text x="' + r + '" y="' + r + '" text-anchor="middle" alignment-baseline="middle" font-family="Arial" font-weight="900" font-size="400" fill="white">' + dispNumb + '</text></svg>';// + '<br><h1>' + ((Math.floor(Math.random() * 2) == 1) ? n : (Math.floor(Math.random() * 4) + 5)) + '</h1>';
}
function changeShape(){
  $("#game").html(ngone(500, Math.floor(Math.random() * 4) + 5));
}
setInterval(function() { time--; updateTime();}, 1500);
function changeScore(scale){
  score = parseFloat(scale) * score;
  document.getElementById("score").innerHTML = score;
}
function gameStart()
{
  $("#gameControls").css("visibility", "visible");
  changeShape();
  setInterval(function(){if(!paused){changeShape();}}, 1000);
}
function unpause()
{
  pause = false;
  input({
    pressed:"unpause",
    score: score
  })
}
function quit()
{
  $("#game").html("Thank you for participating<br>Your final score was " + score);
  input({
    pressed:"quit",
    score: score
  })
}
// function earnMoneyClick() {
//   money += 1;
//   document.getElementById("moneynumber").innerHTML = money;
// }
// function coinToss() {
//   if(parseInt(Math.random() * 2 + 0.5) % 2 == 0) {
//     changeMoney(document.getElementById("coinTossBet").value);
//   } else {
//     changeMoney(-document.getElemcontainerentById("coinTossBet").value);
//   }
// }
// function matchMake(id)
// {
//   console.log(id);
//   if(id == "rockPaperScissors")
//   {
//     socket.emit("looking", JSON.stringify({gameCode:"rps",bet:document.getElementById("rpsBet").value
//   }));
//     console.log("emit looking message");
//   }
//   else if(id == "prisonersDilema")
//   {
//     socket.emit("looking", JSON.stringify({gameCode:"pd",bet:document.getElementById("pdBet").value
//     }));
//   }
// }
function input(object)
{
  socket.emit("action", JSON.stringify(object));
}

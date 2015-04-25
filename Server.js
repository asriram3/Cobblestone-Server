var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var url = require('url');

//Game Variables
var players = Array();
var player_ids = Array();
var do_once = true;
var gameOn = false;
var players_ready = 0;
var gameStatus = "Lobby";
function setLinks(){
  app.get('/', function(req, res){
    var _url = url.parse(req.url, true);
    var _id = _url.query["id"];
    if(player_ids.indexOf(_id)==-1){
      console.log("Player "+_id+" joined the game");
      player_ids.push(_id);
      var player = new Object();
      player.alive = true;
      player.ready = false;
      player.lastActive = new Date().getTime();
      console.log(player.lastActive);
      players.push(player);
      res.end("Joined. Players:"+player_ids);
    }else{
      res.end("RePinged");
    }
  });

  app.get('/ready', function(req, res){
    var _url = url.parse(req.url, true);
    var _id = _url.query["id"];
    if(!gameOn && players.length>1){
      //make ready
      var dex = player_ids.indexOf(_id);
      var player = players[dex];
      if(!player.ready){
        player.ready = true;
        players_ready++;
        if(players_ready == players.length){
          gameOn = true;
          console.log("game started. Players:"+player_ids);
          gameStatus = "Playing";
        }
      }
    }
    res.end("ready");
  });

  app.get('/leave', function(req, res){
    var _url = url.parse(req.url, true);
    var _id = _url.query["id"];
    console.log("Player "+_id+" left the game");

   
      //make ready
      var dex = player_ids.indexOf(_id);
      if(dex>-1){
        var player = players[dex];
          gameStatus = "Lobby";
          players.splice(dex,1);
          player_ids.splice(dex,1);
          for(var i=0; i<players.length; i++){
            players[i].alive = true;
            players[i].ready = false;
            players_ready = 0;
            gameOn = false;
          }
        
      }
    
    res.end("leave triggered");
  });

  app.get('/gameInfo', function(req, res){
      var _url = url.parse(req.url, true);
      var _id = _url.query["id"];
      var dex = player_ids.indexOf(_id);
      if(dex>-1){
        players[dex].lastActive = new Date().getTime();
      }
      var info = new Object();
      info.players = players.length;
      info.ready = players_ready;
      info.gameStatus = gameStatus;
      res.end(JSON.stringify(info));

  });


  app.get('/debug', function(req, res){
      var _url = url.parse(req.url, true);
      var _id = _url.query["id"];
      res.write("players:"+players.length+"\n");
      res.write("ready:"+players_ready+"\n");
      res.write("gameStatus:"+gameStatus+"\n");
      res.write("PLAYERS{\n");
      for(var p=0; p<players.length; p++){
        res.write(player_ids[p]+":"+(new Date().getTime()-players[p].lastActive)+"\n");

      }
    res.end("}");
  });

}
setLinks();



  function server_check(){
    //console.log("Checking..");
    for(var i=0; i<players.length; i++){
      if((new Date().getTime()-players[i].lastActive) > 10000){
        var _id = player_ids[i];
        console.log("Player "+_id+" left the game");
        //make ready
        var dex = player_ids.indexOf(_id);
        if(dex>-1){
          var player = players[dex];
            gameStatus = "Lobby";
            players.splice(dex,1);
            player_ids.splice(dex,1);
            for(var i=0; i<players.length; i++){
              players[i].alive = true;
              players[i].ready = false;
              players_ready = 0;
              gameOn = false;
            }
        }
      }
    }
  }

  if(do_once){
    do_once = false;
    console.log("Server Initialized");
    setInterval(function(){
      server_check();
    }, 75);
  }



http.listen(process.env.PORT || 5000);

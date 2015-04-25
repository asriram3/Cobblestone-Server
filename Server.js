var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

//Game Variables
var players = Array();

function setLinks(){
  app.get('/', function(req, res){
   console.log("HE PINGED!");
   var obj = new Object();
   obj.name = "Raj";
   obj.age  = 32;
   obj.married = false;
   var jsonString= JSON.stringify(obj);
   res.send(obj);
  });

  app.get('/js/JareUtils.js', function(req, res){
    res.sendFile(__dirname + '/js/JareUtils.js');
  });

  app.get('/js/FPSMeter.js', function(req, res){
    res.sendFile(__dirname + '/js/FPSMeter.js');
  });

  app.get('/js/GameLoopManager.js', function(req, res){
    res.sendFile(__dirname + '/js/GameLoopManager.js');
  });

  app.get('/js/Game.js', function(req, res){
    res.sendFile(__dirname + '/js/Game.js');
  });
}
setLinks();




var logs = 0;
var do_once = true;
io.on('connection', function(socket){ 
    glob_socket = socket; 
  	socket.on('player_joined', function(player_id){
  		res.send("hi");
      //console.log("Player "+player_id+" joined.");
	});

  socket.on('moveRight', function(player_id){
 		//moveRight
  });
  socket.on('moveLeft', function(player_id){
     // giveFeed(player_id,socket);
  });
  socket.on('moveDown', function(player_id){
      //giveFeed(player_id,socket);
  });
  socket.on('moveUp', function(player_id){
     // giveFeed(player_id,socket);
  });

  socket.on('releaseRight', function(player_id){
     // giveFeed(player_id,socket);
  });
  socket.on('releaseUp', function(player_id){
      //giveFeed(player_id,socket);
  });

  socket.on('player_left', function(id){
      //player_left

  });


  function server_check(){
  	console.log("Checking..");
  }

  if(do_once){
    do_once = false;
    console.log("Server Initialized");
    setInterval(function(){
     	server_check();
    }, 75);
  }

});

http.listen(process.env.PORT || 5000);

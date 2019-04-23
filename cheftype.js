/***
Joshua Silverio Lexi Garrabrant
CSc 337
Final Project
Description: js code for webpage called Typer's Kitchen that lets the user
learn how to type in a fun way.
***/

(function() {
  "use strict";
  let unusedWords = [];
  let validWords = [];
  let currImg = [];
  let validPicture = ["images/tomato.png","images/lettuce.png",
  "images/cheese.png", "images/onion.png", "images/patty.png"];
  let timer;
  let timer2;
  let yPos = {};
  let xPos = {};
  let user = "";
  let currScore = 0;
  let level = 0;
  let lives = 3;
  /*** on load for browser opening***/
  window.onload = function() {
    loadScores();
    fillWords();
    document.getElementById("userword").onkeypress = enterHit;
    document.getElementById("password").onkeypress = enterHit;
    document.getElementById("loginbutton").onclick = login;
    document.getElementById("signbutton").onclick = login;
    document.getElementById("startbutton").onclick = start;
    document.getElementById("sound").onclick = sound;
  };
  /*** sound function for changing soundtracks ***/
  function sound(){
    let song = document.getElementById("currentsong").innerHTML
    .split("<br><br>")[1];
    console.log(song);
    switch(song){//switch the song
      case "Sunflower":
        document.getElementById("songchoice").src = "audio/kirby.mp3";
        document.getElementById("currentsong").innerHTML =
        "Currently Playing: <br><br>Kirby DreamLand";
        break;
      case "Kirby DreamLand":
        document.getElementById("songchoice").src = "audio/silence.mp3";
        document.getElementById("currentsong").innerHTML =
        "Currently Playing: <br><br>Nothing";
        break;
      case "Nothing":
        document.getElementById("songchoice").src = "audio/flower.mp3";
        document.getElementById("currentsong").innerHTML =
        "Currently Playing: <br><br>Sunflower";
      break;
    }
  }
  /*** login function to handle signing in or registering
  @param{event} event
  handler for login***/
  function login(event){
    switch(event.srcElement.id){
      case "loginbutton"://logging back in
      if(document.getElementById("login") !=null){
        document.getElementById("login").id = "loginclick";
        document.getElementById("loginbar").style.opacity = "0";
        document.getElementById("username").focus();
        currScore = -1;
      }
      break;
      case "signbutton"://registerign a new account
      if(document.getElementById("login")!= null){
        document.getElementById("login").id = "loginclick";
        document.getElementById("loginbar").style.opacity = "0";
        currScore = 1;
      }
      break;
    }
  }
  /*** enterHit function for when user hits the enter key
  @param{event} event
  handler for enterHit***/
  function enterHit(event){
    let flg = 0;
    let song = document.getElementById("currentsong").innerHTML
    .split("<br><br>")[1];
    if(event.code == "Enter"){//make sure it was an enter hit
      if(event.srcElement.id =="userword"){//user is tryign to type a word
        let userWord = document.getElementById("userword");
        for(let i = 0; i <validWords.length; i++){
          if(userWord.value == validWords[i]){
            if(song != "Nothing"){
              let audio = new Audio("audio/correct.mp3");//correct
              audio.play();
            }
            flg = 1;
            userWord.value = "";
            userWord.style.backgroundColor = "#55d11f";
            setTimeout(function(){userWord.style.backgroundColor=
              "rgb(78, 75, 78)";}, 75);
              currScore+=10;
              validWords.splice(i,1);
              currImg.splice(i,1);
              reloadScore();
              break;
            }
          }
          if (flg == 0) {
            let userWord = document.getElementById("userword");
            userWord.value = "";//wrong
            if(song!="Nothing"){
              let audio = new Audio("audio/Plate.mp3");
              audio.play();
            }
            userWord.style.backgroundColor = "red";
            setTimeout(function(){userWord.style.backgroundColor =
              "rgb(78, 75, 78)";}, 75);
              currScore--;
              reloadScore();
            }
          }       else if(event.srcElement.id == "password"){//user is loggingin
            let userUrl = "https://typers-kitchen.herokuapp.com/?mode=users";
            let username = document.getElementById("username").value;
            if(username.length !=3){
              alert("Please Enter 3 Inittials");//wrong input
            }
            else{
              let password = document.getElementById("password").value;
              let f = 0;
              fetch(userUrl)
              .then(checkStatus)
              .then(function(responseText) {
                let json = JSON.parse(responseText);
                if(currScore == -1){
                  for(let i=0; i<json["users"].length; i++){
                    if(json["users"][i].name.toUpperCase() == username.toUpperCase()
                    && json["users"][i].password == password){//post new user
                      f = 1;
                      user = username.toUpperCase();
                      showPlay();
                    }
                  }
                  if(f==0){
                    alert("Username/Password Invalid");
                  }
                } else {
                  sendUser(json);
                }
              })
              .catch(function(error) {
                console.log(error);
              });
            }
          }
        }
      }
      /*** reloadScore for reloading user score every enter hit***/
      function reloadScore(){
        if(currScore > 100 && level == 0) {
          clearInterval(timer);
          clearInterval(timer2);
          timer2 = setInterval(addWord,1500);
          timer = setInterval(moveWord,50);
          level = 1;
        }
        if(currScore > 200 && level == 1) {//increase speed
          clearInterval(timer);
          clearInterval(timer2);
          timer2 = setInterval(addWord,1000);
          timer = setInterval(moveWord,20);
          level = 2;
        }
        document.getElementById("currentscore").innerHTML = currScore;
      }
      /*** reloadLives for reloading knife when user loses life***/
      function reloadLives(){
        document.getElementById("lives").innerHTML = "";
        let j;
        for(j=0; j<lives; j++) {
          document.getElementById("lives").innerHTML +=
          '<img src="images/lifeknife.png" />';
        }
        for(j=0; j<(3-lives); j++) {
          document.getElementById("lives").innerHTML +=
          '<img src="images/deathknife.png" />';
        }
      }
      /*** start for when user wants to start playing***/
      function start(){
        currScore = 0;
        lives = 3;
        level = 0;//reset lives/score/lvl
        reloadScore();
        reloadLives();
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        context.font = "30px Arial";
        document.getElementById("userword").disabled = false;
        document.getElementById("userword").focus();
        document.getElementById("startbutton").disabled = true;
        timer2 = setInterval(addWord,2000);
        timer = setInterval(moveWord,100);//start the game
      }
      /*** addWord for adding a new word to the screen***/
      function addWord(){
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        let num = Math.floor(Math.random() * unusedWords.length);
        while(validWords.includes(unusedWords[num])) {
          num = Math.floor(Math.random() * unusedWords.length);//random num
        }
        validWords.push( unusedWords[num] );
        unusedWords.splice(num, 1);//add to the list
        if(unusedWords.length == 0) { fillWords(); }

        yPos[validWords[validWords.length-1]] = 0;
        let temp = 50 + Math.floor(Math.random() * 600);
        xPos[validWords[validWords.length-1]] = temp;//set initial positions
        let img = new Image();
        let x = Math.floor(Math.random() * validPicture.length);
        img.src =  validPicture[x];
        context.drawImage(img, temp-50, 0);
        context.textAlign = "center";
        context.fillText(validWords[validWords.length],
          xPos[validWords[validWords.length]],
          yPos[validWords[validWords.length]]);
          currImg[validWords.length-1] = img;//add it to the canvas
        }
        /*** moveWord for moving word down the canvas***/
        function moveWord(){
          let canvas = document.getElementById("canvas");
          let context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          for(let i=validWords.length-1; i>=0; i--){
            yPos[validWords[i]] += 1;//old position +1
            let img = currImg[i];
            context.drawImage(img,xPos[validWords[i]]-50, yPos[validWords[i]]-25);
            context.fillStyle = "#000000";
            context.fillText(validWords[i],xPos[validWords[i]],yPos[validWords[i]]);

            if(yPos[validWords[i]] == 425) {
              validWords.splice(i,1);//word made it to the bottom of the screen
              currImg.splice(i,1);
              lives--;
              reloadLives();
              if(lives==0) { stop(); }
            }
          }
        }
        /*** fillWords forgetting the words from the webservice***/
        function fillWords() {
          unusedWords = [];
          let dictUrl = "https://typers-kitchen.herokuapp.com/?mode=dictionary";
          fetch(dictUrl)//book url request
          .then(checkStatus)
          .then(function(responseText) {
            let json = JSON.parse(responseText);
            for(let i = 0; i < json.dictionary.length; i++){
              unusedWords.push(json.dictionary[i].word);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }
        /*** laodScores for getting old scores from service***/
        function loadScores() {
          let scoreUrl = "https://typers-kitchen.herokuapp.com/?mode=scores";
          fetch(scoreUrl)
          .then(checkStatus)
          .then(function(responseText) {
            console.log(responseText);
            let json = JSON.parse(responseText);
            console.log(json);
            let scoreDiv = document.getElementById("highscores");
            let title = document.createElement("h2");
            scoreDiv.innerHTML = "";
            title.innerHTML = "HIGHSCORES";
            scoreDiv.appendChild(title);
            let scoreP = document.createElement("p");
            scoreDiv.appendChild(scoreP);
            let highs = [parseInt(json.scores[0].score)];
            let names = [json.scores[0].name];
            let flg = 0;
            for(let i = 1; i < json.scores.length; i++){
              flg = 0;
              for(let j = 0; j < highs.length; j++) {//find top 5 scores
                if(parseInt(json.scores[i].score) > highs[j]) {
                  highs.splice(j, 0, parseInt(json.scores[i].score));
                  names.splice(j, 0, json.scores[i].name);
                  flg = 1;
                  break;
                }
              }
              if(flg == 0){
                highs.push(parseInt(json.scores[i].score));
                names.push(json.scores[i].name);
              }
            }
            for(let i = 0; i < Math.min(5, highs.length); i++) {
              scoreP = document.createElement("p");
              scoreP.innerHTML = names[i] +"..........." +  highs[i];
              scoreDiv.appendChild(scoreP);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }
        /*** stpo for when player loses the game***/
        function stop() {
          document.getElementById("userword").disabled = true;
          sendScore();
          let canvas = document.getElementById("canvas");
          let context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.font = "50pt 'Press Start 2P'";
          context.fillStyle = "#FF0000";
          context.fillText("GAME OVER", 350, 200);
          document.getElementById("startbutton").disabled = false;
          currImg = [];
          validWords = [];
          clearInterval(timer);//stop timers
          clearInterval(timer2);
        }
        /*** sendUser for posting new players to the webservice
        @param{json} json
        handler for sending user on to webservice***/
        function sendUser(json){
          let name = document.getElementById("username").value;
          let password = document.getElementById("password").value;
          let flag = 0;
          const message = {name: name, password: password};
          const fetchOptions = {
            method : 'POST',
            headers : {
              'Accept': 'application/json',
              'Content-Type' : 'application/json'//build json of their comment
            },
            body : JSON.stringify(message)
          };
          let url = "https://typers-kitchen.herokuapp.com/?mode=post";
          fetch(url, fetchOptions)
          .then(checkStatus)
          .then(function(responseText) {
            console.log(responseText);
            for(let i = 0; i <json["users"].length; i++){
              if(json["users"][i].name.toUpperCase() == name.toUpperCase()){
                flag = 1;
              }
            }
            if(flag == 0){
              user = name.toUpperCase();
              showPlay();
            } else{
              alert("Initials already taken, please try again");//already found
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }
        /*** sendScore for posting new score that player just got
        @param{json} json
        handler for sending score on to webservice***/
        function sendScore(json){
          console.log(json);
          const message = {name: user, score: currScore};
          const fetchOptions = {
            method : 'POST',
            headers : {
              'Accept': 'application/json',
              'Content-Type' : 'application/json'//build json of their comment
            },
            body : JSON.stringify(message)
          };
          let url = "https://typers-kitchen.herokuapp.com/?mode=post";
          fetch(url, fetchOptions)
          .then(checkStatus)
          .then(function(responseText) {
            loadScores();
            console.log(responseText);
          })
          .catch(function(error) {
            console.log(error);
          });
        }
        /*** showPlay for revealing all divs to play the game***/
        function showPlay(){
          let x = document.querySelectorAll(".hidden");
          for(let i =0; i<x.length; i++){
            x[i].style.visibility = "visible";
            x[i].style.width = "auto";
          }
          let elem = document.getElementById("loginclick");
          elem.parentNode.removeChild(elem);
          elem = document.getElementById("logincontainer");
          elem.parentNode.removeChild(elem);
          document.getElementById("logotop").style.width = 0+"px";
          document.getElementById("logobottom").style.width = 0+"px";
          elem = document.getElementById("title");
          elem.parentNode.removeChild(elem);
        }
        /***returns the response text if the status is in the 200s
        otherwise rejects the promise with a message including the status
        *@param{response} response from service
        *@returns {number} The response ***/
        function checkStatus(response) {
          if (response.status >= 200 && response.status < 300) {
            return response.text();
          } else {
            return Promise.reject(response.status);
          }
        }

      })();

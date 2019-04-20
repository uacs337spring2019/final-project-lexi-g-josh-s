/***
Lexi Garrabrant
Joshua Silverio
CSC 337 - Final Project
***/
"use strict";
(function() {
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
  function sound(){
    let song = document.getElementById("currentsong").innerHTML
    .split("<br><br>")[1];
    console.log(song);
    switch(song){
      case "Sunflower":
      document.getElementById("songchoice").src = "audio/kirby.mp3";
      document.getElementById("currentsong").innerHTML =
      "Currently Playing: <br><br>Kirby DreamLand";
      break;
      case "Kirby DreamLand":
      document.getElementById("songchoice").src = "audio/silence.mp3";
      document.getElementById("currentsong").innerHTML =
      "Currently Playing: <br><br>Nothing";
      break
      case "Nothing":
      document.getElementById("songchoice").src = "audio/flower.mp3";
      document.getElementById("currentsong").innerHTML =
      "Currently Playing: <br><br>Sunflower";
      break;
    }
  }
  function login(event){
    switch(event.srcElement.id){
      case "loginbutton":
      if(document.getElementById("login") !=null){
        document.getElementById("login").id = "loginclick";
        document.getElementById("loginbar").style.opacity = "0";
        document.getElementById("username").focus();
        currScore = -1;
      }
      break;
      case "signbutton":
      if(document.getElementById("login")!= null){
        document.getElementById("login").id = "loginclick";
        document.getElementById("loginbar").style.opacity = "0";
        currScore = 1;
      }
      break;
    }
  }
  function enterHit(event){
    let flg = 0;
    let song = document.getElementById("currentsong").innerHTML
    .split("<br><br>")[1];
    if(event.code == "Enter"){
      if(event.srcElement.id =="userword"){
        let userWord = document.getElementById("userword");
        for(let i = 0; i <validWords.length; i++){
          if(userWord.value == validWords[i]){
            if(song != "Nothing"){
              let audio = new Audio("audio/correct.mp3");
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
            userword.value = "";
            if(song!="Nothing"){
              let audio = new Audio("audio/Plate.mp3");
              audio.play();
            }
            userword.style.backgroundColor = "red";
            setTimeout(function(){userword.style.backgroundColor =
              "rgb(78, 75, 78)";}, 75);
              currScore--;
              reloadScore();
            }
          }       else if(event.srcElement.id == "password"){
            let userUrl = "http://localhost:3000/?mode=users";
            let username = document.getElementById("username").value;
            if(username.length !=3){
              alert("Please Enter 3 Inittials")
            }
            else{
              let password = document.getElementById("password").value;
              let f = 0;
              fetch(userUrl)
              .then(checkStatus)
              .then(function(responseText) {
                let json = JSON.parse(responseText);
                if(currScore == -1){
                  for(let i = 0; i <json["users"].length;i++){
                    if(json["users"][i].name.toUpperCase() == username.toUpperCase()
                    && json["users"][i].password == password){
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

      function reloadScore(){
        if(currScore > 100 && level == 0) {
          clearInterval(timer);
          clearInterval(timer2);
          timer2 = setInterval(addWord,1500);
          timer = setInterval(moveWord,50);
          level = 1;
        }
        if(currScore > 200 && level == 1) {
          clearInterval(timer);
          clearInterval(timer2);
          timer2 = setInterval(addWord,1000);
          timer = setInterval(moveWord,20);
          level = 2;
        }
        document.getElementById("currentscore").innerHTML = currScore;
      }

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

      function start(){
        currScore = 0;
        lives = 3;
        level = 0;
        reloadScore();
        reloadLives();
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        context.font = "30px Arial";
        document.getElementById("userword").disabled = false;
        document.getElementById("userword").focus();
        document.getElementById("startbutton").disabled = true;
        timer2 = setInterval(addWord,2000);
        timer = setInterval(moveWord,100);
      }

      function addWord(){
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        var num = Math.floor(Math.random() * unusedWords.length);
        while(validWords.includes(unusedWords[num])) {
          num = Math.floor(Math.random() * unusedWords.length);
        }
        validWords.push( unusedWords[num] );
        unusedWords.splice(num, 1);
        if(unusedWords.length == 0) { fillWords(); }

        yPos[validWords[validWords.length-1]] = 0;
        let temp = 50 + Math.floor(Math.random() * 600)
        xPos[validWords[validWords.length-1]] = temp;
        let img = new Image();
        let x = Math.floor(Math.random() * validPicture.length);
        img.src =  validPicture[x];
        context.drawImage(img, temp-50, 0);
        context.textAlign = "center";
        context.fillText(validWords[validWords.length],
          xPos[validWords[validWords.length]],
          yPos[validWords[validWords.length]]);
          currImg[validWords.length-1] = img;
        }

        function moveWord(){
          var canvas = document.getElementById("canvas");
          var context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          for(let i=validWords.length-1; i>=0;i--){
            yPos[validWords[i]] += 1;
            let img = currImg[i];
            context.drawImage(img,xPos[validWords[i]]-50, yPos[validWords[i]]-25);
            context.fillStyle = "#000000";
            context.fillText(validWords[i],xPos[validWords[i]],yPos[validWords[i]]);

            if(yPos[validWords[i]] == 425) {
              validWords.splice(i,1);
              currImg.splice(i,1);
              lives--;
              reloadLives();
              if(lives==0) { stop(); }
            }
          }
        }

        function fillWords() {
          unusedWords = [];
          let dictUrl = "http://localhost:3000/?mode=dictionary";
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

        function loadScores() {
          let scoreUrl = "http://localhost:3000/?mode=scores";
          fetch(scoreUrl)
          .then(checkStatus)
          .then(function(responseText) {
            let json = JSON.parse(responseText);
            let scoreDiv = document.getElementById("highscores");
            let title = document.createElement("h2");
            scoreDiv.innerHTML = "";
            title.innerHTML = "HIGHSCORES";
            scoreDiv.appendChild(title);

            let scoreP = document.createElement("p");
            scoreP.innerHTML = "Name...........Score";
            scoreDiv.appendChild(scoreP);

            let highs = [parseInt(json.scores[0].score)];
            let names = [json.scores[0].name];

            let flg = 0;
            for(let i = 1; i < json.scores.length; i++){
              flg = 0;
              for(let j = 0; j < highs.length; j++) {
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
              let nameSpan = document.createElement("span");
              scoreP = document.createElement("p");
              scoreP.innerHTML = names[i] +"..........." +  highs[i];
              scoreDiv.appendChild(scoreP);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }

        function stop() {
          document.getElementById("userword").disabled = true;
          sendScore();
          let canvas = document.getElementById("canvas");
          let context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.font = "50pt 'Press Start 2P'"
          context.fillStyle = "#FF0000";
          context.fillText("GAME OVER", 350, 200);
          document.getElementById("startbutton").disabled = false;
          currImg = [];
          validWords = [];
          clearInterval(timer);
          clearInterval(timer2);
        }

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
          let url = "http://localhost:3000";
          fetch(url, fetchOptions)
          .then(checkStatus)
          .then(function(responseText) {
            for(let i = 0; i <json["users"].length;i++){
              if(json["users"][i].name.toUpperCase() == name.toUpperCase()){
                flag = 1;
              }
            }
            if(flag == 0){
              user = name.toUpperCase();
              showPlay();
            } else{
              alert("Initials already taken, please try again")
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        }

        function sendScore(json){
          let flag = 0;
          const message = {name: user, score: currScore};
          const fetchOptions = {
            method : 'POST',
            headers : {
              'Accept': 'application/json',
              'Content-Type' : 'application/json'//build json of their comment
            },
            body : JSON.stringify(message)
          };
          let url = "http://localhost:3000";
          fetch(url, fetchOptions)
          .then(checkStatus)
          .then(function(responseText) {
            loadScores();
          })
          .catch(function(error) {
            console.log(error);
          });
        }

        function showPlay(){
          let x = document.querySelectorAll(".hidden");
          for(let i =0; i<x.length;i++){
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
        otherwise rejects the promise with a message including the status***/
        function checkStatus(response) {
          if (response.status >= 200 && response.status < 300) {
            return response.text();
          } else {
            return Promise.reject(response.status);
          }
        }

      })();

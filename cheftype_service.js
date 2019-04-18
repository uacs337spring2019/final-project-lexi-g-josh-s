// Joshua SIlverio
// CSC 337, Spring 2019
// HW7

// this web service requires a mode/title parameter
// it provides various info about different books
"use strict";
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static('public'));
console.log('web service started');
app.use(function(req, res, next) {//for posts
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let mode = req.query.mode;
 let scoreList = [];
 let scoreJson = {};
 let userList = [];
 let userJson = {};
 let wordList = [];
 let wordJson = {};
 if(mode=="scores"){
   let scoreFile = fs.readFileSync("files/highscores.txt",'utf8');
   let lines = scoreFile.split("\n");
   for(let i=0; i<lines.length; i++){
     scoreJson = {};
     let splitLine = lines[i].split(":::");
     scoreJson["name"] = splitLine[0];
     scoreJson["score"] = splitLine[1];
     scoreList[i] = scoreJson;
   }
   scoreJson = {};
   scoreJson["scores"] = scoreList;//build json of all the elemnts
   res.send(JSON.stringify(scoreJson));
 }
 else if(mode=="users"){
   let userFile = fs.readFileSync("files/users.txt",'utf8');
   let lines = userFile.split("\n");
   for(let i=0; i<lines.length; i++){
     userJson = {};
     let splitLine = lines[i].split(":::");
     userJson["name"] = splitLine[0];
     userJson["password"] = splitLine[1];
     userList[i] = userJson;
   }
   userJson = {};
   userJson["users"] = userList;//build json of all the elemnts
   res.send(JSON.stringify(userJson));
 }
 else if(mode=="dictionary") {
   let dictFile = fs.readFileSync("files/dictionary.txt",'utf8');
   let lines = dictFile.split("\n");
   for(let i=0; i<lines.length; i++){
     wordJson = {};
     //let splitLine = lines[i].split(":::");
     wordJson["word"] = lines[i];
     //wordJson["definition"] = splitLine[1];
     wordList[i] = wordJson;
   }
   wordJson = {};
   wordJson["dictionary"] = wordList;//build json of all the elemnts
   res.send(JSON.stringify(wordJson));
 }

});
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let name = req.body.name;
  console.log(req.body.password);
  if(req.body.password != null){
	let password = req.body.password;
	fs.appendFile("files/users.txt", "\n"+ name + ":::"+password, function(err) {
   	if(err) {//append to the file the new comment from the webpage
			console.log(err);
			res.status(400);
   	}
   	console.log("The file was saved!");
   	res.send("Success!");
	});
}
else{
  let score = req.body.score;
  fs.appendFile("files/highscores.txt", "\n"+ name + ":::"+score, function(err) {
   	if(err) {//append to the file the new comment from the webpage
			console.log(err);
			res.status(400);
   	}
   	console.log("The file was saved!");
   	res.send("Success!");
});
}
});

app.listen(3000);

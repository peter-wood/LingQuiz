LingQuiz
======== 

<h5>This is a quiz interface that we use for an introduction to linguistics course at the University of Saskatchewan. Right now it only provides the option to administer a multiple choice quiz, but I will be adding quiz interfaces that can be used to test/train<h5> 

* phonetic transcription
* morphological analysis of words
* constituent analysis of sentences
* representing semantic features
* and much more


LingQuiz is a node.js project. It uses the following software / packages:

* node.js
* express
* mongodb
* angular js
* bootstrap

Notes
=====

* If npm install fails with an error in q.js, downgrade tmp (in node_modules/bower/package.json to 0.0.23
* Create a symbolic link to the bower_components dir in the app dir
* app/lib/config.js is a symbolic link to a config file in the same dir
* comments are important
* use the install script to copy webroot to server and adjust locals from config file
* removed import.js - It's easier to import / export csv with mongo functions



**Please contact me for comments, suggestions.**

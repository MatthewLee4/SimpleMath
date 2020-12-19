//QUIZ_CONTROLLER.JS
//contains scores and number of questions
function Quiz(questions) {
    this.score = 0;
    this.questions = questions;
    this.questionIndex = 0;
}
//get index of current question
Quiz.prototype.getQuestionIndex = function() {
    return this.questions[this.questionIndex];
}
//if quiz ended or not
Quiz.prototype.isEnded = function() {
    return this.questions.length === this.questionIndex;
}
//checks if correct answer or not
Quiz.prototype.guess = function(answer) {
    if(this.getQuestionIndex().correctAnswer(answer)) {
        this.score++;
    }
    this.questionIndex++;
}




//QUESTION.JS
function Question(text, choices, answer) {
    this.text=text;
    this.choices=choices;
    this.answer=answer;
}
Question.prototype.correctAnswer = function(choice) {
    return choice === this.answer;
}




//EQUATION.JS
//.random gives us a number between 0 and 1
//.floor will round the number up
//multiply by range so that the number we get isn't between 0 and 1
let getRandomNumber1 = function(start, range) { 
    let getRandom = Math.floor((Math.random() * range) + start); 
    while (getRandom > range) {     //this loop will give us a number that is not greater than the range
        getRandom = Math.floor((Math.random() * range) + start)
    }
    return getRandom;
}
var x = getRandomNumber1(1, 10); //set the range for what number you want

let getRandomNumber2 = function(start, range) { 
    let getRandom = Math.floor((Math.random() * range) + start); 
    while (getRandom > range) {     //this loop will give us a number that is not greater than the range
        getRandom = Math.floor((Math.random() * range) + start)
    }
    return getRandom;
}
var y = getRandomNumber2(1, 10); //set the range for what number you want




//APP.JS
function populate() {
    //check if quiz has ended or not
    if (quiz.isEnded()){
        showScores();
    }
    else {
        //show question
        var element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionIndex().text;

        //show choices
        var choices = quiz.getQuestionIndex().choices;
        for (var i = 0; i < choices.length; i++) {
            var element = document.getElementById("choice" + i);
            element.innerHTML = choices[i];
            guess("btn" + i, choices[i]);
        }

        //show progress
        showProgress();
    }
};

//function for when a user attempts to answer a question
function guess(id, guess) {
    var button = document.getElementById(id);
    button.onclick = function() {
        quiz.guess(guess);
        populate();
    }
}

function showProgress() {
    var currentQuestionNumber = quiz.questionIndex + 1;
    var element = document.getElementById("progress");
    element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
}

function showScores() {
    //the results
    var gameOverHtml = "<h1>Result</h1>";
    gameOverHtml += "<h2 id='score'> Your scores: " + quiz.score + "</h2>";
    //replacing the quiz with the results
    var element = document.getElementById("quiz");
    element.innerHTML = gameOverHtml;
}

//function to populate the quiz
var questions = [
    new Question(`What is ${x} + ${y}`, [`${x + y + 1}`, `${x + y +2}`, `${x + y}`, `${x + y + 3}`], `${x + y}`),
    new Question("What is 5 + 6", ["10", "11", "12", "13"], "11"),
    new Question("What is 12 + 24", ["33", "34", "35", "36"], "36"),
    new Question("What is 111 + 222", ["111", "222", "333", "444"], "333"),
    new Question("What is 1244 + 1345", ["2589", "2689", "2579", "2679"], "2589")
];
var quiz = new Quiz(questions);


document.addEventListener('DOMContentLoaded', () => {
    populate();
});

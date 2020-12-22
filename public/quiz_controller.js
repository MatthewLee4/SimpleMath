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
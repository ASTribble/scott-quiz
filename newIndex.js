
'use strict';
/* global $ */

let QUESTION_ARRAY = [];

//attempts at OOP classes/////////////////////////////////////////////

//make API requests for session token and question content
class ApiCall {
  constructor(){
    this.sessionToken = null;
  }
  
  getSessionToken() {
    $.getJSON('https://opentdb.com/api_token.php?command=request', function (data) {
      this.sessionToken = data.token;
      console.log(this.sessionToken);
      renderPage();
    });
  }

  _makeNewQuestion(questionData){
    console.log('makeNewQuestion ran');
    QUESTION_ARRAY[STORE.currentQuestion] = new Question(questionData);
    console.log('the api question count after makeNewQuestion is:', this.questionCount);
    renderPage();
  }

  getQuestionData() {
    console.log('the api question count is: ', this.questionCount);
    console.log('getQuestionData ran');
    const category = STORE.quizCategory;
    const that = this;
    $.getJSON(`https://opentdb.com/api.php?amount=1&category=${category}&type=multiple&${this.sessionToken}`, function(questionData){
      that._makeNewQuestion(questionData);
    });
  }
//this curly bracket is the end of the apiCalls 
}


class Question {
  constructor(questionData){
    console.log('class Question ran, questionData is', questionData);
    this.questionText = questionData.results[0].question;
    this.difficulty = questionData.results[0].difficulty;
    this.wrongAnswers = questionData.results[0].incorrect_answers;
    this.correctAnswerIndex = this.randomIndex();
    this.correctAnswer = questionData.results[0].correct_answer;
    this.answers = this.makeAnswerArray();
  }

  randomIndex() {
    console.log('randomIndex ran');
    return Math.floor(Math.random() * (this.wrongAnswers.length + 1));
  }

  makeAnswerArray() {
    console.log('makeAnswerArray ran');
    this.answers = [...this.wrongAnswers];
    this.answers.splice(this.correctAnswerIndex, 0, this.correctAnswer);
    console.log(this.answers);
    return this.answers;
  }

  makeAnswerBlock() {
    console.log('makeAnswerBlock ran');
    const answersString = this.answers.map( (answer) => {
      return `<input type="radio" name="choice" value=${this.answers.indexOf(answer)} class="choice" id="choice-${this.answers.indexOf(answer)}" required>
    <label for="choice-${this.answers.indexOf(answer)}">${answer}</label>`;
    });
    return answersString.join('');
  } 

  makeQuestionString(){
    console.log('QuestionString ran');
    if(this.questionText){
      return `
      <form class='question' id='question'>
        <h2>${this.questionText}</h2>
        <fieldset form='question' class='answers'>
        ${this.makeAnswerBlock()}
        </fieldset>
        ${generateButton(STORE.button.class, STORE.button.label)}
      </form>
    `;
    } 
    else {
      return 'Quiz is Loading...';
    }
  }

// this curly bracket is the end of the Questions class
}


// initial STORE object ///////////////////////////////////////////////////////

const STORE = {
  view: 'start',
  quizLength: null,
  quizCategory: null,
  currentQuestion: null,
  button: {class: 'start-button', label: 'Start Quiz'},
  showFeedback: false,
  correctAnswerTotal: 0,
  userChoice: null
};

// functions that set things in the store ////////////////////////////////////////////

function setQuizCategory() {
  console.log('quiz category ran');
  const category = parseInt($('.select-category option:checked').val());
  console.log('category id is:', category);
  return category;
}

function setQuizLength() {
  console.log('quizLength ran');
  const length = parseInt($('.quiz-length').val());
  console.log('quizLength is', length);
  return length;
}


// // template /////////////////////////////////////////////////////




//this creates a button with a specific class and text
function generateButton(buttonClass, text) {
  return `<button class="${buttonClass}">${text}</button>`;
}

//this should generate a string that will be fed into renderFeedbackView
function generateFeedback(i){
  console.log('Argument of generateFeedback', i);
  //this is giving us the value at QUESTIONS[i]
  const correctAnswer = QUESTION_ARRAY[i].correctAnswerIndex; 
  console.log('correct answer index', correctAnswer);
  STORE.userChoice = parseInt($('input[name=\'choice\']:checked').val());
  console.log('the typeof userChoice is',  typeof STORE.userChoice);
  console.log('indexUserChoice is', STORE.userChoice);
  let resultMessage; 
  if(STORE.userChoice !== correctAnswer){
    resultMessage = 'You were Wrong!';
  }
  if (STORE.userChoice === correctAnswer){
    resultMessage = 'You were Correct!';
    STORE.correctAnswerTotal++;
  }
  return `
    <div class="feedback">
            <h2 class="answer-feedback" id="user-answer">${resultMessage}</h2>
            <h2 class="answer-feedback" id="correct-answer">The Correct Answer was: ${QUESTION_ARRAY[i].answers[correctAnswer]}</h2>
        </div>`;
}


// render //////////////////////////////////////////////////

//this will render the page to the DOM based on 
//our current store state.
//this will be called each time we need to change the view 
//of the page
function renderPage() {
  
  if (STORE.view === 'start') {
    if (game1.sessionToken) {
      $('start-button').attr('disabled', false);
    }
    $('.page').html(renderStartView());
  }
  if (STORE.view === 'questions') {
    console.log('about to render');
    $('.page').html(renderQuestionView());
  }
  if (STORE.view === 'feedback' && STORE.showFeedback === true) {
    $('.page').html(renderFeedbackView());
  }
  if (STORE.view === 'results') {
    $('.page').html(renderResultsView());
  }
}
  

function renderStartView() {
  // render title and button
  return `
    <header class="title">
        <h1>Welcome to our Very Very Basic Math Quiz</h1>
    </header>
    <form class='initialize-quiz' id='initialize-quiz'>
      <fieldset form='initialize-quiz' class='initialize-quiz'>
        <lable for='quiz-length'>How many questions would you like to answer?</label>
          <input type="text" id="quiz-length" class="quiz-length" value="5"></input>
        <lable for='select-category'>In which category?</label>
        <select name='select-category' class='select-category' id='select-category' form='initialize-quiz'>
          <option value='9' checked>General Knowledge</option>
          <option value='17'>Science and Nature</option>
          <option value='25'>Art</option>
          <option value='22'>Geography</option>
        </select>
      </fieldset>
    </form>
    <button class=${STORE.button.class}>${STORE.button.label}</button>
    `;
}

//this function will return a string that outlines the 
//STORE.view = 'questions' page
function renderQuestionView(){
  //render the current question
  console.log('question_array is: ',QUESTION_ARRAY);
  if(QUESTION_ARRAY.length > 0){
    const question = QUESTION_ARRAY[STORE.currentQuestion].makeQuestionString();
    const currentState = renderCurrentState();
    //render a submit button
    // const button = generateButton(STORE.button.class, STORE.button.label);
    return `${question} ${currentState}`;
  }
  else{
    return 'Quiz is loading...';
  }

}

//this function returns a string that outlines the STORE.view = 'feedback' page
function renderFeedbackView(){
  //this will get the question block
  // const question = generateQuestion(STORE.currentQuestion);
  //this will get the feedback block
  const feedback = generateFeedback(STORE.currentQuestion);
  const button = generateButton(STORE.button.class, STORE.button.label);
  //this will get a next question button
  // const button = generateButton(STORE.button.class, STORE.button.label);
  const currentState = renderCurrentState();
  return `
    ${feedback} ${button} ${currentState}`;
}

function renderResultsView(){
  // render a title
  //show the results
  //make a start-over button
  return `
  <h1 class='result-title'>You Did It!!!!!</h1>
  <div class='results'>You got ${STORE.correctAnswerTotal} out of ${STORE.quizLength} right!</div>
  <button class=${STORE.button.class}>${STORE.button.label}</button>
  `;
}

function renderCurrentState() {
  return `
  <div class="current-state">
  <p class="current-question">Question: ${STORE.currentQuestion + 1} out of ${STORE.quizLength}</p>
  <p class="current-score">Score: ${STORE.correctAnswerTotal} out of ${STORE.quizLength}</p>
  </div>`;
}

// event handlers /////////////////////////////////////////////

function handleStartButtonClick(){
// this will set-up event handler for original button
  $('.page').on('click', '.start-button', function(event) {
    // we need to prevent the default behavior of a submit
    event.preventDefault();
    // we'll check if the event handler works
    console.log('the start button was pushed');
    STORE.quizLength = setQuizLength();
    STORE.quizCategory = setQuizCategory();
    STORE.currentQuestion = 0;
    STORE.view = 'questions';
    STORE.button = { class: 'submit-answer', label: 'Submit Answer' };
    game1.getQuestionData();
    console.log(STORE);
   
    renderPage();
  });
}

//on click on button
//change store view to feedback
//if it's the last question change the button to voew results
//else change the button to nest-question
//change button to 'view-results'
//change store showFeedback to true
// render the page

function handleSubmitAnswerButtonClicked() {
  $('.page').on('submit', 'form', function (event) {

    event.preventDefault();
    console.log('submit answer button was clicked');

    if(STORE.currentQuestion === STORE.quizLength-1) {
      STORE.button = {class: 'view-results', label: 'View Results'};
    } else {
      STORE.button = {class: 'next-question', label: 'Next Question'};
      console.log(STORE);
    }
    STORE.view = 'feedback';
    //we don't change the STORE.currentQuestion b/c we want it to stay 
    STORE.showFeedback = true;

    renderPage();
  });
}

function handleNextQuestionButtonClicked() {
  $('.page').on('click', '.next-question', function(event) {
    event.preventDefault();
    game1.getQuestionData();
    STORE.currentQuestion++;
    STORE.view = 'questions';
    STORE.button = {class:'submit-answer', label: 'Submit Answer'};
    renderPage();
  });
}

//on click on button
//change store view to results
//change button to 'start over'
//change currentQuestion to null
//output score and 'congatulations....'

function handleViewResultsButtonClicked() {
  $('.page').on('click', '.view-results', function(event) {
    event.preventDefault();
    STORE.view = 'results';
    STORE.button = {class:'start-over', label: 'Start Over'};
    STORE.currentQuestion = null;
    STORE.userChoice = null;
    renderPage();
  });
}

//reset STORE values to initial
//re render

function handleStartOverButtonClicked() {
  $('.page').on('click', '.start-over', function(event){
    event.preventDefault();
    STORE.view = 'start';
    STORE.quizLength = null;
    STORE.quizCategory = null;
    STORE.currentQuestion = null;
    STORE.button = {class: 'start-button', label: 'Start Quiz' };
    STORE.showFeedback = false;
    STORE.correctAnswerTotal = 0;
    QUESTION_ARRAY= [];
    renderPage();
  }
  );
}//this instantiates a new ApiCall
const game1 = new ApiCall(STORE);

//this is an anonymous function that will run automatically
//after the whole document is loaded.  that's why it's at the end
$(function () {
  game1.getSessionToken();
  renderPage();
  handleStartButtonClick();
  handleSubmitAnswerButtonClicked();
  handleNextQuestionButtonClicked();
  handleViewResultsButtonClicked();
  handleStartOverButtonClicked();
}
);
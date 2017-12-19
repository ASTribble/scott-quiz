
'use strict';
/* global $ */

let QUESTION_ARRAY = [];
let API_QUESTIONS = [];
//make API requests for session token and question content
class ApiCall {
  constructor(){
    this.sessionToken = null;
    this.questionCount = null;
    this.quizLength = null;
    this.quizCategory = null;
  }
  
  getSessionToken() {
    $.getJSON('https://opentdb.com/api_token.php?command=request', function (data) {
      this.sessionToken = data.token;
      console.log(this.sessionToken);
      renderPage();
    });
  }

  _setQuizLength() {
    console.log('quizLength ran');
    const length = parseInt($('.quiz-length').val());
    console.log('quizLength is', length);
    return length;
  }

  _setQuizCategory() {
    console.log('quiz category ran');
    // select#foo option: checked
    const category = parseInt($('.select-category option:checked').val());
    console.log('category id is:', category);
    return category;
  }

  setQuizLengthAndCategory(){
    this.quizLength = this._setQuizLength();
    this.quizCategory = this._setQuizCategory();
  }

  _makeNewQuestion(questionData){
    console.log('makeNewQuestion ran');
    QUESTION_ARRAY[this.questionCount] = new Question(questionData);
    this.questionCount++;
    renderPage();
  }

  getQuestionData() {
    this.questionCount = 0;
    console.log('getQuestionData ran');
    const that = this;
    $.getJSON(`https://opentdb.com/api.php?amount=1&category=${this.quizCategory}&type=multiple&${this.sessionToken}`, function(questionData){
      that._makeNewQuestion(questionData);
    });
  }
//this curly bracket is the end of the apiCalls 
}




class Question {
  constructor(questionData){
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
//  let answersArray = [...incorrectAnswers];
//   answersArray.splice(randomIndex, 0, correctAnswer);
//   return answersArray;
// }
  makeAnswerArray() {
    console.log('makeAnswerArray ran');
    this.answers = [...this.wrongAnswers];
    this.answers.splice(this.correctAnswerIndex, 0, this.correctAnswer);
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

// this curly bracketis the end of the Questions class
}
// getQuestionData(1);
// https://opentdb.com/api.php?amount=10&category=17&difficulty=medium


// const questionArray = function (data) {
//   console.log('question array ran', data.results);
//   API_QUESTIONS = data.results.map(function (result) {
//     const questionData = result;
//     const randomIndex = Math.floor(Math.random() * (questionData.incorrect_answers.length + 1));
//     const question = {
//     //   questionText: 'What is 2+2?',
//     //   answers: [1, 2, 3, 4],
//     //   correctAnswerIndex: 3
//     // },      
//       questionText: questionData.question,
//       difficulty: questionData.difficulty,
//       wrongAnswers: questionData.incorrect_answers,
//       correctAnswerIndex: randomIndex,
//       correctAnswer: questionData.correct_answer,
//       answers: makeAnswerArray(questionData.incorrect_answers, questionData.correct_answer, randomIndex),

//       // correctAnswerIndex: getRandomIndex(question.incorrect_answers)
//     };
//     console.log('the answers are', question.answers);
//     console.log('the question parts are', question);
//     return question;
//   });
//   renderPage();
// };

// function makeAnswerArray(incorrectAnswers, correctAnswer, randomIndex) {
//   console.log('makeAnswerArray ran');
//   let answersArray = [...incorrectAnswers];
//   answersArray.splice(randomIndex, 0, correctAnswer);
//   return answersArray;
// }




// // make api request for questions
// // populate quiz using API questions
// // add user answer tracking to store - maybe not necessary
// // add dropdown for user question number selection
// // add dropdown for user category selection
// // organize for OOP

// const QUESTIONS = [
//   {
//     questionText: 'What is 2+2?',
//     answers: [1, 2, 3, 4],
//     correctAnswerIndex: 3
//   },
//   {
//     questionText: 'What is 3-2?',
//     answers: [-10, 2, 1, 32],
//     correctAnswerIndex: 2
//   },
//   {
//     questionText: 'What is 1x1?',
//     answers: [1, 0, 100, 11],
//     correctAnswerIndex: 0
//   },
//   {
//     questionText: 'What is 25/5?',
//     answers: [125, 2, 5, 50],
//     correctAnswerIndex: 2
//   },
//   {
//     questionText: 'What is 6^2?',
//     answers: [36, 12, 6, 90],
//     correctAnswerIndex: 0
//   }
// ];
// // / views: start, questions, feedback, lastQuestionFeedback, results

const STORE = {
  view: 'start',
  currentQuestion: null,
  button: {class: 'start-button', label: 'Start Quiz'},
  showFeedback: false,
  correctAnswerTotal: 0,
  userChoice: null
};



// // template /////////////////////////////////////////////////////

// function generateQuestion(i){
//   //this pulls out the object at QUESTIONS at index i
//   const question = API_QUESTIONS[i];
//   if(API_QUESTIONS.length > 0){
//     console.log('QUESTIONS[i] =', question.answers);
//     //this is going to return a string with html markers with auto-filled
//     //questionText and answers
//     const answerBlock = makeAnswerBlock(question.answers);
//     console.log(answerBlock);
//     return `
//       <form class='question' id='question'>
//         <h2>${question.questionText}</h2>
//         <fieldset form='question' class='answers'>
//         ${answerBlock}
//         </fieldset>
//         ${generateButton(STORE.button.class, STORE.button.label)}
//       </form>
//     `;
//   } 
//   else{
//     return 'Quiz is Loading...';
//   }
// }


// return `
//   <form>
//   <div class="answer-choice">${question.questionText}</div>
//   <input type="radio" name="choice" value="0" class="choice" id="choice-1" required>
//     <label for="choice-1">${question.answers[0]}</label>
//   <input type="radio" name="choice" value="1" class="choice" id="choice-2" required>
//     <label for="choice-2">${question.answers[1]}</label>
//   <input type="radio" name="choice" value="2" class="choice" id="choice-3" required>
//     <label for="choice-3">${question.answers[2]}</label>
//   <input type="radio" name="choice" value="3" class="choice" id="choice-4" required>
//     <label for="choice-4">${question.answers[3]}</label>      
// </div>
// ${generateButton(STORE.button.class, STORE.button.label)}
// </form>
// `;
// }

//this will return a string of answer choices based on the length of the given answer array
// function makeAnswerBlock(answers) {
//   const answersString = answers.map(function(answer){
//     return `<input type="radio" name="choice" value=${answers.indexOf(answer)} class="choice" id="choice-${answers.indexOf(answer)}" required>
//     <label for="choice-${answers.indexOf(answer)}">${answer}</label>`;
//   });
//   return answersString.join('');
// } 


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
  // if (STORE.view === 'lastQuestionFeedback') {
  //   $('form').html(renderlastQuestionFeedbackView());
  // }
  if (STORE.view === 'results') {
    $('.page').html(renderResultsView());
  }
}
  
// <select name="text"> <!--Supplement an id here instead of using 'text'-->
//   <option value="value1">Value 1</option>
//   <option value="value2" selected>Value 2</option>
//   <option value="value3">Value 3</option>
// </select>

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
    const question = QUESTION_ARRAY[game1.questionCount - 1].makeQuestionString();
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
  <div class='results'>You got ${STORE.correctAnswerTotal} out of ${game1.quizLength} right!</div>
  <button class=${STORE.button.class}>${STORE.button.label}</button>
  `;
}

function renderCurrentState() {
  return `
  <div class="current-state">
  <p class="current-question">Question: ${STORE.currentQuestion + 1} out of ${game1.quizLength}</p>
  <p class="current-score">Score: ${STORE.correctAnswerTotal} out of ${game1.quizLength}</p>
  </div>`;
}

// function initializeGame(){
//   game1.setQuizLengthAndCategory();
//   if(game1.quizCategory){
//     game1.getQuestionData();}

// }  else{
//     return 'Initializing Quiz...';
//   }
//   renderPage();
// event handlers //////////////////////////////////////////////


function handleStartButtonClick(){
// this will set-up event handler for original button
  $('.page').on('click', '.start-button', function(event) {
    // we need to prevent the default behavior of a submit
    event.preventDefault();
    // we'll check if the event handler works
    console.log('the start button was pushed');
    game1.setQuizLengthAndCategory();
    game1.getQuestionData();
    // initializeGame();
    //we change the store to the next view
    STORE.view = 'questions';
    //we set question number to index 0
    STORE.currentQuestion = 0;
    //change the STORE.button to a submit-answer 
    STORE.button = {class:'submit-answer', label: 'Submit Answer'};
    console.log(STORE);
  
    //then we re-render the page for the new store 
    //to show the first question page
    renderPage();
  });
}


function handleSubmitAnswerButtonClicked() {
  //listen for the .submit-answer button click
  $('.page').on('submit', 'form', function (event) {
    //prevent the default behavior
    event.preventDefault();
    //check if the handler works
    console.log('submit answer button was clicked');
    if(STORE.currentQuestion === game1.quizLength-1) {
      STORE.button = {class: 'view-results', label: 'View Results'};
    } else {
      STORE.button = {class: 'next-question', label: 'Next Question'};
      console.log(STORE);
    }
    //change STORE.view to feedback
    STORE.view = 'feedback';
    //we don't change the STORE.currentQuestion b/c we want it to stay 
    // we change STORE.showFeedback to true
    STORE.showFeedback = true;
    // we change the STORE.button to 'next-question'
    renderPage();
  });
}

// if(input[type="radio"].attr('value') === STORE.userChoice)


function handleNextQuestionButtonClicked() {
  $('.page').on('click', '.next-question', function(event) {
    game1.getQuestionData();
    STORE.currentQuestion++;
    STORE.view = 'questions';
    STORE.button = {class:'submit-answer', label: 'Submit Answer'};
    renderPage();
  });
}

function handleViewResultsButtonClicked() {
  //on click on button
  //change store view to results
  //change button to 'start over'
  //change currentQuestion to null
  //output score and 'congatulations....'
  $('.page').on('click', '.view-results', function(event) {
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
    STORE.view = 'start';
    STORE.currentQuestion = null;
    STORE.button = {class: 'start-button', label: 'Start Quiz' };
    STORE.showFeedback = false;
    STORE.correctAnswerTotal = 0;
    QUESTION_ARRAY= [];
    game1.quizLength = null;
    game1.quizCategory = null;

    renderPage();
  }
  );
}


const game1 = new ApiCall;


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
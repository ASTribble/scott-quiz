
'use strict';
//make API request for session token

let SESSION_TOKEN;

function getSessionToken() {
  // {response_code: 0, response_message: "Token Generated Successfully!", token: "16f0d44d6d4be14927278b2700b7e75261ef6c22cb0741488415656ec1ba886b"}
  $.getJSON('https://opentdb.com/api_token.php?command=request', function (data) {
    SESSION_TOKEN = data.token;
    console.log(SESSION_TOKEN);
    return SESSION_TOKEN;
  });
}

getSessionToken();

function getQuestionData(amt) {
  $.getJSON(`https://opentdb.com/api.php?amount=${amt}&type=multiple&${SESSION_TOKEN}`, questionArray);
}

// const questionArray = function (data) {
//   console.log(data);
// };

// getQuestionData(1);
const API_QUESTIONS = [];

const questionArray = function (data) {
  console.log('question array ran', data.results);
  data.results.forEach(function (result) {
    const questionData = result;
    const question = {
    //   questionText: 'What is 2+2?',
    //   answers: [1, 2, 3, 4],
    //   correctAnswerIndex: 3
    // },      
      questiontext: questionData.question,
      difficulty: questionData.difficulty,
      wrongAnswers: questionData.incorrect_answers,
      correctAnswer: questionData.correct_answer,
      answers: makeAnswerArray(questionData.incorrect_answers, questionData.correct_answer),
      // correctAnswerIndex: getRandomIndex(question.incorrect_answers)
    };
    console.log('the answers are', question.answers);
    console.log('the question parts are', question);
    API_QUESTIONS.push(question);
  });
};


function makeAnswerArray(incorrectAnswers, correctAnswer) {
  console.log('makeAnswerArray ran');
  let answersArray = [...incorrectAnswers];
  const randomIndex = Math.floor(Math.random() * (answersArray.length + 1));
  answersArray.splice(randomIndex, 0, correctAnswer);
  return answersArray;
}

getQuestionData(1);


// make api request for questions
// populate quiz using API questions
// add user answer tracking to store - maybe not necessary
// add dropdown for user question number selection
// add dropdown for user category selection
// organize for OOP

const QUESTIONS = [
  {
    questionText: 'What is 2+2?',
    answers: [1, 2, 3, 4],
    correctAnswerIndex: 3
  },
  {
    questionText: 'What is 3-2?',
    answers: [-10, 2, 1, 32],
    correctAnswerIndex: 2
  },
  {
    questionText: 'What is 1x1?',
    answers: [1, 0, 100, 11],
    correctAnswerIndex: 0
  },
  {
    questionText: 'What is 25/5?',
    answers: [125, 2, 5, 50],
    correctAnswerIndex: 2
  },
  {
    questionText: 'What is 6^2?',
    answers: [36, 12, 6, 90],
    correctAnswerIndex: 0
  }
];
// / views: start, questions, feedback, lastQuestionFeedback, results

const STORE = {
  view: 'start',
  currentQuestion: null,
  button: {class: 'start-button', label: 'Start Quiz'},
  showFeedback: false,
  correctAnswerTotal: 0,
  userChoice: null
};



// template /////////////////////////////////////////////////////

function generateQuestion(i){
  //this pulls out the object at QUESTIONS at index i
  const question = QUESTIONS[i];
  console.log('QUESTIONS[i] =', question.answers);
  //this is going to return a string with html markers with auto-filled
  //questionText and answers
  const answerBlock = makeAnswerBlock(question.answers);
  console.log(answerBlock);
  return `
  <form class='question' id='question'>
    <h2>${question.questionText}</h2>
    <fieldset form='question' class='answers'>
    ${answerBlock}
    </fieldset>
    ${generateButton(STORE.button.class, STORE.button.label)}
  </form>
  `;
}

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
function makeAnswerBlock(answers) {
  const answersString = answers.map(function(answer){
    return `<input type="radio" name="choice" value=${answers.indexOf(answer)} class="choice" id="choice-${answers.indexOf(answer)}" required>
    <label for="choice-${answers.indexOf(answer)}">${answer}</label>`;
  });
  return answersString.join('');
} 


//this creates a button with a specific class and text
function generateButton(buttonClass, text) {
  return `<button class="${buttonClass}">${text}</button>`;
}

//this should generate a string that will be fed into renderFeedbackView
function generateFeedback(i){
  console.log('Argument of generateFeedback', i);
  //this is giving us the value at QUESTIONS[i]
  const correctAnswer = QUESTIONS[i].correctAnswerIndex; 
  console.log('correct answer index', correctAnswer);
  STORE.userChoice = $('input[name=\'choice\']:checked').val();
  console.log('indexUserChoice is', STORE.userChoice);
  let resultMessage; 
  if(STORE.userChoice !== correctAnswer){
    resultMessage = 'You were Wrong!';
  }
  if (STORE.userChoice == correctAnswer){
    resultMessage = 'You were Correct!';
    STORE.correctAnswerTotal++;
  }
  return `
    <div class="feedback">
            <h2 class="answer-feedback" id="user-answer">${resultMessage}</h2>
            <h2 class="answer-feedback" id="correct-answer">The Correct Answer was: ${QUESTIONS[i].answers[correctAnswer]}</h2>
        </div>`;
}


// render //////////////////////////////////////////////////

//this will render the page to the DOM based on 
//our current store state.
//this will be called each time we need to change the view 
//of the page
function renderPage() {
  
  if (STORE.view === 'start') {
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
  

function renderStartView() {
  // render title and button
  return `
    <header class="title">
        <h1>Welcome to our Very Very Basic Math Quiz</h1>
    </header>
    <button class=${STORE.button.class}>${STORE.button.label}</button>
    `;
}

//this function will return a string that outlines the 
//STORE.view = 'questions' page
function renderQuestionView(){
  //render the current question
  const question = generateQuestion(STORE.currentQuestion);
  const currentState = renderCurrentState();
  //render a submit button
  // const button = generateButton(STORE.button.class, STORE.button.label);
  return `${question} ${currentState}`;
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
  <div class='results'>You got ${STORE.correctAnswerTotal} out of ${QUESTIONS.length} right!</div>
  <button class=${STORE.button.class}>${STORE.button.label}</button>
  `;
}

function renderCurrentState() {
  return `
  <div class="current-state">
  <p class="current-question">Question: ${STORE.currentQuestion + 1} out of ${QUESTIONS.length}</p>
  <p class="current-score">Score: ${STORE.correctAnswerTotal} out of ${QUESTIONS.length}</p>
  </div>`;
}

// event handlers //////////////////////////////////////////////

function handleStartButtonClick(){
// this will set-up event handler for original button
  $('.page').on('click', '.start-button', function(event) {
    // we need to prevent the default behavior of a submit
    event.preventDefault();
    // we'll check if the event handler works
    console.log('the start button was pushed');
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
  }
  );
}

function handleSubmitAnswerButtonClicked() {
  //listen for the .submit-answer button click
  $('.page').on('submit', 'form', function (event) {
    //prevent the default behavior
    event.preventDefault();
    //check if the handler works
    console.log('submit answer button was clicked');
    if(STORE.currentQuestion === QUESTIONS.length-1) {
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


function handleNextQuestion() {
  $('.page').on('click', '.next-question', function(event) {
    STORE.currentQuestion++;
    STORE.view = 'questions';
    STORE.button = {class:'submit-answer', label: 'Submit Answer'};
    renderPage();
  });
}

function handleViewResults() {
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
function handleStartOver() {
  $('.page').on('click', '.start-over', function(event){
    STORE.view = 'start';
    STORE.currentQuestion = 0;
    STORE.button = {class: 'start-button', label: 'Start Quiz' };
    STORE.showFeedback = false;
    STORE.correctAnswerTotal = 0;
    renderPage();
  }
  );
}





//this is an anonymous function that will run automatically
//after the whole document is loaded.  that's why it's at the end
$(function () {
  renderPage();
  handleStartButtonClick();
  handleSubmitAnswerButtonClicked();
  handleNextQuestion();
  handleViewResults();
  handleStartOver();
}
);
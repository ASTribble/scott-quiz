

// let API_QUESTIONS = [];

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



//  let answersArray = [...incorrectAnswers];
//   answersArray.splice(randomIndex, 0, correctAnswer);
//   return answersArray;
// }
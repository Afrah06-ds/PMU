const m1 = require('./module1_questions.js');
const m2 = require('./module2_questions.js');
const m3 = require('./module3_questions.js');
const m4 = require('./module4_questions.js');
const m5 = require('./module5_questions.js');

const allQuestions = [...m1, ...m2, ...m3, ...m4, ...m5];

module.exports = allQuestions;

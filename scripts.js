let trivia;
let currentTab = 0;

// document.body.style.overflow = "hidden";

function getQuestions(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        trivia = data.results;
        resolve(data.results);
      });
  });
}

document.querySelector("#options").addEventListener("submit", () => {
  event.preventDefault();
  setOptions();
});

let amtCorrect = 0;
let total = 0;

function setTally(total, correct) {
  document.querySelector("#correct").innerHTML = `${correct}/${total}`;
}

function setOptions() {
  document.querySelector("[type='submit']").disabled = true;
  const amt = document.querySelector("[name='amtQuestions']").value;
  const category = document.querySelector("[name='category']").value;
  const difficulty = document.querySelector("[name='difficulty']").value;
  const type = document.querySelector("[name='type']").value;

  total = amt;

  let triviaURL = `https://opentdb.com/api.php?amount=${amt}${
    category > 0 ? "&category=" + category : ""
  }${difficulty ? "&difficulty=" + difficulty : ""}${
    type ? "&type=" + type : ""
  }`;
  console.log(triviaURL);

  getQuestions(triviaURL).then((questions) => {
    let container = document.querySelector("#questions");
    container.innerHTML = "";
    questions.forEach((question, index) => {
      container.innerHTML += `
      <div class="tab tab-${index}">
        <h2>Question ${index + 1}</h2>
        <h3>${question.category}</h3>
        <h4>${question.question}</h4>
        ${
          question.type == "multiple"
            ? multiAns(
                question.correct_answer,
                question.incorrect_answers,
                index
              )
            : boolAns(index)
        }
        <button onclick="checkAnswer(${index})">Check Answer</button>
      </div>
    `;
      showTab(currentTab);
      container.scrollIntoView();
      setTally(total, 0);
    });
  });
}

function boolAns(index) {
  return `
    <div class="answers">
    <input type="radio" name="q${index}" value="True" id="q${index}true">  
    <label class="answer" for="q${index}true">True </label>
      <input type="radio" name="q${index}" value="False" id="q${index}false">
      <label class="answer" for="q${index}false">False </label>
    </div>
  `;
}

function multiAns(correct, incorrect, index) {
  incorrect.push(correct);
  let questions = `<div class="answers">`;
  shuffle(incorrect);
  incorrect.forEach((question) => {
    questions += `
       <input type="radio" name="q${index}" value="${question}" id="${question
      .split(" ")
      .join("-")}">
    <label class="answer" for="${question
      .split(" ")
      .join("-")}">${question}</label>
    `;
  });
  questions += "</div>";
  return questions;
}

function checkAnswer(index) {
  console.log(index);
  let question = document.querySelectorAll(`[name='q${index}']`);

  let selected;

  for (let i = 0; i < question.length; i++) {
    if (question[i].checked == true) {
      selected = question[i];
    }
  }

  selected = selected.value;
  console.log(trivia[index].correct_answer, selected);

  if (trivia[index].correct_answer == selected) {
    alert(`You got question ${index + 1} correct`);
    amtCorrect++;
    setTally(total, amtCorrect);
  } else {
    alert(`You got question ${index + 1} wrong.
The correct answer is:
${trivia[index].correct_answer}`);
  }
  hideTab(currentTab);
  currentTab++;
  if (currentTab >= total) {
    alert(`Well done! You got ${amtCorrect} out of ${total} correct!`);
    document.querySelector("[type='submit']").disabled = false;
    document.querySelector("#settings").scrollIntoView();
    document.querySelector("#questions").innerHTML = "";
    total = 0;
    amtCorrect = 0;
    currentTab = 0;
    setTally(total, amtCorrect);
    return;
  }
  console.log();
  showTab(currentTab);
  // trivia.then((questions) => {
  // });
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// FUNCTIONALITY FOR MULTI PART FORM

function showTab(n) {
  let questions = document.querySelectorAll(".tab");
  questions[n].style.opacity = 1;
  questions[n].style.zIndex = 10;
  // questions[n].style.display = "flex";
}
function hideTab(n) {
  let questions = document.querySelectorAll(".tab");
  questions[n].style.opacity = 0;
  questions[n].style.zIndex = -10;
  // questions[n].style.display = "none";
}

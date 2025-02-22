const questions = [
    { question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris", "Rome"], correct: "Paris" },
    { question: "Which is the largest planet?", answers: ["Earth", "Jupiter", "Mars", "Venus"], correct: "Jupiter" },
    { question: "How many continents are there?", answers: ["5", "6", "7", "8"], correct: "7" },
    { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: "4" },
    { question: "Who wrote 'Hamlet'?", answers: ["Shakespeare", "Hemingway", "Fitzgerald", "Austen"], correct: "Shakespeare" }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timer;
let shuffledQuestions = [];

// Select Elements
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const progressText = document.getElementById("progress-text");
const resultContainer = document.getElementById("result-container");
const restartButton = document.getElementById("restart-btn");
const timerBar = document.getElementById("timer-bar");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Sounds
const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

// Load High Score
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score").innerText = highScore;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    shuffledQuestions = questions.sort(() => Math.random() - 0.5); // Shuffle Questions
    resultContainer.classList.add("hide");
    nextButton.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, currentQuestion.correct));
        answerButtons.appendChild(button);
    });

    startTimer();
}

function resetState() {
    clearInterval(timer);
    nextButton.style.display = "none";
    answerButtons.innerHTML = "";
    timeLeft = 10;
    timerBar.style.width = "100%";
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 10) * 100 + "%";

        if (timeLeft === 0) {
            clearInterval(timer);
            nextButton.style.display = "block"; // Auto move to next question
        }
    }, 1000);
}

function selectAnswer(button, correctAnswer) {
    clearInterval(timer);
    const selectedAnswer = button.innerText;
    if (selectedAnswer === correctAnswer) {
        button.classList.add("correct");
        correctSound.play();
        score++;
    } else {
        button.classList.add("wrong");
        wrongSound.play();
    }
    
    Array.from(answerButtons.children).forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.classList.add("correct");
        }
    });

    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    questionElement.innerText = "";
    answerButtons.innerHTML = "";
    nextButton.style.display = "none";
    resultContainer.classList.remove("hide");
    scoreElement.innerText = score;

    // Save High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("high-score").innerText = highScore;
    }
}

// Restart Button
restartButton.addEventListener("click", startQuiz);

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

// Start Quiz on Load
startQuiz();
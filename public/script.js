let selectedDifficulty = '';
let currentQuestions = [];
let score = 0;
let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(button => {
        button.addEventListener('click', function () {
            diffButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedDifficulty = this.getAttribute('data-value');
        });
    });
});

function decodeHTML(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

async function startQuiz() {
    // Call OpenTDB directly — no server needed
    const url = `https://opentdb.com/api.php?amount=5&category=13&type=multiple&difficulty=${selectedDifficulty}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const questions = data.results;

        if (questions && questions.length > 0) {
            // Decode HTML entities and attach shuffled options
            currentQuestions = questions.map(q => ({
                question: decodeHTML(q.question),
                correct: decodeHTML(q.correct_answer),
                options: shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHTML))
            }));

            score = 0;
            currentQuestionIndex = 0;

            document.getElementById('settings').style.display = 'none';
            document.getElementById('quiz').style.display = 'block';
            document.getElementById('result').style.display = 'none';

            showQuestion();
        } else {
            alert("The stage is empty! Try a different difficulty.");
        }
    } catch (error) {
        console.error("Connection error:", error);
        alert("Could not reach the trivia API. Check your internet connection.");
    }
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    const total = currentQuestions.length;

    document.getElementById('question-count').textContent =
        `Question ${currentQuestionIndex + 1} of ${total}`;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('progress').style.width =
        `${((currentQuestionIndex) / total) * 100}%`;

    document.getElementById('question').textContent = q.question;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(btn, opt));
        answersDiv.appendChild(btn);
    });

    document.getElementById('next-btn').style.display = 'none';
}

function handleAnswer(btn, selected) {
    const q = currentQuestions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('#answers button');

    allBtns.forEach(b => {
        b.disabled = true;
        if (b.textContent === q.correct) b.classList.add('correct');
    });

    if (selected === q.correct) {
        score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
    }

    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    const total = currentQuestions.length;
    const pct = Math.round((score / total) * 100);
    document.getElementById('final-score').textContent = `You scored ${score} out of ${total} (${pct}%)`;

    let message;
    if (pct === 100)    message = "Perfect! A true star of the stage! 🌟";
    else if (pct >= 80) message = "Excellent! You belong in the spotlight! 🎭";
    else if (pct >= 60) message = "Good show! Keep practicing your lines. 🎬";
    else if (pct >= 40) message = "Not bad! The stage awaits your return. 🎶";
    else                message = "Back to rehearsal! You'll get it next time. 🎼";

    document.getElementById('final-message').textContent = message;
}

function resetQuiz() {
    document.getElementById('settings').style.display = 'block';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}
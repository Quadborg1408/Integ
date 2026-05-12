let questions = [];
let currentIndex = 0;
let score = 0;

function decode(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function startQuiz() {
    const difficulty = document.getElementById("difficulty").value;
    const amount     = document.getElementById("amount").value;

    document.getElementById("start-btn").textContent = "Loading...";
    document.getElementById("start-btn").disabled = true;

    try {
        const res = await fetch(`/api/questions?amount=${amount}&difficulty=${difficulty}`);
        questions = await res.json();

        if(!questions.length) {
            alert("No questions found. Try again.");
            document.getElementById("start-btn").textContent = "Start Quiz 🎬";
            document.getElementById("start-btn").disabled = false;
            return;
        }

        currentIndex = 0;
        score = 0;

        document.getElementById("settings").style.display = "none";
        document.getElementById("quiz").style.display = "block";
        document.getElementById("result").style.display = "none";

        showQuestion();
    } catch(err) {
        alert("Failed to load questions. Try again.");
        document.getElementById("start-btn").textContent = "Start Quiz 🎬";
        document.getElementById("start-btn").disabled = false;
    }
}

function showQuestion() {
    if(currentIndex >= questions.length) {
        endQuiz();
        return;
    }

    const q = questions[currentIndex];
    const allAnswers = shuffle([...q.incorrect_answers, q.correct_answer]);

    // Update progress bar
    const progress = ((currentIndex) / questions.length) * 100;
    document.getElementById("progress").style.width = progress + "%";

    document.getElementById("question-count").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("question").innerHTML = `<h3>${decode(q.question)}</h3>`;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    allAnswers.forEach(answer => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = decode(answer);
        btn.onclick = () => checkAnswer(btn, answer, q.correct_answer);
        answersDiv.appendChild(btn);
    });

    document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(btn, selected, correct) {
    document.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);

    if(selected === correct) {
        btn.classList.add("correct");
        score++;
        document.getElementById("score").textContent = `Score: ${score}`;
    } else {
        btn.classList.add("wrong");
        document.querySelectorAll(".answer-btn").forEach(b => {
            if(b.textContent === decode(correct)) b.classList.add("correct");
        });
    }

    document.getElementById("next-btn").style.display = "block";
    currentIndex++;
}

function nextQuestion() {
    showQuestion();
}

function endQuiz() {
    document.getElementById("progress").style.width = "100%";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";

    const total = questions.length;
    document.getElementById("final-score").textContent = `${score} / ${total}`;

    let message = "";
    const percent = (score / total) * 100;
    if(percent === 100)       message = "Perfect score! You're a true theater fanatic! 🌟";
    else if(percent >= 80)    message = "Excellent! You really know your musicals! 🎭";
    else if(percent >= 60)    message = "Good job! You know your way around the stage! 🎬";
    else if(percent >= 40)    message = "Not bad! Keep watching those musicals! 🎵";
    else                      message = "Keep practicing! The stage awaits! 🎪";

    document.getElementById("final-message").textContent = message;
}

function resetQuiz() {
    document.getElementById("result").style.display = "none";
    document.getElementById("settings").style.display = "block";
    document.getElementById("start-btn").textContent = "Start Quiz 🎬";
    document.getElementById("start-btn").disabled = false;
}
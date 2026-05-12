let selectedDifficulty = 'medium'; // Global variable

document.addEventListener('DOMContentLoaded', () => {
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(button => {
        button.addEventListener('click', function() {
            diffButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedDifficulty = this.getAttribute('data-value');
        });
    });
});

async function startQuiz() {
    // We call YOUR server's route, not the external OpenTDB URL
    const amount = 5;
    const url = `/api/questions?amount=${amount}&difficulty=${selectedDifficulty}`;

    try {
        const response = await fetch(url);
        // Your server.js does: res.json(data.results), so 'data' is already the array
        const questions = await response.json();
        
        if (questions && questions.length > 0) {
            currentQuestions = questions;
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
        alert("Make sure your server is running!");
    }
}
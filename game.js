// game.js
const wrong = new Audio('./sounds/wrong.mp3');
const correct =  new Audio('./sounds/correct.mp3');
const buildup = new Audio('./sounds/buildup.mp3');
const SafeguardingMillionaire = (() => {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
    let currentLevel = 0;

    let gameContainer, questionEl, optionsEl, resultEl, tryAgainBtn, scoreEl;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const init = (containerId) => {
        gameContainer = document.getElementById(containerId);

        if (!gameContainer) {
            console.error(`Container with ID '${containerId}' not found.`);
            return;
        }

        currentQuestionIndex = 0;
        currentLevel = 0;
        score = 0;

        gameContainer.innerHTML = `
            <div class="wm-game-container">
                <button class="fullscreen-btn" aria-label="Toggle fullscreen">Return to Site</button>
                <h2 class="wm-title">Who Wants to Be a Safeguarding Millionaire</h2>
                <div class="wm-score">Current Prize: £${moneyValues[currentLevel]}</div>
                <div class="wm-question-container">
                    <div id="wm-question">Loading question...</div>
                    <div class="wm-options-grid" id="wm-options"></div>
                </div>
                
            </div><button id="wm-try-again" class="wm-try-again hidden">Try Again</button>
        `;

        const fullscreenBtn = gameContainer.querySelector('.fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                gameContainer.requestFullscreen().catch((err) => console.warn(`Fullscreen error:`, err));
            } else {
                document.exitFullscreen().catch((err) => console.warn(`Exit fullscreen error:`, err));
            }
        });

        document.addEventListener('fullscreenchange', () => {
            fullscreenBtn.textContent = document.fullscreenElement ? 'Return' : '⤢ Fullscreen';
        });

        gameContainer.classList.add('active');

        questionEl = gameContainer.querySelector('#wm-question');
        optionsEl = gameContainer.querySelector('#wm-options');
        tryAgainBtn = gameContainer.querySelector('#wm-try-again');
        scoreEl = gameContainer.querySelector('.wm-score');

        tryAgainBtn.addEventListener('click', resetGame);

        fetch('quiz.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                questions = shuffleArray(data);
                loadQuestion();
            })
            .catch((error) => {
                questionEl.textContent = 'Failed to load questions.';
                console.error('Error fetching quiz.json:', error);
            });
    };

    const shuffleArray = (array) => {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    const loadQuestion = async () => {
        if (currentQuestionIndex >= questions.length) {
            endGame(true);
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionEl.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
        optionsEl.innerHTML = '';

        const optionsWithStatus = currentQuestion.options.map((option, index) => ({
            text: option,
            isCorrect: index === currentQuestion.answer,
        }));

        const shuffledOptions = shuffleArray([...optionsWithStatus]);
            
        await wait(2000); // 2-second suspense before showing options

        shuffledOptions.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.classList.add('wm-option');
            btn.textContent = `${['A', 'B', 'C', 'D'][index]}: ${option.text}`;
            btn.dataset.correct = option.isCorrect;
            btn.setAttribute('aria-label', `Option ${index + 1}`);
            btn.addEventListener('click', () => selectOption(option.isCorrect));
            // add onclick to make text yellow when clicked
            btn.addEventListener('click', () => {
                btn.style.color = '#FFD700';
            });
            optionsEl.appendChild(btn);
     
        });        

    };

const selectOption = async (isCorrect) => {
    const allOptions = optionsEl.querySelectorAll('.wm-option');



    // update option colors to show correct and wrong answers
    buildup.play();
    await wait(3000); // Delay before loading the next question
    for (let i = 0; i < allOptions.length; i++) { // red for wrong, green for correct
            allOptions[i].style.color = 'red';
            
    }
    if (isCorrect) {
        correct.play();
        const correctOption = optionsEl.querySelector('[data-correct="true"]');
        correctOption.style.backgroundColor = '#4CAF50'; // Green for correct
        correctOption.style.color = 'green';
        currentLevel++;
        scoreEl.textContent = `Current Prize: £${moneyValues[currentLevel]}`;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            await wait(2000); // Delay before loading the next question

            loadQuestion();
        } else {
            endGame(true);
        }
    } else {
        wrong.play();
        const selectedOption = optionsEl.querySelector('.wm-option:hover');
        selectedOption.style.backgroundColor = '#FF6B6B'; // Red for wrong
        selectedOption.style.color = 'white';

        const correctOption = optionsEl.querySelector('[data-correct="true"]');
        correctOption.style.backgroundColor = '#4CAF50'; // Highlight correct answer
        correctOption.style.color = 'white';
        await wait(2000); // Delay before ending the game

        endGame(false);
    }
};

    const endGame = (won) => {
        questionEl.textContent = won
            ? `Congratulations! You've won £${moneyValues[currentLevel - 1]}!`
            : "I'm sorry, that was the wrong answer!";
        optionsEl.innerHTML = '';
        
        tryAgainBtn.classList.remove('hidden');
    };

    const resetGame = () => {
        currentLevel = 0;
        currentQuestionIndex = 0;
        scoreEl.textContent = `Current Prize: £${moneyValues[currentLevel]}`;
        tryAgainBtn.classList.add('hidden');
        loadQuestion();
    };

    return {
        init,
    };
})();

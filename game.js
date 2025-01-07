// game.js

const SafeguardingMillionaire = (() => {
    // Private Variables
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Money values array
    const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
    let currentLevel = 0;

    // DOM Elements
    let gameContainer;
    let questionEl;
    let optionsEl;
    let resultEl;
    let nextBtn;
    let tryAgainBtn;
    let scoreEl;

    // Initialize the game
    const init = (containerId) => {
        gameContainer = document.getElementById(containerId);

        if (!gameContainer) {
            console.error(`Container with ID '${containerId}' not found.`);
            return;
        }

        // Reset state and create HTML structure
        currentQuestionIndex = 0;
        currentLevel = 0;
        score = 0;

        gameContainer.innerHTML = `
            <div class="wm-game-container">
                <button class="fullscreen-btn">⤢</button>
                <h2 class="wm-title">Who Wants to Be a Safeguarding Millionaire</h2>
                <div class="wm-score">Current Prize: £${moneyValues[currentLevel]}</div>
                <div class="wm-question-container">
                    <div id="wm-question">Loading question...</div>
                    <div class="wm-options-grid" id="wm-options"></div>
                </div>
                <button id="wm-try-again" class="wm-try-again hidden">Try Again</button>
            </div>
        `;

        // Add fullscreen functionality with improved error handling
        const fullscreenBtn = gameContainer.querySelector('.fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                gameContainer.requestFullscreen().catch(err => {
                    console.warn(`Error attempting to enable fullscreen:`, err);
                    // Fallback for browsers that don't support fullscreen
                    gameContainer.classList.add('maximized');
                });
            } else {
                document.exitFullscreen().catch(err => {
                    console.warn(`Error attempting to exit fullscreen:`, err);
                    gameContainer.classList.remove('maximized');
                });
            }
        });

        // Update fullscreen button text based on state
        document.addEventListener('fullscreenchange', () => {
            fullscreenBtn.textContent = document.fullscreenElement ? '⤓' : '⤢';
            gameContainer.classList.toggle('fullscreen', document.fullscreenElement);
        });

        // Ensure the game container is visible when active
        gameContainer.classList.add('active');

        // Initialize game elements
        questionEl = gameContainer.querySelector('#wm-question');
        optionsEl = gameContainer.querySelector('#wm-options');
        resultEl = gameContainer.querySelector('#wm-result');
        tryAgainBtn = gameContainer.querySelector('#wm-try-again');
        scoreEl = gameContainer.querySelector('.wm-score');

        // Set up event listeners
        tryAgainBtn.addEventListener('click', resetGame);

        // Load questions
        fetch('quiz.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                questions = shuffleArray(data);
                loadQuestion();
            })
            .catch(error => {
                questionEl.textContent = 'Failed to load questions.';
                console.error('Error fetching quiz.json:', error);
            });

        // Event Listener for Next Button
        nextBtn && nextBtn.addEventListener('click', () => { // Ensure nextBtn exists
            currentQuestionIndex++;
            loadQuestion();
        });
    };

    // Shuffle array using Fisher-Yates algorithm
    const shuffleArray = (array) => {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = 
            [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    // Load a question
    const loadQuestion = () => {
        if (currentQuestionIndex >= questions.length) {
            endGame(true);
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionEl.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
        optionsEl.innerHTML = '';

        // Create a mapping of options with their correct/incorrect status
        let optionsWithStatus = currentQuestion.options.map((option, index) => ({
            text: option,
            isCorrect: index === currentQuestion.answer
        }));

        // Shuffle the options while preserving their correct/incorrect status
        let shuffledOptions = shuffleArray([...optionsWithStatus]);

        // Create and append options
        shuffledOptions.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.classList.add('wm-option');
            btn.dataset.index = index;
            btn.textContent = `${['A', 'B', 'C', 'D'][index]}: ${option.text}`;
            btn.dataset.correct = option.isCorrect;
            btn.style.animationDelay = `${(index + 1) * 0.2}s`;
            optionsEl.appendChild(btn);
            btn.addEventListener('click', () => selectOption(index, option.isCorrect));
        });
    };

    // Handle option selection
    const selectOption = (selectedIndex, isCorrect) => {
        const allOptions = optionsEl.querySelectorAll('.wm-option');

        // Disable all options
        allOptions.forEach(btn => {
            btn.disabled = true;
            const isCorrectOption = btn.dataset.correct === 'true';
            
            if (isCorrectOption) {
                btn.classList.add('correct-answer');
            } else {
                btn.classList.add('wrong-answer');
            }
        });

        if (isCorrect) {
            currentLevel++;
            scoreEl.textContent = `Current Prize: £${moneyValues[currentLevel]}`;
            
            setTimeout(() => {
                if (currentLevel >= moneyValues.length) {
                    endGame(true);
                } else {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < questions.length) {
                        loadQuestion();
                    } else {
                        endGame(true);
                    }
                }
            }, 2000); // Increased delay to show colors
        } else {
            setTimeout(() => {
                endGame(false);
            }, 2000); // Increased delay to show colors
        }
    };

    // End the game and show the final score
    const endGame = (won) => {
        questionEl.textContent = won ? 
            `Congratulations! You've won £${moneyValues[currentLevel-1]}!` :
            "I'm sorry, that was the wrong answer!";
        
        optionsEl.innerHTML = '';
        tryAgainBtn.classList.remove('hidden'); // Use CSS class to show button
    };

    const resetGame = () => {
        currentLevel = 0;
        currentQuestionIndex = 0;
        scoreEl.textContent = `Current Prize: £${moneyValues[currentLevel]}`;
        tryAgainBtn.classList.add('hidden'); // Use CSS class to hide button
        loadQuestion();
    };

    return {
        init
    };
})();

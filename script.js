document.addEventListener('DOMContentLoaded', () => {
    // Get DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const burger = document.querySelector('.burger');
    const tabNav = document.querySelector('.tab-nav');
    const modals = document.querySelectorAll('.modal');
    const modalOpenButtons = document.querySelectorAll('.modal-open-button');
    const modalCloseButtons = document.querySelectorAll('.modal-close-button');
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('.tab-content');
    const reportForm = document.querySelector('#reportForm');
    const playGameBtn = document.getElementById('play-game-btn');
    const gameContainer = document.getElementById('safeguarding-game');
    const videos = document.querySelectorAll('.video-gallery .video');
    const prevButton = document.querySelector('.prev-video');
    const nextButton = document.querySelector('.next-video');
    const accordionButtons = document.querySelectorAll('.accordion-button');
    const theme = new Audio('./sounds/theme.mp3');
    // Tab Navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(tab => tab.classList.remove('active'));
            const target = document.querySelector(button.dataset.tabTarget);
            if (target) target.classList.add('active');
            updateProgress();
        });
    });

    // Progress Tracker
    function updateProgress() {
        const totalSections = sections.length;
        const activeIndex = Array.from(sections).findIndex(section => 
            section.classList.contains('active')
        );
        const progress = ((activeIndex + 1) / totalSections) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Burger Menu
    if (burger && tabNav) {
        burger.addEventListener('click', () => {
            tabNav.classList.toggle('active');
            burger.classList.toggle('toggle');
        });
    }

    // Modal Functionality
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // Accordion Functionality
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            accordionButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.classList.remove('active');
            });
            if (!expanded) {
                button.setAttribute('aria-expanded', 'true');
                button.nextElementSibling.classList.add('active');
            }
        });
    });

    // Game Initialization
    if (playGameBtn && gameContainer) {
        
        playGameBtn.addEventListener('click', () => {
            theme.play();
            tabContents.forEach(tab => tab.classList.remove('active'));
            const gameSection = document.getElementById('play-game');
            if (gameSection) {
                gameSection.classList.add('active');
            }
            gameContainer.classList.add('active');
            SafeguardingMillionaire.init('safeguarding-game');
            
            // Request fullscreen after a short delay
            setTimeout(() => {
                if (!document.fullscreenElement) {
                    gameContainer.requestFullscreen().catch(err => {
                        console.warn('Error attempting to enable fullscreen:', err);
                        gameContainer.classList.add('maximized');
                    });
                }
            }, 100);
        });
    }

    // Video Gallery Navigation
    let currentVideoIndex = 0;

    function showVideo(index) {
        videos.forEach(video => video.classList.remove('active'));
        videos[index].classList.add('active');
    }

    if (prevButton && nextButton && videos.length > 0) {
        prevButton.addEventListener('click', () => {
            currentVideoIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1;
            showVideo(currentVideoIndex);
        });

        nextButton.addEventListener('click', () => {
            currentVideoIndex = currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : 0;
            showVideo(currentVideoIndex);
        });
    }

    // Initialize Progress
    updateProgress();
});


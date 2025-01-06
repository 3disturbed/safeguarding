/****************************************************
 * SPA Navigation
 ****************************************************/
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' from all buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    // Add 'active' to the clicked button
    button.classList.add('active');

    // Hide all tab contents
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Show the target tab content
    const target = document.querySelector(button.dataset.tabTarget);
    target.classList.add('active');
  });
});

/****************************************************
 * Accordion Functionality
 ****************************************************/
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(accBtn => {
  accBtn.addEventListener('click', () => {
    // Toggle the panel
    const content = accBtn.nextElementSibling;
    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
  });
});

/****************************************************
 * Modal Functionality
 ****************************************************/
const openModalButtons = document.querySelectorAll('.modal-open-button');
const closeModalButtons = document.querySelectorAll('.modal-close-button');
const modals = document.querySelectorAll('.modal');

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.style.display = 'flex';
  });
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.style.display = 'none';
  });
});

// Close modal if user clicks outside the modal content
window.addEventListener('click', (event) => {
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

/****************************************************
 * Progress Tracker
 ****************************************************/
const progressBar = document.querySelector('.progress-bar');
const sections = document.querySelectorAll('.tab-content');

function updateProgress() {
  const totalSections = sections.length;
  const activeIndex = Array.from(sections).findIndex(section => 
    section.classList.contains('active')
  );
  const progress = ((activeIndex + 1) / totalSections) * 100;
  progressBar.style.width = `${progress}%`;
}

tabButtons.forEach(button => {
  button.addEventListener('click', updateProgress);
});

/****************************************************
 * Form Handling
 ****************************************************/
const reportForm = document.querySelector('#reportForm');
if (reportForm) {
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert('Report submitted successfully!');
    const modal = reportForm.closest('.modal');
    modal.style.display = 'none';
  });
}

/****************************************************
 * Burger Menu Functionality
 ****************************************************/
const burger = document.querySelector('.burger');
const tabNav = document.querySelector('.tab-nav');

burger.addEventListener('click', () => {
  tabNav.classList.toggle('active');
  burger.classList.toggle('toggle');
});

// Close the burger menu when a tab is clicked (for mobile)
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (tabNav.classList.contains('active')) {
      tabNav.classList.remove('active');
      burger.classList.remove('toggle');
    }
  });
});

/****************************************************
 * Accessibility Enhancements
 ****************************************************/
// Allow navigation via keyboard
tabButtons.forEach(button => {
  button.setAttribute('tabindex', '0');
});

accordionButtons.forEach(accBtn => {
  accBtn.setAttribute('tabindex', '0');
});

// Modal focus trap
modals.forEach(modal => {
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll('a, button, textarea, input, select');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
});

/****************************************************
 * Video Gallery Navigation
 ****************************************************/
const videos = document.querySelectorAll('.video-gallery .video');
const prevButton = document.querySelector('.prev-video');
const nextButton = document.querySelector('.next-video');
let currentVideoIndex = 0;

function showVideo(index) {
    videos.forEach(video => video.classList.remove('active'));
    videos[index].classList.add('active');
}

if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
        currentVideoIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1;
        showVideo(currentVideoIndex);
    });

    nextButton.addEventListener('click', () => {
        currentVideoIndex = currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : 0;
        showVideo(currentVideoIndex);
    });
}

// Initialize progress
updateProgress();

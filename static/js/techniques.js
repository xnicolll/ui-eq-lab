let currentStep = 1;

function navigateToStep(step) {
    // Hide all steps
    document.querySelectorAll('.learn-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show selected step
    document.querySelector(`.learn-step[data-step="${step}"]`).style.display = 'block';
    
    // Update step counter
    document.querySelector('.step-counter').textContent = `${step} / 5`;
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = step === 1;
    
    if (step === 5) {
        nextBtn.textContent = 'Go to Song Examples';
        nextBtn.addEventListener('click', function() {
            window.location.href = '/examples';
        });
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.onclick = function() {
            if (currentStep < 5) {
                navigateToStep(currentStep + 1);
            }
        };
    }
    
    // Update current step
    currentStep = step;
}

// Add event listeners for navigation buttons
document.querySelector('.prev-btn').addEventListener('click', function() {
    if (currentStep > 1) {
        navigateToStep(currentStep - 1);
    }
});

// Initialize first step
navigateToStep(1); 
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const steps = document.querySelectorAll('.learn-step');
    const stepCounter = document.querySelector('.step-counter');
    let currentStep = 1;
    const totalSteps = steps.length;

    function updateSteps() {
        // Hide all steps
        steps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.learn-step[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        // Update step counter
        stepCounter.textContent = `${currentStep} / ${totalSteps}`;

        // Update button states
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            nextBtn.textContent = 'EQ Techniques';
            nextBtn.href = '/techniques';
            nextBtn.onclick = null;
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.href = '#';
            nextBtn.onclick = function(e) {
                e.preventDefault();
                currentStep++;
                updateSteps();
            };
        }
    }

    // Handle previous button click
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    // Initialize first step
    updateSteps();
}); 
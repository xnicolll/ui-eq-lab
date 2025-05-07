document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const steps = document.querySelectorAll('.learn-step');
    const stepCounter = document.querySelector('.step-counter');
    let currentStep = 1;
    const totalSteps = steps.length;

    function updateSteps() {
        steps.forEach(step => {
            step.style.display = 'none';
        });
        
        const currentStepElement = document.querySelector(`.learn-step[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        stepCounter.textContent = `${currentStep} / ${totalSteps}`;

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

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    updateSteps();
}); 
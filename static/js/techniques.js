let currentStep = 1;

function navigateToStep(step) {
    document.querySelectorAll('.learn-step').forEach(step => {
        step.style.display = 'none';
    });
    
    document.querySelector(`.learn-step[data-step="${step}"]`).style.display = 'block';
    
    document.querySelector('.step-counter').textContent = `${step} / 5`;
    
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
    
    currentStep = step;
}

document.querySelector('.prev-btn').addEventListener('click', function() {
    if (currentStep > 1) {
        navigateToStep(currentStep - 1);
    }
});

navigateToStep(1); 
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.dropdown-toggle');
    const detailedResults = document.querySelector('.detailed-results');
    
    toggleButton.addEventListener('click', function() {
        const isHidden = detailedResults.style.display === 'none';
        
        if (isHidden) {
            detailedResults.style.display = 'block';
            setTimeout(() => {
                detailedResults.classList.add('show');
            }, 10);
            toggleButton.textContent = 'Hide Detailed Results';
        } else {
            detailedResults.classList.remove('show');
            setTimeout(() => {
                detailedResults.style.display = 'none';
            }, 300);
            toggleButton.textContent = 'Show Detailed Results';
        }
    });
}); 
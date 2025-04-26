$(document).ready(function() {
    // Initialize audio players
    $('audio').each(function() {
        this.volume = 0.5;
    });

    // Handle EQ controls
    $('.eq-control').on('input', function() {
        const value = $(this).val();
        const frequency = $(this).data('frequency');
        // Add your EQ processing logic here
        console.log(`Frequency ${frequency}Hz: ${value}dB`);
    });

    // Learn section navigation
    let currentStep = 1;
    const totalSteps = $('.learn-step').length;

    function updateStep(step) {
        $('.learn-step').hide();
        $(`.learn-step[data-step="${step}"]`).fadeIn(300);
        $('.step-counter').text(`${step} / ${totalSteps}`);
        
        // Update button states
        $('.prev-btn').prop('disabled', step === 1);
        
        // Handle next button
        const nextBtn = $('.next-btn');
        if (step === 5) {
            if (window.location.pathname === '/intro') {
                if (!nextBtn.is('a')) {
                    nextBtn.replaceWith('<a href="/techniques" class="nav-btn next-btn">EQ Techniques</a>');
                }
            } else if (window.location.pathname === '/techniques') {
                if (!nextBtn.is('a')) {
                    nextBtn.replaceWith('<a href="/examples" class="nav-btn next-btn">Song Examples</a>');
                }
            }
        } else {
            if (nextBtn.is('a')) {
                nextBtn.replaceWith('<button class="nav-btn next-btn">Next</button>');
                // Reattach click handler to the new button
                $('.next-btn').on('click', handleNext);
            }
            $('.next-btn').prop('disabled', step === totalSteps);
        }
    }

    function handleNext(e) {
        if ($(this).is('a')) return; // Don't handle click if it's a link
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
        }
    }

    function handlePrev() {
        if (currentStep > 1) {
            currentStep--;
            updateStep(currentStep);
        }
    }

    // Initial button setup
    $('.next-btn').on('click', handleNext);
    $('.prev-btn').on('click', handlePrev);
}); 
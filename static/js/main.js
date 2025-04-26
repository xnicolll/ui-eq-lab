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
        
        // Special handling for step 5
        if (step === 5) {
            $('.next-btn').replaceWith('<a href="/techniques" class="nav-btn next-btn">EQ Techniques</a>');
        } else {
            if ($('.next-btn').is('a')) {
                $('.next-btn').replaceWith('<button class="nav-btn next-btn">Next</button>');
            }
            $('.next-btn').prop('disabled', step === totalSteps);
        }
    }

    $('.next-btn').click(function() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
        }
    });

    $('.prev-btn').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateStep(currentStep);
        }
    });
}); 
$(document).ready(function() {
    // Initialize audio players
    $('audio').each(function() {
        this.volume = 0.5;
    });

    // Handle EQ controls
    $('.eq-control').on('input', function() {
        const value = $(this).val();
        const frequency = $(this).data('frequency');
        console.log(`Frequency ${frequency}Hz: ${value}dB`);
    });

    // Cookie management functions
    function setCookie(name, value, hours = 24) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

    // Navigation state management
    function updateNavigationState() {
        const examplesNav = $('#examples-nav');
        const quizNav = $('#quiz-nav');
        
        // Check if user has completed techniques
        if (getCookie('completed_techniques')) {
            examplesNav.removeClass('disabled').attr('data-accessible', 'true');
        } else {
            examplesNav.addClass('disabled').attr('data-accessible', 'false');
        }
        
        // Check if user has accessed examples
        if (getCookie('accessed_examples')) {
            quizNav.removeClass('disabled').attr('data-accessible', 'true');
        } else {
            quizNav.addClass('disabled').attr('data-accessible', 'false');
        }
    }

    // Handle navigation clicks
    $('.nav-link').on('click', function(e) {
        const isAccessible = $(this).attr('data-accessible');
        if (isAccessible === 'false') {
            e.preventDefault();
            return false;
        }
    });

    // Update navigation when reaching the end of techniques
    if (window.location.pathname === '/techniques') {
        $('.next-btn').on('click', function() {
            if (typeof currentStep !== 'undefined' && currentStep === 5) {
                setCookie('completed_techniques', 'true');
                updateNavigationState();
                window.location.href = '/examples';
            }
        });
    }

    // Mark examples as accessed when visiting the page
    if (window.location.pathname === '/examples') {
        setCookie('completed_techniques', 'true');
        setCookie('accessed_examples', 'true');
        updateNavigationState();
    }

    // Handle quiz completion
    if (window.location.pathname === '/results') {
        setCookie('completed_quiz', 'true');
        updateNavigationState();
    }

    // Check if we need to reset cookies (user left the site)
    const lastVisit = getCookie('last_visit');
    const now = new Date().getTime();
    
    if (!lastVisit || (now - parseInt(lastVisit)) > 30 * 60 * 1000) { // 30 minutes
        // Reset all progress cookies
        deleteCookie('completed_techniques');
        deleteCookie('accessed_examples');
        deleteCookie('completed_quiz');
    }
    
    // Update last visit time
    setCookie('last_visit', now.toString());

    // Initialize navigation state
    updateNavigationState();

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
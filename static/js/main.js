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
}); 
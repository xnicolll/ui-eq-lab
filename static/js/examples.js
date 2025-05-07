document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const fileInput = document.getElementById('audio-file');
    const trackButtons = document.querySelectorAll('.track-btn');
    const eqControls = document.querySelectorAll('.eq-control');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const highPassSlider = document.getElementById('high-pass');
    const lowPassSlider = document.getElementById('low-pass');
    
    // Audio context and nodes
    let audioContext;
    let source;
    let gainNode;
    let filters = [];
    let highPassFilter;
    let lowPassFilter;
    let isAudioSetup = false;
    
    // Initialize audio context and nodes
    function initAudioContext() {
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            
            // Create high and low pass filters
            highPassFilter = audioContext.createBiquadFilter();
            highPassFilter.type = 'highpass';
            highPassFilter.frequency.value = 20;
            highPassFilter.Q.value = 1;
            
            lowPassFilter = audioContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.value = 20000;
            lowPassFilter.Q.value = 1;
            
            // Create EQ filters
            const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
            filters = [];
            frequencies.forEach(freq => {
                const filter = audioContext.createBiquadFilter();
                filter.type = 'peaking';
                filter.frequency.value = freq;
                filter.Q.value = 1;
                filter.gain.value = 0;
                filters.push(filter);
            });
            
            // Connect all filters in series
            highPassFilter.connect(lowPassFilter);
            filters.reduce((prev, curr) => {
                prev.connect(curr);
                return curr;
            }, lowPassFilter).connect(gainNode);
            
            gainNode.connect(audioContext.destination);
        }
    }
    
    // Handle track selection
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const track = this.dataset.track;
            const audioFile = track === 'tylerthecreator' ? 'tylerthecreator_normal_full.mp3' : 'fredagain_normal.mp3';
            
            // Initialize audio context if not already done
            if (!audioContext) {
                initAudioContext();
            }
            
            // Create new source node
            if (source) {
                source.disconnect();
            }
            source = audioContext.createMediaElementSource(audioPlayer);
            
            // Connect source to filter chain
            source.connect(highPassFilter);
            
            // Set audio source and play
            audioPlayer.src = `/static/audio/${audioFile}`;
            audioPlayer.load();
            audioPlayer.play();
        });
    });
    
    // Handle file upload
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            
            // Initialize audio context if not already done
            if (!audioContext) {
                initAudioContext();
            }
            
            // Create new source node
            if (source) {
                source.disconnect();
            }
            source = audioContext.createMediaElementSource(audioPlayer);
            
            // Connect source to filter chain
            source.connect(highPassFilter);
            
            // Set audio source and play
            audioPlayer.src = url;
            audioPlayer.load();
            audioPlayer.play();
        }
    });
    
    // Handle EQ controls
    eqControls.forEach((control, index) => {
        control.addEventListener('input', function() {
            if (filters[index]) {
                filters[index].gain.value = parseFloat(this.value);
            }
        });
    });
    
    // Handle presets
    const presets = {
        'flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'bass-boost': [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
        'treble-boost': [0, 0, 0, 0, 0, 0, 2, 4, 6, 6],
        'vocal': [0, 0, 0, 2, 4, 4, 2, 0, 0, 0]
    };
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const preset = presets[this.dataset.preset];
            eqControls.forEach((control, index) => {
                control.value = preset[index];
                if (filters[index]) {
                    filters[index].gain.value = preset[index];
                }
            });
        });
    });
    
    // Handle high pass filter
    highPassSlider.addEventListener('input', function() {
        if (highPassFilter) {
            highPassFilter.frequency.value = parseFloat(this.value);
            this.nextElementSibling.textContent = `${this.value} Hz`;
        }
    });
    
    // Handle low pass filter
    lowPassSlider.addEventListener('input', function() {
        if (lowPassFilter) {
            lowPassFilter.frequency.value = parseFloat(this.value);
            this.nextElementSibling.textContent = `${this.value} Hz`;
        }
    });
}); 
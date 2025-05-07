document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const fileInput = document.getElementById('audio-file');
    const trackButtons = document.querySelectorAll('.track-btn');
    const eqControls = document.querySelectorAll('.eq-control');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const highPassSlider = document.getElementById('high-pass');
    const lowPassSlider = document.getElementById('low-pass');
    
    let audioContext;
    let source;
    let gainNode;
    let filters = [];
    let highPassFilter;
    let lowPassFilter;
    let isAudioSetup = false;
    
    function initAudioContext() {
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            
            highPassFilter = audioContext.createBiquadFilter();
            highPassFilter.type = 'highpass';
            highPassFilter.frequency.value = 20;
            highPassFilter.Q.value = 1;
            
            lowPassFilter = audioContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.value = 20000;
            lowPassFilter.Q.value = 1;
            
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
            
            highPassFilter.connect(lowPassFilter);
            filters.reduce((prev, curr) => {
                prev.connect(curr);
                return curr;
            }, lowPassFilter).connect(gainNode);
            
            gainNode.connect(audioContext.destination);
            isAudioSetup = false;
        }
    }

    function setupAudioSource() {
        if (source) {
            source.disconnect();
        }
        
        source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(highPassFilter);
        isAudioSetup = true;
    }
    
    function changeTrack(trackUrl) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        
        audioPlayer.src = trackUrl;
        
        initAudioContext();
        
        if (!isAudioSetup) {
            setupAudioSource();
        }
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const track = this.dataset.track;
            const trackUrl = track === 'tylerthecreator' ? 
                '/static/audio/tylerthecreator_normal_full.mp3' : 
                `/static/audio/${track}_normal.mp3`;
            
            changeTrack(trackUrl);
        });
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            changeTrack(url);
        }
    });

    audioPlayer.addEventListener('play', function() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });

    highPassSlider.addEventListener('input', function() {
        const freq = parseInt(this.value);
        if (highPassFilter) {
            highPassFilter.frequency.value = freq;
        }
        this.nextElementSibling.textContent = `${freq} Hz`;
    });

    lowPassSlider.addEventListener('input', function() {
        const freq = parseInt(this.value);
        if (lowPassFilter) {
            lowPassFilter.frequency.value = freq;
        }
        this.nextElementSibling.textContent = `${freq} Hz`;
    });

    const presets = {
        flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'bass-boost': [6, 4, 2, 0, 0, 0, 0, 0, 0, 0],
        'treble-boost': [0, 0, 0, 0, 0, 0, 2, 4, 6, 6],
        vocal: [0, 0, 2, 4, 6, 4, 2, 0, 0, 0]
    };

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const preset = presets[this.dataset.preset];
            eqControls.forEach((control, index) => {
                control.value = preset[index];
                control.dispatchEvent(new Event('input'));
            });
        });
    });

    eqControls.forEach((control, index) => {
        control.addEventListener('input', function() {
            const gain = parseFloat(this.value);
            if (filters[index]) {
                filters[index].gain.value = gain;
            }
        });
    });
}); 
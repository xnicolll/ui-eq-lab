document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.querySelector('.next-btn');
    const quizData = document.getElementById('quiz-data').dataset;
    const questionId = parseInt(quizData.questionId);
    const correctAnswer = quizData.correctAnswer;
    const correctThreshold = parseFloat(quizData.correctThreshold);
    const modal = document.getElementById('exitConfirmModal');
    const cancelBtn = document.getElementById('cancel-exit');
    const confirmBtn = document.getElementById('confirm-exit');
    let destinationUrl = null;

    if (document.querySelector('.eq-control')) {
        const sliders = document.querySelectorAll('.eq-control');
        const resetButton = document.querySelector('.reset-btn');
        
        resetButton.addEventListener('click', function() {
            sliders.forEach(slider => {
                slider.value = 0;
            });
        });
        
        nextButton.addEventListener('click', function() {
            const sliderValues = Array.from(sliders).map(slider => ({
                frequency: parseInt(slider.dataset.frequency),
                value: parseFloat(slider.value)
            }));
            
            const sliderValuesArray = sliderValues.map(sv => sv.value);
            
            const isCorrect = sliderValues.every(slider => {
                if (slider.frequency > 1000) {
                    return slider.value <= correctThreshold;
                }
                return true;
            });
            
            fetch('/store_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question_id: questionId,
                    answer_value: sliderValuesArray,
                    is_correct: isCorrect
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Answer stored:', data);
                if (questionId === 5) {
                    window.location.href = '/results';
                } else {
                    window.location.href = `/quiz/${questionId + 1}`;
                }
            })
            .catch(error => console.error('Error:', error));
        });
    } else {
        const playButtons = document.querySelectorAll('.play-button');
        let currentAudio = null;

        playButtons.forEach(button => {
            const audioUrl = button.dataset.audio;
            const audio = new Audio(audioUrl);
            
            button.addEventListener('click', function() {
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio.playButton.classList.remove('playing');
                }
                
                if (audio.paused) {
                    audio.play();
                    button.classList.add('playing');
                    currentAudio = audio;
                    currentAudio.playButton = button;
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    button.classList.remove('playing');
                    currentAudio = null;
                }
            });

            audio.addEventListener('ended', function() {
                button.classList.remove('playing');
                currentAudio = null;
            });
        });

        const options = document.querySelectorAll('.option input');
        
        options.forEach(option => {
            option.addEventListener('change', function() {
                nextButton.disabled = false;
            });
        });

        nextButton.addEventListener('click', function() {
            const selectedAnswer = document.querySelector(`input[name="q${questionId}"]:checked`);
            if (selectedAnswer) {
                fetch('/store_answer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question_id: questionId,
                        answer_value: selectedAnswer.value,
                        is_correct: selectedAnswer.value === correctAnswer
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Answer stored:', data);
                    if (questionId === 5) {
                        window.location.href = '/results';
                    } else {
                        window.location.href = `/quiz/${questionId + 1}`;
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.href.includes('/quiz')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                destinationUrl = this.href;
                modal.style.display = 'flex';
            });
        }
    });

    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        destinationUrl = null;
    });

    confirmBtn.addEventListener('click', function() {
        if (destinationUrl) {
            window.location.href = destinationUrl;
        } else {
            window.history.back();
        }
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            destinationUrl = null;
        }
    });
}); 
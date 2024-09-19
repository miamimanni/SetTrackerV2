// Variables for timers and state
let timerInterval;
let timerRunning = false;
let completedSets = 0;
let currentSet = 1;
let milliseconds = 0, seconds = 0, minutes = 0;
let startTime, lastUpdateTime = 0;
let beepPlayed15 = false;
let beepPlayed30 = false;
let beepPlayed45 = false;
let beepPlayed59 = false;

// Variables for audio
let audioContext;
let gainNode;
let dingBuffer;

// DOM elements
const display = document.getElementById('display');
const enableSoundCheckbox = document.getElementById('enableSound');
const volumeControl = document.getElementById('volumeControl'); // Assuming you added this in your HTML

const completedSetsDisplay = document.getElementById('completedSets');
const currentSetDisplay = document.getElementById('currentSet');
const startContainer = document.getElementById('startContainer');
const startExerciseButton = document.getElementById('startExercise');
const workoutContainer = document.getElementById('workoutContainer');
const startRestButton = document.getElementById('startRest');
const pauseButton = document.getElementById('pause');
const resumeRestButton = document.getElementById('resumeRest');
const startNextSetButton = document.getElementById('startNextSet');
const startOverButton = document.getElementById('startOver');
const decrementCompletedSetsButton = document.getElementById('decrementCompletedSets');
const incrementCompletedSetsButton = document.getElementById('incrementCompletedSets');
const resetCompletedSetsButton = document.getElementById('resetCompletedSets');
const decrementCurrentSetButton = document.getElementById('decrementCurrentSet');
const incrementCurrentSetButton = document.getElementById('incrementCurrentSet');
const resetCurrentSetButton = document.getElementById('resetCurrentSet');
const currentSetsContainer  = document.getElementById('currentSetsContainer');

// Function to initialize the audio context and gain node
function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // Set initial volume to half
        gainNode.connect(audioContext.destination);
    }
}

// Function to load the ding sound into a buffer
function loadDingSound() {
    const request = new XMLHttpRequest();
    request.open('GET', 'ding.mp3', true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            dingBuffer = buffer;
        }, function(error) {
            console.error('Error decoding audio data:', error);
            logError(error, 'loadDingSound');
        });
    };

    request.onerror = function(error) {
        console.error('Error loading audio file:', error);
        logError(error, 'loadDingSound');
    };

    request.send();
}

// Function to play the ding sound
function playDingSound() {
    if (!enableSoundCheckbox.checked || !dingBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = dingBuffer;
    source.connect(gainNode);
    source.start(0);
}

// Function to play the beep sequence at 59 seconds
function playBeepSequence() {
    playDingSound();  // Play the first beep immediately

    // Use setTimeout to delay the next two beeps
    setTimeout(() => {
        playDingSound();  // Play the second beep after 300ms
    }, 300);

    setTimeout(() => {
        playDingSound();  // Play the third beep after 600ms
    }, 600);
}

// Update display with elapsed time
function updateTimeDisplay() {
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
    display.textContent = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

// Start the stopwatch and record the start time
function startStopwatch() {
    startTime = Date.now() - lastUpdateTime;  // Adjust in case we resumed
    timerInterval = setInterval(() => {
        updateElapsedTime();
    }, 10);
    timerRunning = true;
}

// Stop the stopwatch
function stopStopwatch() {
    clearInterval(timerInterval);
    lastUpdateTime = Date.now() - startTime;  // Save how much time passed
    timerRunning = false;
}

// Update the elapsed time based on the system clock
function updateElapsedTime() {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;

    minutes = Math.floor(timeDifference / 60000);
    seconds = Math.floor((timeDifference % 60000) / 1000);
    milliseconds = timeDifference % 1000;

    // Play beep at specific seconds, but only once per minute
    if (seconds === 15 && !beepPlayed15) {
        playDingSound();
        beepPlayed15 = true;
    }
    if (seconds === 30 && !beepPlayed30) {
        playDingSound();
        beepPlayed30 = true;
    }
    if (seconds === 45 && !beepPlayed45) {
        playDingSound();
        beepPlayed45 = true;
    }
    if (seconds === 59 && !beepPlayed59) {
        playBeepSequence();
        beepPlayed59 = true;
    }

    // Reset beep flags when the new minute starts
    if (seconds === 0) {
        beepPlayed15 = false;
        beepPlayed30 = false;
        beepPlayed45 = false;
        beepPlayed59 = false;
    }

    updateTimeDisplay();
}

function updateCompletedSetsDisplay() {
    completedSetsDisplay.textContent = completedSets;
}

function updateCurrentSetDisplay() {
    currentSetDisplay.textContent = currentSet;
}

// Start and pause/resume functionality
function startRest() {
    startStopwatch();
    completedSets++;
    updateCompletedSetsDisplay();
    startRestButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    startNextSetButton.style.display = 'inline-block';
    currentSetsContainer.style.display = 'none';
}

function pauseRest() {
    stopStopwatch();
    pauseButton.style.display = 'none';
    resumeRestButton.style.display = 'inline-block';
}

function resumeRest() {
    startStopwatch();
    resumeRestButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
}

function startNextSet() {
    stopStopwatch();
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    lastUpdateTime = 0; // Reset lastUpdateTime
    updateTimeDisplay();
    currentSet++;
    updateCurrentSetDisplay();
    startRestButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    resumeRestButton.style.display = 'none';
    startNextSetButton.style.display = 'none';
    currentSetsContainer.style.display = 'inline-block';
}

// Set controls
function decrementCompletedSets() {
    if (completedSets > 0) {
        completedSets--;
        updateCompletedSetsDisplay();
    }
}

function incrementCompletedSets() {
    completedSets++;
    updateCompletedSetsDisplay();
}

function resetCompletedSets() {
    completedSets = 0;
    updateCompletedSetsDisplay();
}

function decrementCurrentSet() {
    if (currentSet > 1) {
        currentSet--;
        updateCurrentSetDisplay();
    }
}

function incrementCurrentSet() {
    currentSet++;
    updateCurrentSetDisplay();
}

function resetCurrentSet() {
    currentSet = 1;
    updateCurrentSetDisplay();
}

// General start/stop
function startExercise() {
    startContainer.style.display = 'none';
    workoutContainer.style.display = 'block';
    startRestButton.style.display = 'inline-block';

    // Initialize audio context and load sounds
    initializeAudioContext();
    loadDingSound();
}

// Function to start over
function startOver() {
    stopStopwatch();
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    lastUpdateTime = 0; // Reset lastUpdateTime
    completedSets = 0;
    currentSet = 1;
    updateTimeDisplay();
    updateCompletedSetsDisplay();
    updateCurrentSetDisplay();
    startContainer.style.display = 'inline-block';
    workoutContainer.style.display = 'none';
    startRestButton.style.display = 'none';
    pauseButton.style.display = 'none';
    resumeRestButton.style.display = 'none';
    startNextSetButton.style.display = 'none';
    currentSetsContainer.style.display = 'inline-block';

    // Reset beep flags
    beepPlayed15 = false;
    beepPlayed30 = false;
    beepPlayed45 = false;
    beepPlayed59 = false;

    // Clear error messages
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.innerHTML = '';
    }
}

// Function to log errors to the DOM with stack trace
function logError(error, context) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error in ' + context + ': ' + error.message;

        const errorStack = document.createElement('pre');
        errorStack.textContent = error.stack;

        errorContainer.appendChild(errorMessage);
        errorContainer.appendChild(errorStack);
    }
}

// Event listeners
startExerciseButton.addEventListener('click', function() {
    startExercise();
});

// Resume AudioContext on user interaction (for autoplay policy)
document.addEventListener('click', function() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

startRestButton.addEventListener('click', startRest);
pauseButton.addEventListener('click', pauseRest);
resumeRestButton.addEventListener('click', resumeRest);
startNextSetButton.addEventListener('click', startNextSet);
startOverButton.addEventListener('click', startOver);
decrementCompletedSetsButton.addEventListener('click', decrementCompletedSets);
incrementCompletedSetsButton.addEventListener('click', incrementCompletedSets);
resetCompletedSetsButton.addEventListener('click', resetCompletedSets);
decrementCurrentSetButton.addEventListener('click', decrementCurrentSet);
incrementCurrentSetButton.addEventListener('click', incrementCurrentSet);
resetCurrentSetButton.addEventListener('click', resetCurrentSet);

// Volume control event listener (if you have a volume slider)
if (volumeControl) {
    volumeControl.addEventListener('input', function() {
        const volume = parseFloat(this.value);
        if (gainNode) {
            gainNode.gain.value = volume;
        }
    });
}

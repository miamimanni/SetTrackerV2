let timerInterval;
let timerRunning = false;
let completedSets = 0;
let currentSet = 1;
let milliseconds = 0, seconds = 0, minutes = 0;
let startTime, lastUpdateTime = 0;
let beepPlayed15 = false;  // Flag to ensure beep is played only once per minute
let beepPlayed30 = false;  // Flag to ensure beep is played only once per minute
let beepPlayed45 = false;  // Flag to ensure beep is played only once per minute
let beepPlayed59 = false;  // Flag to ensure beep is played only once per minute
let dingSound1;
let dingSound2;
let dingSound3;

const display = document.getElementById('display');
const enableSoundCheckbox = document.getElementById('enableSound'); // New checkbox element

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

// Update display with elapsed time
function updateTimeDisplay() {
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
    display.textContent = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

// Play system beep using AudioContext API
function playSystemBeep1() {
    if (!enableSoundCheckbox.checked) return;
    dingSound1.play();
}
function playSystemBeep2() {
    if (!enableSoundCheckbox.checked) return;
    dingSound2.play();
}
function playSystemBeep3() {
    if (!enableSoundCheckbox.checked) return;
    dingSound3.play();
}

function playBeepSequence() {
    playSystemBeep1();  // Play the first beep immediately

    // Use setTimeout to delay the next two beeps
    setTimeout(() => {
        playSystemBeep2();  // Play the second beep after 300ms
    }, 300);

    setTimeout(() => {
        playSystemBeep3();  // Play the third beep after 600ms
    }, 600);
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

    // Play beep at 59 seconds, but only once per minute
    if (seconds === 15 && !beepPlayed15) {
        playSystemBeep1();
        beepPlayed15 = true;  // Ensure beep is only played once for this minute
    }
    if (seconds === 30 && !beepPlayed30) {
        playSystemBeep1();
        beepPlayed30 = true;  // Ensure beep is only played once for this minute
    }
    if (seconds === 45 && !beepPlayed45) {
        playSystemBeep1();
        beepPlayed45 = true;  // Ensure beep is only played once for this minute
    }
    if (seconds === 59 && !beepPlayed59) {
        playBeepSequence();
        beepPlayed59 = true;  // Ensure beep is only played once for this minute
    }

    // Reset beep flag when the new minute starts
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
    lastUpdateTime = 0;  // Reset lastUpdateTime to zero
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
}

function startOver() {
    stopStopwatch();
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    completedSets = 0;
    currentSet = 1;
    lastUpdateTime = 0;  // Reset lastUpdateTime to zero
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
}

function initializeSounds(){
    dingSound1 = new Audio('ding.mp3');
    dingSound2 = new Audio('ding.mp3');
    dingSound3 = new Audio('ding.mp3');
}

// Event listeners
startExerciseButton.addEventListener('click', function() {
    initializeSounds();
    startExercise();
});
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

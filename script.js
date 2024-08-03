let timerInterval;
let timerRunning = false;
let completedSets = 0;
let currentSet = 1;
let milliseconds = 0, seconds = 0, minutes = 0;

const display = document.getElementById('display');
const completedSetsDisplay = document.getElementById('completedSets');
const currentSetDisplay = document.getElementById('currentSet');
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

function updateTimeDisplay() {
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
    display.textContent = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function updateCompletedSetsDisplay() {
    completedSetsDisplay.textContent = completedSets;
}

function updateCurrentSetDisplay() {
    currentSetDisplay.textContent = currentSet;
}

function startStopwatch() {
    timerInterval = setInterval(() => {
        milliseconds += 10;
        if (milliseconds === 1000) {
            milliseconds = 0;
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
        }
        updateTimeDisplay();
    }, 10);
    timerRunning = true;
}

function stopStopwatch() {
    clearInterval(timerInterval);
    timerRunning = false;
}

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
    updateTimeDisplay();
    currentSet++;
    updateCurrentSetDisplay();
    startRestButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    resumeRestButton.style.display = 'none';
    startNextSetButton.style.display = 'none';
    currentSetsContainer.style.display = 'inline-block';
}

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

function startExercise() {
    startExerciseButton.style.display = 'none';
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
    updateTimeDisplay();
    updateCompletedSetsDisplay();
    updateCurrentSetDisplay();
    startExerciseButton.style.display = 'inline-block';
    workoutContainer.style.display = 'none';
    startRestButton.style.display = 'none';
    pauseButton.style.display = 'none';
    resumeRestButton.style.display = 'none';
    startNextSetButton.style.display = 'none';
}

startExerciseButton.addEventListener('click', startExercise);
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

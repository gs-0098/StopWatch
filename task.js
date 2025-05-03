const timeDisplay = document.querySelector('.time-display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
const lapsList = document.getElementById('laps-list');

let startTime = null;
let elapsedTime = 0;
let timerInterval = null;
let laps = JSON.parse(localStorage.getItem('laps')) || [];

function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  if (startTime) {
    const currentTime = Date.now();
    const delta = elapsedTime + (currentTime - startTime);
    timeDisplay.textContent = formatTime(delta);
  }
}

function startTimer() {
  if (!timerInterval) {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
  }
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime += Date.now() - startTime;
    startTime = null;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  elapsedTime = 0;
  timeDisplay.textContent = '00:00.000'; // Correct format
  laps = [];
  localStorage.setItem('laps', JSON.stringify(laps));
  lapsList.innerHTML = ''; // Clear laps directly
}

function recordLap() {
  if (startTime || elapsedTime > 0) { // Record laps only when the timer is running or paused
    const currentTime = Date.now();
    const lapTime = elapsedTime + (startTime ? currentTime - startTime : 0);
    laps.push(formatTime(lapTime));
    localStorage.setItem('laps', JSON.stringify(laps));
    renderLaps();
  } else {
    alert('Start the timer to record a lap.');
  }
}

function renderLaps() {
  lapsList.innerHTML = laps.map(lap => `<li>${lap}</li>`).join('');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', recordLap);
toggleDarkModeButton.addEventListener('click', toggleDarkMode);

// Initialize laps display on page load
renderLaps();

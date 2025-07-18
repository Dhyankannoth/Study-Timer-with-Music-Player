


let timer = null;
let totalSeconds = 0;
let isRunning = false;
let startTime = null;
let pausedTime = 0;

const display = document.getElementById("timer-display");
const hourInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const subjectInput = document.getElementById("subject-input");
const chapterInput = document.getElementById("chapter-input");
const notesInput = document.getElementById("notes-input");
const saveLogBtn = document.getElementById("save-log-btn");
const logList = document.getElementById("log-list");

document.getElementById("start-btn").addEventListener('click', startTimer);
document.getElementById("pause-btn").addEventListener('click', pauseTimer);
document.getElementById("reset-btn").addEventListener('click', resetTimer);
document.getElementById("save-log-btn").addEventListener('click', saveLog);

let studyLogs = JSON.parse(localStorage.getItem('studyLogs')) || [];
renderLogs();

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    display.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const alarmSound = document.getElementById("alarm-sound");

function startTimer() {
    if (isRunning) return;
    
    // If this is a fresh start (not resuming)
    if (pausedTime === 0) {
        const hour = parseInt(hourInput.value) || 0;
        const min = parseInt(minutesInput.value) || 0;
        const sec = parseInt(secondsInput.value) || 0;
        totalSeconds = hour * 3600 + min * 60 + sec;
        
        if (totalSeconds <= 0) {
            alert("Please enter a valid time");
            return;
        }
        
        startTime = new Date();
        
        // Warm up the alarm sound
        alarmSound.play().then(() => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }).catch(e => console.log("Audio warmup failed:", e));
    } else {
        totalSeconds = pausedTime;
        pausedTime = 0;
    }
    
    updateDisplay();
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            alarmSound.play().catch(error => {
                console.error("Audio playback failed:", error);
                alert("Time's up!");
            });
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(timer);
    isRunning = false;
    pausedTime = totalSeconds;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = "▶";
}

function resetTimer() {
    clearInterval(timer);
    totalSeconds = 0;
    pausedTime = 0;
    isRunning = false;
    startTime = null;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = "▶";
    
    // Clear inputs
    hourInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
}

function saveLog() {
    if (!startTime) {
        alert("Please start the timer first!");
        return;
    }
    
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000) - pausedTime;
    
    const hours = Math.floor(durationInSeconds / 3600);
    const mins = Math.floor((durationInSeconds % 3600) / 60);
    const secs = durationInSeconds % 60;
    
    const durationFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    const logEntry = {
        date: endTime.toLocaleString(),
        subject: subjectInput.value || "Not specified",
        chapter: chapterInput.value || "Not specified",
        notes: notesInput.value || "No notes",
        duration: durationFormatted,
        durationSeconds: durationInSeconds
    };
    
    studyLogs.push(logEntry);
    localStorage.setItem('studyLogs', JSON.stringify(studyLogs));
    
    subjectInput.value = '';
    chapterInput.value = '';
    notesInput.value = '';
    
    renderLogs();
    alert("Study session saved!");
}

function renderLogs() {
    logList.innerHTML = '';
    
    if (studyLogs.length === 0) {
        logList.innerHTML = '<p>No study sessions logged yet.</p>';
        return;
    }
    

    studyLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    studyLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <h4>${log.subject} - ${log.chapter}</h4>
            <p><strong>Date:</strong> ${log.date}</p>
            <p><strong>Duration:</strong> ${log.duration}</p>
            <p><strong>Notes:</strong> ${log.notes}</p>
        `;
        logList.appendChild(logEntry);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const toggleMusicBtn = document.getElementById('toggle-music');
    const spotifySidebar = document.querySelector('.spotify-sidebar');
    
    toggleMusicBtn.addEventListener('click', function() {
        spotifySidebar.classList.toggle('sidebar-hidden');
        
        if (spotifySidebar.classList.contains('sidebar-hidden')) {
            toggleMusicBtn.textContent = 'Show Music';
        } else {
            toggleMusicBtn.textContent = 'Hide Music';
        }
    });
});


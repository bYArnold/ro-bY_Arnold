// Power Meter Application
// Core functionality and UI interactions

// DOM Elements
const progressBar = document.getElementById('progressBar');
const powerValue = document.getElementById('powerValue');
const criticalAlert = document.getElementById('criticalAlert');
const sensitivityButton = document.getElementById('sensitivityButton');
const sensitivityValueDisplay = document.getElementById('sensitivityValue');
const segmentsContainer = document.getElementById('segmentsContainer');
const powerMeter = document.getElementById('powerMeter');
const lowEmoji = document.getElementById('lowEmoji');
const highEmoji = document.getElementById('highEmoji');

// State variables
let power = 0;
let isPressed = false;
let sensitivity = 1.0;
let animationFrame;
let isShaking = false;
let alarmSound;

// Check if Howler is available and initialize sound
if (typeof Howl !== 'undefined') {
    alarmSound = new Howl({
        src: ['sound.mp3'],
        loop: true,
        volume: 0.8
    });
}

// Create segments for the progress bar
function createSegments() {
    // Clear existing segments
    segmentsContainer.innerHTML = '';
    
    // Create 15 segments with increasing sizes
    for (let i = 0; i < 15; i++) {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.flex = (0.6 + (i * 0.14)).toString();
        segmentsContainer.appendChild(segment);
    }
}

// Initialize segments
createSegments();

// Update the progress bar with dynamic color based on power level
function updateProgressBarColor() {
    const segments = segmentsContainer.children;
    const activeSegments = Math.floor((power / 100) * segments.length);
    
    for (let i = 0; i < segments.length; i++) {
        if (i < activeSegments) {
            if (power < 30) {
                segments[i].style.background = 'linear-gradient(90deg, rgba(0, 122, 255, 0.8), rgba(96, 165, 250, 0.8))';
                segments[i].style.boxShadow = '0 0 10px rgba(0, 122, 255, 0.4)';
            } else if (power < 60) {
                segments[i].style.background = 'linear-gradient(90deg, rgba(255, 149, 0, 0.8), rgba(255, 179, 64, 0.8))';
                segments[i].style.boxShadow = '0 0 10px rgba(255, 149, 0, 0.4)';
            } else {
                segments[i].style.background = 'linear-gradient(90deg, rgba(255, 59, 48, 0.8), rgba(255, 89, 78, 0.8))';
                segments[i].style.boxShadow = '0 0 10px rgba(255, 59, 48, 0.4)';
            }
        } else {
            segments[i].style.background = 'transparent';
            segments[i].style.boxShadow = 'none';
        }
    }
}

// Update emoji expressions based on power level
function updateEmojis() {
    if (power < 30) {
        lowEmoji.textContent = '😌';
        highEmoji.textContent = '💀';
    } else if (power < 60) {
        lowEmoji.textContent = '😐';
        highEmoji.textContent = '💀';
    } else if (power < 85) {
        lowEmoji.textContent = '😠';
        highEmoji.textContent = '💀';
    } else {
        lowEmoji.textContent = '😡';
        highEmoji.textContent = '💀';
    }
}

// Add shake effect to the meter when at critical levels
function updateShakeEffect() {
    if (power === 100 && !isShaking) {
        powerMeter.classList.add('shaking');
        isShaking = true;
        setTimeout(() => {
            powerMeter.classList.remove('shaking');
            isShaking = false;
            if (power === 100) {
                updateShakeEffect();
            }
        }, 500);
    }
}

// Update power level and UI
function updatePower() {
    if (isPressed) {
        power = Math.min(power + (0.5 * sensitivity), 100);
    } else if (!isPressed && power > 0) {
        power = Math.max(power - 0.8, 0);
    }
    
    // Update progress bar
    updateProgressBarColor();
    
    // Update emojis
    updateEmojis();
    
    // Update power value display
    powerValue.textContent = Math.floor(power);
    
    // Update power value color based on power level
    if (power >= 60) {
        powerValue.classList.add('warning');
    } else {
        powerValue.classList.remove('warning');
    }
    
    // Show/hide critical alert and play sound
    if (power === 100) {
        criticalAlert.classList.add('visible');
        updateShakeEffect();
        
        if (alarmSound && !alarmSound.playing()) {
            alarmSound.play();
        }
    } else {
        criticalAlert.classList.remove('visible');
        
        if (alarmSound && alarmSound.playing()) {
            alarmSound.stop();
        }
    }

    animationFrame = requestAnimationFrame(updatePower);
}

// Start measuring power
function startPower() {
    isPressed = true;
    if (!animationFrame) {
        animationFrame = requestAnimationFrame(updatePower);
    }
}

// Stop measuring power
function stopPower() {
    isPressed = false;
}

// Toggle sensitivity level
function toggleSensitivity() {
    if (sensitivity === 1.0) {
        sensitivity = 1.5;
    } else if (sensitivity === 1.5) {
        sensitivity = 2.0;
    } else {
        sensitivity = 1.0;
    }
    
    sensitivityValueDisplay.textContent = sensitivity.toFixed(1);
}

// Event listeners
if (sensitivityButton) {
    sensitivityButton.addEventListener('click', toggleSensitivity);
}

// Add event listeners only on potuzno page
if (document.querySelector('.potuzno-page')) {
    document.addEventListener('mousedown', startPower);
    document.addEventListener('mouseup', stopPower);
    document.addEventListener('touchstart', startPower);
    document.addEventListener('touchend', stopPower);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Initialize the application
    animationFrame = requestAnimationFrame(updatePower);
}

// Update theme for potuzhnometr
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateProgressBarColor();
        });
    }
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
});
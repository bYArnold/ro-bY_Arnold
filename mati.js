// Password protection for censored content
document.addEventListener('DOMContentLoaded', function() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');
    const matiContent = document.getElementById('matiContent');
    
    // Set correct password
    const correctPassword = '11223344';
    
    // Check if password is already stored in localStorage
    const isAuthenticated = localStorage.getItem('matiAccess') === 'true';
    
    if (isAuthenticated) {
        // Already authenticated, show content
        passwordOverlay.classList.add('hidden');
        matiContent.classList.remove('hidden');
    } else {
        // Not authenticated, show password screen
        passwordOverlay.classList.remove('hidden');
        matiContent.classList.add('hidden');
        
        // Focus on input
        if (passwordInput) {
            passwordInput.focus();
        }
    }
    
    // Password submit event
    if (passwordSubmit) {
        passwordSubmit.addEventListener('click', checkPassword);
    }
    
    // Enter key in password field
    if (passwordInput) {
        passwordInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Password checking function
    function checkPassword() {
        const password = passwordInput.value;
        
        if (password === correctPassword) {
            // Correct password
            localStorage.setItem('matiAccess', 'true');
            passwordOverlay.classList.add('hidden');
            matiContent.classList.remove('hidden');
        } else {
            // Wrong password
            passwordError.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
            passwordInput.focus();
            
            // Shake effect
            passwordInput.classList.add('shake');
            setTimeout(() => {
                passwordInput.classList.remove('shake');
            }, 500);
        }
    }
});
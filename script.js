document.addEventListener('DOMContentLoaded', () => {
    const TARGET_CODE = '0740';
    const REDIRECT_URL = 'https://www.canva.com/design/DAHD1icEOHE/V08JqtOzXrWz09-cCpQsZw/edit?utm_content=DAHD1icEOHE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton';
    
    let currentCode = '';
    
    const digits = document.querySelectorAll('.digit');
    const keys = document.querySelectorAll('.key[data-value]');
    const btnClear = document.getElementById('btn-clear');
    const btnEnter = document.getElementById('btn-enter');
    const safePanel = document.getElementById('safe-panel');
    const statusLight = document.getElementById('status-light');
    const statusText = document.getElementById('status-text');
    
    // Add click sounds setup if we wanted, but we'll stick to visual feedback
    
    // Update display based on current code
    function updateDisplay() {
        digits.forEach((digitElem, index) => {
            if (index < currentCode.length) {
                digitElem.textContent = '•'; // Use bullets for privacy, or show number: currentCode[index]
                digitElem.classList.remove('empty');
                // Small pop animation
                digitElem.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    digitElem.style.transform = 'scale(1)';
                }, 100);
            } else {
                digitElem.textContent = '_';
                digitElem.classList.add('empty');
            }
        });
    }
    
    // Handle number input
    function handleInput(value) {
        if (currentCode.length < 4) {
            currentCode += value;
            updateDisplay();
            
            // Auto check if we reach 4 digits
            if (currentCode.length === 4) {
                setTimeout(checkCode, 200);
            }
        }
    }
    
    // Check if the code is correct
    function checkCode() {
        if (currentCode === TARGET_CODE) {
            // Success
            statusLight.classList.add('success-state');
            statusText.classList.add('success-state');
            statusText.textContent = 'ACESSO CONCEDIDO';
            
            safePanel.classList.add('success');
            
            // Vibrate if supported
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Redirect after animation
            setTimeout(() => {
                safePanel.classList.add('unlocking');
                setTimeout(() => {
                    window.location.href = REDIRECT_URL;
                }, 800);
            }, 1000);
            
        } else {
            // Error
            safePanel.classList.add('error');
            
            if (navigator.vibrate) {
                navigator.vibrate([300]);
            }
            
            // Remove error class after animation completes
            setTimeout(() => {
                safePanel.classList.remove('error');
                clearCode();
            }, 600);
        }
    }
    
    // Clear code
    function clearCode() {
        currentCode = '';
        updateDisplay();
    }
    
    // Event listeners for keys
    keys.forEach(key => {
        key.addEventListener('click', () => {
            handleInput(key.dataset.value);
        });
    });
    
    btnClear.addEventListener('click', clearCode);
    
    btnEnter.addEventListener('click', () => {
        if (currentCode.length === 4) {
            checkCode();
        } else if (currentCode.length > 0) {
            // Shake if they press enter before 4 digits
            safePanel.classList.add('error');
            setTimeout(() => {
                safePanel.classList.remove('error');
            }, 600);
        }
    });
    
    // Keyboard support for iPad pro keyboard or desktop
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            handleInput(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (currentCode.length > 0) {
                currentCode = currentCode.slice(0, -1);
                updateDisplay();
            }
        } else if (e.key === 'Enter') {
            if (currentCode.length === 4) {
                checkCode();
            }
        } else if (e.key === 'Escape') {
            clearCode();
        }
    });
});

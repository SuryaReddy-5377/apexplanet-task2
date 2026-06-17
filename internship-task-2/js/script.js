// ===== Dark Mode Toggle =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateToggleIcon(true);
    }
    
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateToggleIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateToggleIcon(true);
        }
    });
    
    function updateToggleIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
});

// ===== Form Validation =====
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showToast('Login successful! Welcome back! 🎉', 'success');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // ✅ Clear form fields after successful login
                    document.getElementById('loginEmail').value = '';
                    document.getElementById('loginPassword').value = '';
                    document.getElementById('loginEmail').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('loginPassword').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('rememberMe').checked = false;
                    
                }, 1500);
            }
        });
    }
    
    // Registration Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (password && confirmPassword) {
            password.addEventListener('input', function() {
                checkPasswordMatch();
                checkPasswordStrength(this.value);
            });
            confirmPassword.addEventListener('input', checkPasswordMatch);
            
            const emailInput = document.getElementById('registerEmail');
            if (emailInput) {
                emailInput.addEventListener('blur', function() {
                    checkEmailAvailability(this.value);
                });
            }
        }
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateRegisterForm()) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating account...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showToast('Registration successful! Welcome to ApexPlanet! 🚀', 'success');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // ✅ Clear form fields after successful registration
                    document.getElementById('firstName').value = '';
                    document.getElementById('lastName').value = '';
                    document.getElementById('registerEmail').value = '';
                    document.getElementById('registerPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                    document.getElementById('termsCheck').checked = false;
                    
                    document.getElementById('firstName').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('lastName').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('registerEmail').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('registerPassword').classList.remove('is-valid', 'is-invalid');
                    document.getElementById('confirmPassword').classList.remove('is-valid', 'is-invalid');
                    
                    document.getElementById('passwordMatch').innerHTML = '';
                    document.getElementById('passwordStrength').innerHTML = '';
                    document.getElementById('emailStatus').innerHTML = '';
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1500);
            }
        });
    }
});

// ===== Validation Functions =====
function validateLoginForm() {
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    let isValid = true;
    
    email.classList.remove('is-invalid', 'is-valid');
    password.classList.remove('is-invalid', 'is-valid');
    
    if (!email.value || !isValidEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.add('is-valid');
    }
    
    if (!password.value || password.value.length < 6) {
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        password.classList.add('is-valid');
    }
    
    return isValid;
}

function validateRegisterForm() {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('termsCheck');
    let isValid = true;
    
    [firstName, lastName, email, password, confirmPassword].forEach(el => {
        if (el) el.classList.remove('is-invalid', 'is-valid');
    });
    
    if (!firstName.value || firstName.value.length < 2) {
        firstName.classList.add('is-invalid');
        isValid = false;
    } else {
        firstName.classList.add('is-valid');
    }
    
    if (!lastName.value || lastName.value.length < 2) {
        lastName.classList.add('is-invalid');
        isValid = false;
    } else {
        lastName.classList.add('is-valid');
    }
    
    if (!email.value || !isValidEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.add('is-valid');
    }
    
    if (!password.value || password.value.length < 6) {
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        password.classList.add('is-valid');
    }
    
    if (!confirmPassword.value || confirmPassword.value !== password.value) {
        confirmPassword.classList.add('is-invalid');
        isValid = false;
    } else {
        confirmPassword.classList.add('is-valid');
    }
    
    if (!terms.checked) {
        terms.classList.add('is-invalid');
        isValid = false;
    } else {
        terms.classList.remove('is-invalid');
    }
    
    return isValid;
}

// ===== Password Match Check =====
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const matchMessage = document.getElementById('passwordMatch');
    
    if (!password || !confirmPassword || !matchMessage) return;
    
    if (confirmPassword.value.length > 0) {
        if (password.value === confirmPassword.value) {
            matchMessage.innerHTML = '<i class="fas fa-check-circle text-success me-1"></i> Passwords match! ✓';
            matchMessage.className = 'form-text text-success';
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
        } else {
            matchMessage.innerHTML = '<i class="fas fa-exclamation-circle text-danger me-1"></i> Passwords do not match! ✗';
            matchMessage.className = 'form-text text-danger';
            confirmPassword.classList.add('is-invalid');
            confirmPassword.classList.remove('is-valid');
        }
    } else {
        matchMessage.innerHTML = '';
        confirmPassword.classList.remove('is-invalid', 'is-valid');
    }
}

// ===== Password Strength =====
function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    if (!strengthDiv) return;
    
    if (password.length === 0) {
        strengthDiv.innerHTML = '';
        return;
    }
    
    let strength = 0;
    let message = '';
    let color = '';
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            message = 'Weak';
            color = '#dc3545';
            break;
        case 2:
            message = 'Fair';
            color = '#ffc107';
            break;
        case 3:
            message = 'Good';
            color = '#17a2b8';
            break;
        case 4:
            message = 'Strong';
            color = '#10B981';
            break;
        case 5:
            message = 'Very Strong';
            color = '#10B981';
            break;
    }
    
    const width = (strength / 5) * 100;
    strengthDiv.innerHTML = `
        <div style="background: var(--border-color); height: 4px; border-radius: 4px; margin-top: 5px;">
            <div style="background: ${color}; height: 4px; border-radius: 4px; width: ${width}%; transition: width 0.3s ease;"></div>
        </div>
        <small style="color: ${color}; font-weight: 600;">${message}</small>
    `;
}

// ===== Email Availability (AJAX Simulation) =====
function checkEmailAvailability(email) {
    if (!email || !isValidEmail(email)) return;
    
    const statusDiv = document.getElementById('emailStatus');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Checking availability...';
    statusDiv.className = 'form-text text-muted';
    
    setTimeout(() => {
        const takenEmails = ['test@example.com', 'demo@example.com', 'admin@example.com'];
        
        if (takenEmails.includes(email.toLowerCase())) {
            statusDiv.innerHTML = '<i class="fas fa-times-circle text-danger me-1"></i> Email already taken!';
            statusDiv.className = 'form-text text-danger';
            document.getElementById('registerEmail').classList.add('is-invalid');
        } else {
            statusDiv.innerHTML = '<i class="fas fa-check-circle text-success me-1"></i> Email available! ✓';
            statusDiv.className = 'form-text text-success';
            document.getElementById('registerEmail').classList.remove('is-invalid');
            document.getElementById('registerEmail').classList.add('is-valid');
        }
    }, 1000);
}

// ===== Toggle Password =====
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
    field.setAttribute('type', type);
    
    const button = field.parentElement.querySelector('.toggle-password');
    if (button) {
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    }
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const existingToasts = document.querySelectorAll('.toast-container');
    existingToasts.forEach(toast => toast.remove());
    
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    container.appendChild(toast);
    document.body.appendChild(container);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.remove(), 300);
    }, 4000);
}

// ===== Utility Functions =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== Smooth Scrolling - FIXED =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href === '#0' || href === '#') {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize AOS =====
if (typeof AOS !== 'undefined') {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800
    });
}
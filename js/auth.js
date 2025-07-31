// auth.js
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin" // In production, use proper authentication
};

document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isAuthenticated');
            window.location.href = 'login.html';
        });
    }
    
    // Check authentication for admin page
    if (window.location.pathname.includes('admin.html')) {
        if (localStorage.getItem('isAuthenticated') !== 'true') {
            window.location.href = 'login.html';
        }
    }
});
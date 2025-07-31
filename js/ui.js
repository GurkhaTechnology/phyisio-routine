
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Toast notification system
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toast-close');
    
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            toast.classList.remove('show');
        });
    }
    
    window.showToast = function(title, message, duration = 3000) {
        const toastTitle = document.getElementById('toast-title');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastTitle && toastMessage) {
            toastTitle.textContent = title;
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }
    };
    
    // Tab functionality for exercise library
    const categoryTabs = document.querySelectorAll('#category-tabs .tab-trigger');
    
    categoryTabs.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter exercises
            if (window.filterExercises) {
                window.filterExercises(category);
            }
        });
    });
    
    // Tab functionality for routines page
    const routineTabs = document.querySelectorAll('[data-tab]');
    
    routineTabs.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            routineTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize any date pickers if they exist
    const datePickers = document.querySelectorAll('.date-picker');
    datePickers.forEach(picker => {
        picker.addEventListener('focus', function() {
            this.type = 'date';
        });
        
        picker.addEventListener('blur', function() {
            if (!this.value) {
                this.type = 'text';
            }
        });
    });
});
// admin.js
document.addEventListener('DOMContentLoaded', function() {
    const exerciseForm = document.getElementById('exercise-form');
    
    exerciseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const exercise = {
            id: Date.now(),
            name: document.getElementById('exercise-name').value,
            category: document.getElementById('exercise-category').value,
            description: document.getElementById('exercise-description').value,
            instructions: document.getElementById('exercise-instructions').value,
            sets: parseInt(document.getElementById('exercise-sets').value),
            reps: document.getElementById('exercise-reps').value ? 
                  parseInt(document.getElementById('exercise-reps').value) : null,
            duration: document.getElementById('exercise-duration').value ? 
                     parseInt(document.getElementById('exercise-duration').value) : null,
            image: document.getElementById('exercise-image').value || null,
            gif: document.getElementById('exercise-gif').value || null
        };
        
        // Add to exercises array (in a real app, this would go to a database)
        exercises.push(exercise);
        
        // Update localStorage
        localStorage.setItem('physioExercises', JSON.stringify(exercises));
        
        // Show success message
        alert('Exercise added successfully!');
        
        // Reset form
        exerciseForm.reset();
    });
    
    // Load existing exercises from localStorage
    if (localStorage.getItem('physioExercises')) {
        const savedExercises = JSON.parse(localStorage.getItem('physioExercises'));
        exercises = savedExercises;
    }
});
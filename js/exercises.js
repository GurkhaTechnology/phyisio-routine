document.addEventListener('DOMContentLoaded', function() {
    const exerciseGrid = document.getElementById('exercise-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Render all exercises initially
    renderExercises(exercises);
    
    // Make filterExercises available globally for tab switching
    window.filterExercises = function(category) {
        if (category === 'all') {
            renderExercises(exercises);
        } else {
            const filtered = exercises.filter(ex => ex.category === category);
            renderExercises(filtered);
        }
    };
    
    function renderExercises(exercisesToRender) {
        // Show loading spinner
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        
        // Clear existing content
        if (exerciseGrid) {
            // Keep the loading spinner in the DOM
            const children = Array.from(exerciseGrid.children).filter(
                child => child.id !== 'loading-spinner'
            );
            children.forEach(child => child.remove());
            
            // Add exercise cards
            exercisesToRender.forEach(exercise => {
                const card = createExerciseCard(exercise);
                exerciseGrid.insertBefore(card, loadingSpinner);
            });
            
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
        }
    }

    function createExerciseCard(exercise) {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.dataset.category = exercise.category;

        // Show GIF directly in card; if no GIF, fallback to image; if neither, show placeholder
        let media = '';
        if (exercise.gif) {
            media = `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">`;
        } else if (exercise.image) {
            media = `<img src="${exercise.image}" alt="${exercise.name}" class="exercise-image">`;
        } else {
            media = '<div class="exercise-image placeholder"></div>';
        }

        const repsInfo = exercise.reps ? 
            `<p><strong>Reps:</strong> ${exercise.sets} sets of ${exercise.reps} reps</p>` :
            `<p><strong>Duration:</strong> ${exercise.duration} seconds per set</p>`;

        card.innerHTML = `
            <div class="card-collapsed">
                ${media}
                <div class="exercise-info">
                    <div class="exercise-header">
                        <h3>${exercise.name}</h3>
                        <span class="exercise-category ${exercise.category}">${exercise.category}</span>
                    </div>
                    <p class="exercise-description">${exercise.description}</p>
                    <div class="exercise-details">
                        ${repsInfo}
                    </div>
                </div>
            </div>
            <div class="card-expanded" style="display: none;">
                ${exercise.gif ? `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">` : ''}
                <div class="exercise-actions">
                    <button class="btn btn-outline view-instructions" data-exercise-id="${exercise.id}">View Instructions</button>
                    <button class="btn btn-primary add-to-routine" data-exercise-id="${exercise.id}">Add to Routine</button>
                </div>
            </div>
        `;
        
        // Add click event to toggle card expansion
        card.addEventListener('click', function(e) {
            // Don't toggle if clicking on buttons inside expanded card
            if (!e.target.closest('.exercise-actions')) {
                const isExpanded = this.classList.toggle('expanded');
                const collapsed = this.querySelector('.card-collapsed');
                const expanded = this.querySelector('.card-expanded');
                
                if (isExpanded) {
                    collapsed.style.display = 'none';
                    expanded.style.display = 'block';
                } else {
                    collapsed.style.display = 'flex';
                    expanded.style.display = 'none';
                }
            }
        });
        
        // Add event listeners to buttons
        const viewBtn = card.querySelector('.view-instructions');
        const addBtn = card.querySelector('.add-to-routine');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showExerciseModal(exercise);
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof db !== 'undefined' && typeof db.addExerciseToRoutine === 'function') {
                    let routines = db.getRoutines();
                    let routineId;
                    if (!routines.length) {
                        // Create a default routine if none exists
                        const newRoutine = db.createRoutine('My Routine', []);
                        routineId = newRoutine.id;
                        showToast('Routine Created', 'A new routine was created for you.');
                    } else {
                        routineId = routines[0].id;
                    }
                    const success = db.addExerciseToRoutine(routineId, exercise.id);
                    if (success) {
                        showToast('Exercise Added', `${exercise.name} has been added to your routine`);
                    } else {
                        showToast('Already Added', `${exercise.name} is already in your routine`);
                    }
                } else {
                    showToast('Error', 'Routine database is not available.');
                }
            });
        }
        
        return card;
    }

    function showExerciseModal(exercise) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>${exercise.name}</h2>
                <p class="exercise-category ${exercise.category}">${exercise.category}</p>
                
                ${exercise.gif ? `<img src="${exercise.gif}" alt="${exercise.name}" class="exercise-gif">` : ''}
                
                ${exercise.image ? `<img src="${exercise.image}" alt="${exercise.name}" class="modal-exercise-image">` : ''}
                
                <div class="modal-exercise-details">
                    <h3>Description</h3>
                    <p>${exercise.description}</p>
                    
                    <h3>Instructions</h3>
                    <div class="instructions">${exercise.instructions.replace(/\n/g, '<br>')}</div>
                    
                    <div class="exercise-specs">
                        <div class="spec">
                            <h4>Sets</h4>
                            <p>${exercise.sets}</p>
                        </div>
                        <div class="spec">
                            <h4>${exercise.reps ? 'Reps' : 'Duration'}</h4>
                            <p>${exercise.reps || exercise.duration + ' sec'}</p>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary add-to-routine" data-exercise-id="${exercise.id}">Add to Routine</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const addBtn = modal.querySelector('.add-to-routine');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        });
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Get the first routine (or prompt user if none)
                const routines = db.getRoutines();
                if (!routines.length) {
                    showToast('No Routine', 'Please create a routine first.');
                    return;
                }
                const routineId = routines[0].id;
                const success = db.addExerciseToRoutine(routineId, exercise.id);
                if (success) {
                    showToast('Exercise Added', `${exercise.name} has been added to your routine`);
                } else {
                    showToast('Already Added', `${exercise.name} is already in your routine`);
                }
            });
        }
        
        // Close when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.classList.remove('modal-open');
            }
        });
    }
});
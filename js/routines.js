    // Add responsive styles for the routine player modal
    const style = document.createElement('style');
    style.textContent = `
    .player-modal-content { max-width: 400px; width: 95vw; margin: 0 auto; padding: 1.5rem; box-sizing: border-box; }
    .player-gif { width: 100%; max-width: 320px; height: auto; display: block; margin: 0 auto 1rem; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .player-exercise-info { text-align: center; margin-bottom: 1rem; }
    .player-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
    .player-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    @media (max-width: 600px) {
      .player-modal-content { padding: 0.5rem; }
      .player-gif { max-width: 100%; }
    }
    `;
    document.head.appendChild(style);
// routines.js
document.addEventListener('DOMContentLoaded', function() {
    const routinesContainer = document.getElementById('routines-container');
    const routineBuilder = document.getElementById('routine-builder');
    const routineNameInput = document.getElementById('routine-name');
    const builderExercises = document.getElementById('builder-exercises');
    const saveRoutineBtn = document.getElementById('save-routine');
    const clearBuilderBtn = document.getElementById('clear-builder');
    const tabTriggers = document.querySelectorAll('[data-tab]');
    
    // Current state for builder
    let builderExercisesList = [];
    
    // Load routines when page loads
    loadRoutines();
    
    // Tab switching functionality
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabTriggers.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            // If switching to builder, update the exercises list
            if (tabId === 'routine-builder') {
                updateBuilderExercisesList();
            }
        });
    });
    
    // Save routine button
    saveRoutineBtn.addEventListener('click', function() {
        const name = routineNameInput.value.trim();
        
        if (!name) {
            showToast('Error', 'Please enter a routine name');
            return;
        }
        
        if (builderExercisesList.length === 0) {
            showToast('Error', 'Please add at least one exercise');
            return;
        }
        
        const newRoutine = db.createRoutine(name, builderExercisesList);
        showToast('Success', `Routine "${newRoutine.name}" created`);
        
        // Reset builder
        routineNameInput.value = '';
        builderExercisesList = [];
        updateBuilderExercisesList();
        
        // Switch to routines list and refresh
        document.querySelector('[data-tab="routines-list"]').click();
        loadRoutines();
    });
    
    // Clear builder button
    clearBuilderBtn.addEventListener('click', function() {
        routineNameInput.value = '';
        builderExercisesList = [];
        updateBuilderExercisesList();
    });
    
    // Load routines from database
    function loadRoutines() {
        const loadingSpinner = document.getElementById('routines-loading');
        
        if (loadingSpinner) loadingSpinner.style.display = 'flex';
        if (routinesContainer) {
            // Clear existing content except loading spinner
            const children = Array.from(routinesContainer.children).filter(
                child => child.id !== 'routines-loading'
            );
            children.forEach(child => child.remove());
        }
        
        // Simulate loading delay
        setTimeout(() => {
            const routines = db.getRoutines();
            
            if (routines.length === 0) {
                routinesContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <h3>No Routines Yet</h3>
                        <p>You haven't created any routines yet. Start by creating one!</p>
                        <button class="btn btn-primary" data-tab="routine-builder">Create Routine</button>
                    </div>
                `;
                
                // Add click handler to the button
                const createBtn = routinesContainer.querySelector('[data-tab="routine-builder"]');
                if (createBtn) {
                    createBtn.addEventListener('click', function() {
                        document.querySelector('[data-tab="routine-builder"]').click();
                    });
                }
            } else {
                routines.forEach(routine => {
                    const routineCard = createRoutineCard(routine);
                    routinesContainer.appendChild(routineCard);
                });
            }
            
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }, 500);
    }
    
    function createRoutineCard(routine) {
        const card = document.createElement('div');
        card.className = 'routine-card';
        card.dataset.routineId = routine.id;
        
        // Get exercise details for this routine
        const exerciseDetails = routine.exercises.map(exId => {
            const ex = exercises.find(e => e.id === exId);
            return ex ? { name: ex.name, category: ex.category } : null;
        }).filter(Boolean);
        
        card.innerHTML = `
            <div class="routine-header">
                <h3>${routine.name}</h3>
                <div class="routine-actions">
                    <button class="btn-icon start-routine" title="Start Routine">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 17,10 5,17" fill="#4CAF50"/></svg>
                    </button>
                    <button class="btn-icon edit-routine" title="Edit Routine">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 3.29a1 1 0 0 1 1.41 0l.59.59a1 1 0 0 1 0 1.41l-9.3 9.3-2 0.59 0.59-2 9.3-9.3zM3 17h14v2H3v-2z" fill="#FFC107"/></svg>
                    </button>
                    <button class="btn-icon delete-routine" title="Delete Routine">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="10" height="8" rx="2" fill="#F44336"/><rect x="8" y="9" width="1.5" height="5" fill="#fff"/><rect x="10.5" y="9" width="1.5" height="5" fill="#fff"/><rect x="4" y="5" width="12" height="2" fill="#BDBDBD"/></svg>
                    </button>
                </div>
            </div>
            
            <div class="routine-meta">
                <span class="routine-date">Created: ${new Date(routine.createdAt).toLocaleDateString()}</span>
                <span class="routine-count">${routine.exercises.length} exercises</span>
            </div>
            
            <div class="routine-exercises">
                ${exerciseDetails.slice(0, 3).map(ex => `
                    <span class="exercise-tag ${ex.category}">${ex.name}</span>
                `).join('')}
                ${exerciseDetails.length > 3 ? `<span class="exercise-tag more">+${exerciseDetails.length - 3} more</span>` : ''}
            </div>
        `;
        
        // Add event listeners
        const startBtn = card.querySelector('.start-routine');
        const editBtn = card.querySelector('.edit-routine');
        const deleteBtn = card.querySelector('.delete-routine');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                showRoutinePlayer(routine);
                db.updateRoutine(routine.id, { lastUsed: new Date().toISOString() });
            });
        }
    // Routine Player Modal
    function showRoutinePlayer(routine) {
        // Remove any existing modal
        const oldModal = document.getElementById('routine-player-modal');
        if (oldModal) oldModal.remove();

        // Prepare exercises
        const routineExercises = routine.exercises.map(id => exercises.find(e => e.id === id)).filter(Boolean);
        let currentIdx = 0;
        let timer = null;
        let seconds = 0;
        let running = false;

        // Modal HTML
        const modal = document.createElement('div');
        modal.id = 'routine-player-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content player-modal-content">
                <button class="modal-close">&times;</button>
                <h2>${routine.name}</h2>
                <div class="player-exercise-info">
                    <h3 id="player-exercise-name"></h3>
                    <img id="player-exercise-gif" class="player-gif" src="" alt="Exercise GIF">
                </div>
                <div class="player-controls">
                    <button id="player-prev" class="btn btn-outline">Prev</button>
                    <span id="player-timer">00:00</span>
                    <button id="player-next" class="btn btn-outline">Next</button>
                </div>
                <div class="player-actions">
                    <button id="player-start" class="btn btn-primary">Start</button>
                    <button id="player-stop" class="btn btn-outline" style="display:none;">Stop</button>
                    <button id="player-done" class="btn btn-success" style="display:none;">Finish Routine</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        // Elements
        const closeBtn = modal.querySelector('.modal-close');
        const prevBtn = modal.querySelector('#player-prev');
        const nextBtn = modal.querySelector('#player-next');
        const timerSpan = modal.querySelector('#player-timer');
        const startBtn = modal.querySelector('#player-start');
        const stopBtn = modal.querySelector('#player-stop');
        const doneBtn = modal.querySelector('#player-done');
        const nameEl = modal.querySelector('#player-exercise-name');
        const gifEl = modal.querySelector('#player-exercise-gif');

        // Show exercise
        function showExercise(idx) {
            const ex = routineExercises[idx];
            nameEl.textContent = ex.name;
            gifEl.src = ex.gif || '';
            gifEl.alt = ex.name;
        }
        showExercise(currentIdx);

        // Timer logic
        function updateTimer() {
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            timerSpan.textContent = `${min}:${sec}`;
        }
        function startTimer() {
            running = true;
            startBtn.style.display = 'none';
            stopBtn.style.display = '';
            doneBtn.style.display = '';
            timer = setInterval(() => {
                seconds++;
                updateTimer();
            }, 1000);
        }
        function stopTimer() {
            running = false;
            startBtn.style.display = '';
            stopBtn.style.display = 'none';
            clearInterval(timer);
        }
        function finishRoutine() {
            stopTimer();
            // Log completion
            db.logRoutineCompletion(routine.id, routine.name, seconds);
            showToast('Routine Complete', `You finished "${routine.name}"!`);
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        }
        updateTimer();

        // Event listeners
        closeBtn.addEventListener('click', () => {
            if (timer) clearInterval(timer);
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        });
        prevBtn.addEventListener('click', () => {
            if (currentIdx > 0) {
                currentIdx--;
                showExercise(currentIdx);
            }
        });
        nextBtn.addEventListener('click', () => {
            if (currentIdx < routineExercises.length - 1) {
                currentIdx++;
                showExercise(currentIdx);
            }
        });
        startBtn.addEventListener('click', startTimer);
        stopBtn.addEventListener('click', stopTimer);
        doneBtn.addEventListener('click', finishRoutine);
    }
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editRoutine(routine);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete the routine "${routine.name}"?`)) {
                    if (db.deleteRoutine(routine.id)) {
                        showToast('Routine Deleted', `"${routine.name}" has been deleted`);
                        card.remove();
                        
                        // If no routines left, show empty state
                        if (document.querySelectorAll('.routine-card').length === 0) {
                            loadRoutines();
                        }
                    }
                }
            });
        }
        
        return card;
    }
    
    function editRoutine(routine) {
        // Switch to builder tab
        document.querySelector('[data-tab="routine-builder"]').click();
        
        // Populate builder with routine data
        routineNameInput.value = routine.name;
        builderExercisesList = [...routine.exercises];
        
        // Change save button to update
        saveRoutineBtn.innerHTML = '<span class="icon icon-save"></span> Update Routine';
        saveRoutineBtn.onclick = function() {
            const name = routineNameInput.value.trim();
            
            if (!name) {
                showToast('Error', 'Please enter a routine name');
                return;
            }
            
            if (builderExercisesList.length === 0) {
                showToast('Error', 'Please add at least one exercise');
                return;
            }
            
            if (db.updateRoutine(routine.id, { 
                name,
                exercises: builderExercisesList 
            })) {
                showToast('Success', `Routine "${name}" updated`);
                
                // Reset builder
                routineNameInput.value = '';
                builderExercisesList = [];
                updateBuilderExercisesList();
                saveRoutineBtn.innerHTML = '<span class="icon icon-save"></span> Save Routine';
                saveRoutineBtn.onclick = saveNewRoutine;
                
                // Switch to routines list and refresh
                document.querySelector('[data-tab="routines-list"]').click();
                loadRoutines();
            }
        };
        
        updateBuilderExercisesList();
    }
    
    function saveNewRoutine() {
        const name = routineNameInput.value.trim();
        
        if (!name) {
            showToast('Error', 'Please enter a routine name');
            return;
        }
        
        if (builderExercisesList.length === 0) {
            showToast('Error', 'Please add at least one exercise');
            return;
        }
        
        const newRoutine = db.createRoutine(name, builderExercisesList);
        showToast('Success', `Routine "${newRoutine.name}" created`);
        
        // Reset builder
        routineNameInput.value = '';
        builderExercisesList = [];
        updateBuilderExercisesList();
        
        // Switch to routines list and refresh
        document.querySelector('[data-tab="routines-list"]').click();
        loadRoutines();
    }
    
    function updateBuilderExercisesList() {
        builderExercises.innerHTML = '';
        
        if (builderExercisesList.length === 0) {
            builderExercises.innerHTML = `
                <div class="empty-builder">
                    <p>No exercises added yet</p>
                    <a href="exercises.html" class="btn btn-outline">Browse Exercises</a>
                </div>
            `;
            return;
        }
        
        const exerciseList = document.createElement('div');
        exerciseList.className = 'exercise-list';
        
        builderExercisesList.forEach(exerciseId => {
            const exercise = exercises.find(e => e.id === exerciseId);
            if (exercise) {
                const exerciseItem = document.createElement('div');
                exerciseItem.className = 'exercise-item';
                exerciseItem.dataset.exerciseId = exercise.id;
                
                exerciseItem.innerHTML = `
                    <div class="exercise-info">
                        <h4>${exercise.name}</h4>
                        <span class="exercise-category ${exercise.category}">${exercise.category}</span>
                    </div>
                    <button class="btn-icon remove-exercise" title="Remove Exercise">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="10" height="8" rx="2" fill="#F44336"/><rect x="8" y="9" width="1.5" height="5" fill="#fff"/><rect x="10.5" y="9" width="1.5" height="5" fill="#fff"/><rect x="4" y="5" width="12" height="2" fill="#BDBDBD"/></svg>
                    </button>
                `;
                
                const removeBtn = exerciseItem.querySelector('.remove-exercise');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        builderExercisesList = builderExercisesList.filter(id => id !== exercise.id);
                        updateBuilderExercisesList();
                    });
                }
                
                exerciseList.appendChild(exerciseItem);
            }
        });
        
        builderExercises.appendChild(exerciseList);
    }
    
    // If coming from exercises page with exercises to add
    if (window.location.hash === '#add-exercises') {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const exerciseIds = params.get('exerciseIds');
        
        if (exerciseIds) {
            const ids = exerciseIds.split(',');
            builderExercisesList = [...new Set([...builderExercisesList, ...ids])];
            updateBuilderExercisesList();
            document.querySelector('[data-tab="routine-builder"]').click();
            
            // Clean up URL
            history.replaceState(null, null, window.location.pathname);
        }
    }
});
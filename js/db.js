// db.js - Updated with both routine management and progress tracking

const DB_NAME = 'PhysioRoutineDB';

function initializeDB() {
    if (!localStorage.getItem(DB_NAME)) {
        localStorage.setItem(DB_NAME, JSON.stringify({
            routines: [],
            favorites: [],
            progress: []
        }));
    }
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_NAME)) || {};
}

function updateDB(data) {
    localStorage.setItem(DB_NAME, JSON.stringify(data));
}

// Routine-related functions (existing)
function createRoutine(name, exercises = []) {
    const db = getDB();
    const newRoutine = {
        id: Date.now().toString(),
        name,
        exercises,
        createdAt: new Date().toISOString(),
        lastUsed: null
    };
    
    db.routines.push(newRoutine);
    updateDB(db);
    return newRoutine;
}

function getRoutines() {
    return getDB().routines || [];
}

function getRoutineById(id) {
    return getRoutines().find(r => r.id === id);
}

function updateRoutine(id, updates) {
    const db = getDB();
    const routineIndex = db.routines.findIndex(r => r.id === id);
    
    if (routineIndex !== -1) {
        db.routines[routineIndex] = {
            ...db.routines[routineIndex],
            ...updates,
            lastUsed: new Date().toISOString()
        };
        updateDB(db);
        return true;
    }
    
    return false;
}

function deleteRoutine(id) {
    const db = getDB();
    const initialLength = db.routines.length;
    db.routines = db.routines.filter(r => r.id !== id);

    // Remove progress entries for this routine
    db.progress.forEach(entry => {
        entry.routinesCompleted = entry.routinesCompleted.filter(rc => rc.routineId !== id);
    });
    db.progress = db.progress.filter(entry => entry.routinesCompleted.length > 0);

    if (db.routines.length !== initialLength) {
        updateDB(db);
        return true;
    }
    return false;
}

function addExerciseToRoutine(routineId, exerciseId) {
    const db = getDB();
    const routine = db.routines.find(r => r.id === routineId);
    
    if (routine && !routine.exercises.includes(exerciseId)) {
        routine.exercises.push(exerciseId);
        updateDB(db);
        return true;
    }
    
    return false;
}

function removeExerciseFromRoutine(routineId, exerciseId) {
    const db = getDB();
    const routine = db.routines.find(r => r.id === routineId);
    
    if (routine) {
        const initialLength = routine.exercises.length;
        routine.exercises = routine.exercises.filter(id => id !== exerciseId);
        
        if (routine.exercises.length !== initialLength) {
            updateDB(db);
            return true;
        }
    }
    
    return false;
}

// Progress tracking functions (new)
function logRoutineCompletion(routineId, routineName, duration) {
    const db = getDB();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find or create today's progress entry
    let progressEntry = db.progress.find(p => {
        const entryDate = new Date(p.date);
        return (
            entryDate.getFullYear() === today.getFullYear() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getDate() === today.getDate()
        );
    });
    
    if (!progressEntry) {
        progressEntry = {
            date: today.toISOString(),
            activityLevel: 0,
            routinesCompleted: []
        };
        db.progress.push(progressEntry);
    }
    
    // Add the completed routine
    progressEntry.routinesCompleted.push({
        routineId,
        routineName,
        duration,
        completedAt: now.toISOString()
    });
    
    // Update activity level (capped at 3)
    progressEntry.activityLevel = Math.min(progressEntry.routinesCompleted.length, 3);
    
    updateDB(db);
    return progressEntry;
}

function getProgressData(days = 30) {
    const db = getDB();
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return db.progress
        .filter(p => new Date(p.date) >= cutoffDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getRecentActivity(limit = 5) {
    const db = getDB();
    const allRoutines = db.progress.flatMap(p => p.routinesCompleted);
    return allRoutines
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, limit);
}

function getProgressStats() {
    const db = getDB();
    const now = new Date();
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);
    
    const last7DaysData = db.progress.filter(p => new Date(p.date) >= last7Days);
    const last30DaysData = db.progress.filter(p => new Date(p.date) >= last30Days);
    
    // Calculate active days
    const activeDays7 = last7DaysData.filter(p => p.activityLevel > 0).length;
    const activeDays30 = last30DaysData.filter(p => p.activityLevel > 0).length;
    
    // Calculate total routines completed
    const routines7 = last7DaysData.flatMap(p => p.routinesCompleted).length;
    const routines30 = last30DaysData.flatMap(p => p.routinesCompleted).length;
    
    // Calculate total duration
    const duration7 = last7DaysData
        .flatMap(p => p.routinesCompleted)
        .reduce((sum, r) => sum + r.duration, 0);
    const duration30 = last30DaysData
        .flatMap(p => p.routinesCompleted)
        .reduce((sum, r) => sum + r.duration, 0);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let checkDate = new Date(today);
    
    while (true) {
        const hasActivity = db.progress.some(p => {
            const entryDate = new Date(p.date);
            return (
                entryDate.getFullYear() === checkDate.getFullYear() &&
                entryDate.getMonth() === checkDate.getMonth() &&
                entryDate.getDate() === checkDate.getDate() &&
                p.activityLevel > 0
            );
        });
        
        if (hasActivity) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return {
        activeDays7,
        activeDays30,
        routines7,
        routines30,
        duration7,
        duration30,
        currentStreak
    };
}

// Initialize the database when this file loads
initializeDB();

// Export for modules or make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDB,
        getDB,
        updateDB,
        createRoutine,
        getRoutines,
        getRoutineById,
        updateRoutine,
        deleteRoutine,
        addExerciseToRoutine,
        removeExerciseFromRoutine,
        logRoutineCompletion,
        getProgressData,
        getRecentActivity,
        getProgressStats
    };
} else {
    window.db = {
        initializeDB,
        getDB,
        updateDB,
        createRoutine,
        getRoutines,
        getRoutineById,
        updateRoutine,
        deleteRoutine,
        addExerciseToRoutine,
        removeExerciseFromRoutine,
        logRoutineCompletion,
        getProgressData,
        getRecentActivity,
        getProgressStats
    };
}
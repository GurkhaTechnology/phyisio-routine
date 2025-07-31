// progress.js - Handles progress page logic
document.addEventListener('DOMContentLoaded', function() {
    const statsGrid = document.getElementById('stats-grid');
    const recentActivity = document.getElementById('recent-activity');
    const loadingSpinner = document.getElementById('progress-loading');

    // Show loading spinner
    if (loadingSpinner) loadingSpinner.style.display = 'flex';

    // Load stats
    const stats = db.getProgressStats();
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-card"><h3>${stats.activeDays7}</h3><p>Active Days (7d)</p></div>
            <div class="stat-card"><h3>${stats.activeDays30}</h3><p>Active Days (30d)</p></div>
            <div class="stat-card"><h3>${stats.routines7}</h3><p>Routines (7d)</p></div>
            <div class="stat-card"><h3>${stats.routines30}</h3><p>Routines (30d)</p></div>
            <div class="stat-card"><h3>${stats.duration7}</h3><p>Minutes (7d)</p></div>
            <div class="stat-card"><h3>${stats.duration30}</h3><p>Minutes (30d)</p></div>
            <div class="stat-card"><h3>${stats.currentStreak}</h3><p>Current Streak</p></div>
        `;
    }

    // Load recent activity
    if (recentActivity) {
        const activity = db.getRecentActivity(5);
        if (activity.length === 0) {
            recentActivity.innerHTML = '<p>No recent activity yet.</p>';
        } else {
            recentActivity.innerHTML = activity.map(a => `
                <div class="activity-item">
                    <strong>${a.routineName}</strong> - ${new Date(a.completedAt).toLocaleString()}<br>
                    Duration: ${a.duration} sec
                </div>
            `).join('');
        }
    }

    if (loadingSpinner) loadingSpinner.style.display = 'none';
});

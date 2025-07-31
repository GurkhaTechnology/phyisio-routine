# PhysioRoutine - Project Documentation

## 1. Project Overview

**PhysioRoutine** is a client-side web application designed to serve as a digital physiotherapy assistant. It empowers users to take control of their physical therapy by providing a library of exercises, tools to build custom routines, and features to track their progress over time. The entire application runs in the browser without needing a backend, making it highly accessible and easy to use.

All data, including user-created routines and progress history, is stored locally in the browser's `localStorage`.

## 2. Implemented Features

The following features have been fully implemented and are functional in the current version of the application.

### 2.1. Core User Features

-   **Exercise Library (`exercises.html`)**
    -   A comprehensive collection of physiotherapy exercises is available for users to browse.
    -   Exercises are categorized by body part (Neck, Shoulder, Back, Knee, Ankle) for easy filtering.
    -   Each exercise is presented in a card format, showing a name, category, and a descriptive GIF.
    -   Users can click on an exercise card to view detailed instructions, sets, and reps/duration.

-   **Routine Management (`routines.html`)**
    -   **Routine Builder:** Users can create personalized exercise routines by selecting exercises from the library. Each routine can be given a custom name.
    -   **My Routines:** Saved routines are listed in a dedicated tab, showing the routine name, creation date, and the number of exercises it contains.
    -   **Routine Player:** Users can launch an interactive player for any saved routine. The player guides them through each exercise with a visual GIF, a timer, and controls to move between exercises.

-   **Progress Tracking (`progress.html`)**
    -   **Statistics Dashboard:** The application tracks and displays key performance metrics, including:
        -   Active days (last 7 and 30 days)
        -   Total routines completed (last 7 and 30 days)
        -   Total exercise duration
        -   Current streak of consecutive active days
    -   **Activity Calendar:** A GitHub-style contribution calendar visually represents the user's activity and consistency over the past 30 days.
    -   **Recent Activity:** A list of recently completed routines is displayed for quick reference.

### 2.2. Admin Functionality

-   **Admin Login (`login.html`)**
    -   A basic login form is provided for administrative access.
    -   Authentication is handled client-side with hardcoded credentials (`admin`/`admin`).

-   **Exercise Management (`admin.html`)**
    -   A secure admin panel allows for adding new exercises to the application's library.
    -   The form includes fields for exercise name, category, description, instructions, sets, reps/duration, and image/GIF URLs.
    -   New exercises are saved to `localStorage` and become immediately available in the exercise library.

### 2.3. General & Technical Features

-   **Responsive Design:** The entire application is fully responsive and optimized for a seamless experience on both desktop and mobile devices.
-   **Client-Side Data Storage:** All user data is persisted in the browser's `localStorage`, eliminating the need for a database or backend server.
-   **Offline Capability:** A service worker (`service-worker.js`) caches essential application assets, allowing the app to load and be used even without an internet connection.
-   **Modular JavaScript:** The JavaScript code is organized into logical modules for better maintainability:
    -   `db.js`: Handles all interactions with `localStorage`.
    -   `ui.js`: Manages UI components like modals, toasts, and tabs.
    -   `data.js`: Contains the initial seed data for exercises.
    -   Separate scripts for each page (`exercises.js`, `routines.js`, etc.) manage page-specific logic.

## 3. Technology Stack

-   **HTML5:** Used for the semantic structure of all pages.
-   **CSS3:** Used for all styling, including layout, typography, and animations. It leverages modern features like Flexbox, Grid, and custom properties for a maintainable and consistent design.
-   **Vanilla JavaScript (ES6+):** All dynamic functionality and application logic are written in pure JavaScript, with no external frameworks or libraries.

## 4. Project Structure

The project follows a standard structure for a simple web application:

```
/physioroutine
|-- css/
|   |-- styles.css         # Core styles, typography, layout
|   |-- components.css     # Component-specific styles (cards, buttons, etc.)
|-- js/
|   |-- app.js             # General application logic
|   |-- auth.js            # Admin authentication
|   |-- data.js            # Initial exercise data
|   |-- db.js              # localStorage database wrapper
|   |-- exercises.js       # Logic for the exercise library page
|   |-- progress.js        # Logic for the progress tracking page
|   |-- routines.js        # Logic for the routines page
|   |-- service-worker.js  # Offline support
|   |-- ui.js              # UI component management
|-- images/
|   |-- *.gif              # Exercise demonstration GIFs
|-- *.html                 # HTML files for each page
|-- README.md              # Project README
|-- documentation.md       # This file
```

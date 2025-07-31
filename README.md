# PhysioRoutine

PhysioRoutine is a web-based physiotherapy assistant designed to help users follow customized exercise routines, track their progress, and manage their physiotherapy journey effectively. The application is built entirely with vanilla HTML, CSS, and JavaScript, making it lightweight and easy to run without any build process.

## Key Features

- **Exercise Library:** Browse a comprehensive library of physiotherapy exercises, complete with GIF demonstrations, descriptions, and instructions. Exercises can be filtered by body part (e.g., Neck, Shoulder, Back, Knee, Ankle).
- **Custom Routines:** Create personalized exercise routines by selecting exercises from the library.
- **Guided Exercise Player:** Follow along with created routines using an interactive player that shows the current exercise, a timer, and controls to navigate through the routine.
- **Progress Tracking:** Monitor your progress with statistics on active days, completed routines, and total exercise duration. An activity calendar provides a visual representation of your consistency.
- **Admin Panel:** A simple admin panel allows for adding new exercises to the application's library.
- **Responsive Design:** The user interface is fully responsive and works seamlessly on both desktop and mobile devices.
- **Offline Support:** A service worker provides basic offline functionality, allowing you to access the application even without an internet connection.
- **No Dependencies:** The project uses pure HTML, CSS, and JavaScript, requiring no external libraries or build tools.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You only need a modern web browser that supports HTML5, CSS3, and JavaScript (ES6+).

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/physioroutine.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd physioroutine
    ```
3.  Open the `index.html` file in your web browser.

That's it! The application will be running locally in your browser.

## How to Use

- **Browse Exercises:** Navigate to the "Exercise Library" to see all available exercises. Use the tabs to filter by category.
- **Create a Routine:** Go to "My Routines" and use the "Routine Builder" to create a new routine. Give it a name and add exercises from the library.
- **Start a Routine:** From the "My Routines" list, click the play button on any routine to launch the exercise player.
- **Track Progress:** Visit the "My Progress" page to see your activity calendar and performance statistics.

### Admin Access

The application includes a simple admin panel to add new exercises.

1.  Navigate to `login.html`.
2.  Use the following credentials:
    -   **Username:** `admin`
    -   **Password:** `admin`
3.  After logging in, you will be redirected to the admin page where you can fill out a form to add a new exercise to the library. Data is stored in the browser's `localStorage`.

## Technologies Used

-   **HTML5:** For the structure and content of the web pages.
-   **CSS3:** For styling, layout, and responsive design. Custom properties are used for easy theming.
-   **Vanilla JavaScript (ES6+):** For all client-side logic, including DOM manipulation, event handling, and data management.
-   **Browser `localStorage`:** To persist user data such as routines, progress, and custom exercises directly in the browser.
-   **Service Worker API:** To enable offline caching of core application assets.

## Future Improvements

-   **Backend Integration:** Replace `localStorage` with a proper backend (e.g., Node.js with Express and a database like MongoDB or a BaaS like Firebase) to allow user accounts and data synchronization across devices.
-   **User Authentication:** Implement a full-fledged user registration and login system.
-   **Enhanced Search:** Add a search bar to the exercise library for quicker filtering.
-   **Routine Editing:** Allow users to edit existing routines (reorder, remove, or change exercises).
-   **Advanced Progress Analytics:** Introduce more detailed charts and graphs for tracking progress over time.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

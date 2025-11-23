# Project Overview

This project is a "Squat Monitor" application that uses machine learning to analyze and track a user's squat performance in real-time. It's a single-page web application built with plain HTML, JavaScript, and CSS.

The core functionality is powered by:

*   **TensorFlow.js:** For running the machine learning model in the browser.
*   **PoseNet:** A pre-trained model for real-time human pose estimation. It identifies the positions of key body joints (like hips, knees, and ankles) from the webcam video stream.
*   **Chart.js:** For visualizing the squat data, including a live graph of the current squat and historical data for previous squats.

The application works by:

1.  Accessing the user's webcam.
2.  Using PoseNet to detect the user's body posture in each frame.
3.  Calculating the angle of the knee joint to determine if the user is standing, squatting, or has completed a squat.
4.  Displaying the knee angle, squat count, and status in an overlay on the video feed.
5.  Plotting the knee angle over time on a live chart.
6.  Saving and displaying the charts for the last three completed squats.

## Building and Running

This is a simple, self-contained HTML file with no build process.

To run the project:

1.  You need a local web server to serve the `index.html` file. This is because browser security policies restrict `file://` access to the webcam.
2.  A simple way to do this is to use Python's built-in HTTP server. Open a terminal in the project directory and run:

    ```bash
    python -m http.server
    ```

    Or for Python 2:

    ```bash
    python -m SimpleHTTPServer
    ```

3.  Open your web browser and navigate to `http://localhost:8000`.

## Development Conventions

*   **Code Style:** The code is written in plain JavaScript within a `<script>` tag in the `index.html` file. It is well-structured with clear sections for configuration, state management, initialization, the main loop, logic, and drawing helpers.
*   **Dependencies:** All dependencies (`TensorFlow.js`, `PoseNet`, and `Chart.js`) are loaded from a CDN, so there are no local packages to manage.
*   **Git Operations:** The user will manually handle *all* Git operations. This means the agent *must not* perform any `git add`, `git commit`, `git push`, or any other Git-related commands.

## Versioning

The project version is manually tracked in this file and displayed in the top right corner of the application.
When you deem it likely that your changes and fixes should be deployed, also increment this version number accordingly. Don't worry about incrementing it without the changes being deployed.
# Squat Meter Developer Context

## 1. Project Goal

The primary goal of this project is to create a real-time squat analysis tool that runs entirely in the browser. It uses a webcam to monitor a user's squat form, count repetitions, and provide visual feedback on the squat depth. The application is designed to be a standalone, installable Progressive Web App (PWA) for a native-like experience on mobile devices.

## 2. Architecture Overview

This is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. There is no server-side component; all logic, including the machine learning model, runs on the client-side.

### Core Technologies:

*   **HTML/CSS:** Provides the structure and styling for the user interface. The layout is responsive and designed to work on both desktop and mobile devices.
*   **JavaScript (ES6+):** All application logic is contained within a single `<script>` tag in `index.html`. The code is organized into distinct functional sections.
*   **TensorFlow.js:** The core machine learning library used to run the PoseNet model in the browser. It is loaded from a CDN.
*   **PoseNet:** A pre-trained TensorFlow.js model for real-time human pose estimation. It takes a video frame as input and outputs the coordinates of key body joints.
*   **Chart.js:** A charting library used to visualize the squat data. It provides a live graph of the current squat and historical graphs of previous squats.

## 3. Core Components and Logic

### `CONF` Object

This constant object at the top of the script holds all the application's configuration parameters. It's the central place to tweak application behavior.

*   `videoWidth`, `videoHeight`: The desired dimensions for the video stream. These are updated with the actual video dimensions once the stream is active.
*   `minConfidence`: The minimum confidence score required from PoseNet for a keypoint to be considered valid. This has been a critical value for debugging; it was lowered from `0.5` to `0.2` to make the detection more lenient.
*   `standThresh`, `squatThresh`, `deepThresh`: The angle thresholds (in degrees) used by the squat detection state machine.

### `state` Object

This `let` object manages the application's dynamic state.

*   `isDetecting`: A boolean that tracks whether the pose detection loop is active. This is controlled by the "Start/Stop" button.
*   `isSquatting`, `squatCount`, `currentAngle`: State variables for the squat counting logic.
*   `animationFrameId`: Stores the ID returned by `requestAnimationFrame` so the main loop can be cancelled.
*   `videoStream`: Holds the `MediaStream` object from the webcam. This is used to stop the stream when detection is paused.
*   `posenetModel`: Caches the loaded PoseNet model to avoid reloading it on every start.
*   `lastLogTime`: Used to throttle console logging for debugging.

### Initialization (`setup` function)

*   `setup()` is called once when the script loads.
*   It calls `initCharts()` to prepare the Chart.js instances.
*   It pre-loads the PoseNet model and stores it in `state.posenetModel`. This is a crucial optimization to ensure the model is ready when the user clicks "Start".

### Main User Interaction (`toggleDetection` function)

*   This function is the primary entry point for the user.
*   It acts as a toggle, managing the `state.isDetecting` flag.
*   **Starting Detection:**
    *   Requests camera access using `navigator.mediaDevices.getUserMedia`.
    *   Once the stream is active (`onloadedmetadata`), it sets the final video dimensions and kicks off the main loop by calling `detectPoseInRealTime`.
*   **Stopping Detection:**
    *   Cancels the animation frame (`cancelAnimationFrame`).
    *   Stops all tracks in the `videoStream` to release the camera.
    *   Clears the canvas.

### The Main Loop (`detectPoseInRealTime` and `poseDetectionFrame`)

*   `detectPoseInRealTime` sets up the `poseDetectionFrame` async function, which runs in a loop using `requestAnimationFrame`.
*   **Critical Step:** Inside the loop, it first checks if `video.readyState >= 3`. This was a key fix to ensure that pose estimation doesn't run on an incomplete video frame, which was likely the cause of the `(0,0)` keypoint positions.
*   It calls `net.estimateSinglePose(video, ...)` to get the pose from the current video frame.
*   It then clears the canvas and redraws the video frame onto it using `ctx.drawImage`.
*   `drawKeypoints` and `drawSkeleton` are called to overlay the detected pose on the canvas.
*   Finally, it calls `processPose` to analyze the results.

### Squat Logic (`processPose` function)

*   This function implements a simple state machine to count squats.
*   It calculates the knee angle using the law of cosines.
*   It transitions between "Standing" and "Squatting" states based on the `standThresh` and `squatThresh` angle thresholds.
*   When a squat is completed, it calls `pushToHistory`.

### Charting and Data Persistence

*   **`initCharts()`:** Sets up the live chart and the three history charts with their options. The y-axis range is set here.
*   **`pushToHistory()`:**
    *   This function is called after a squat is completed.
    *   It creates a new history entry object containing the `timestamp` and the `data` for the squat.
    *   It adds this new entry to the front of an array, maintains a maximum of 3 entries, and saves the entire array to `localStorage` as a JSON string.
    *   It then calls `updateHistoryCharts` to refresh the UI.
*   **`loadHistory()`:** Called during `initCharts`, this function retrieves the data from `localStorage` and calls `updateHistoryCharts` to populate the history graphs on page load.
*   **`updateHistoryCharts()`:** Iterates through the history data and updates the corresponding chart and its title with the squat data and formatted timestamp.

## 4. PWA and Offline Support

*   **`manifest.json`:** Provides the metadata for the application to be "installable" on a home screen. It defines the app's name, icons, and `display: standalone` property to hide the browser UI.
*   **`sw.js` (Service Worker):** The service worker is currently in a "no-op" or "pass-through" state. Previous attempts at caching caused issues with stale code being served. The current minimal implementation ensures the latest code is always fetched while still allowing the app to be installable (a service worker is a PWA requirement).

## 5. Future Development Areas

*   **Improve Pose Detection Accuracy:**
    *   Experiment with different PoseNet model parameters (e.g., `inputResolution`, `multiplier`).
    *   Consider switching to a more modern model like MoveNet, which might offer better accuracy and performance.
*   **Enhance Squat Analysis:**
    *   Detect other joints to provide more detailed feedback on form (e.g., back angle, chest position).
    *   Implement logic to detect different types of squats (e.g., front squat, overhead squat).
*   **Improve User Feedback:**
    *   Provide real-time audio or visual cues for good and bad form.
    *   Create a more detailed post-workout summary.
*   **UI/UX Improvements:**
    *   Refactor the code into separate JavaScript modules for better organization and maintainability.
    *   Add a settings panel to allow users to adjust parameters like `minConfidence` or squat thresholds.
*   **Robust Service Worker:**
    *   Implement a more sophisticated caching strategy (e.g., "stale-while-revalidate") in the service worker to provide a true offline experience without serving stale code.

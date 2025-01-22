# Workflow Management Backend

This project follows the **Model-View-Controller (MVC)** architecture to ensure clean separation of concerns and scalability.

## MVC Architecture

- **Model**: Defines the data structure and interacts with the database (e.g., Mongoose schemas).
- **View**: Represents the data sent to the client (JSON responses in this backend).
- **Controller**: Handles business logic, processes requests, and communicates between models and views.

## Directory Structure

- **`config/`**: Configuration files (e.g., database connection setup).
- **`controllers/`**: Handles request logic (e.g., login, tasks, chat).
- **`middleware/`**: Reusable middleware (e.g., authentication, error handling).
- **`models/`**: Mongoose schemas for database structure (e.g., User, Task, Chat).
- **`routes/`**: API routes mapped to controllers.
- **`sockets/`**: WebSocket handlers for real-time features (e.g., chat).
- **`app.js`**: Configures the Express app with middleware and routes.
- **`server.js`**: Starts the server and handles WebSocket integration.
- **`.env`**: Stores environment variables like `MONGO_URI` and `JWT_SECRET`.

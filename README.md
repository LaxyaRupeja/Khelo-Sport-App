# Khelo-Sport-App

Khelo-Sport-App is a web application that allows users to organize and participate in various events.

## Features

- Create new events with a title, description, timings, and player limit.
- View a list of all events, including their details and participants.
- Request to join an event as a player.
- Accept or reject player requests as an event organizer.
- View and manage requests for each event in a modal.
- Responsive design for seamless user experience on different devices.
- Integration with authentication and token-based authorization for secure access.

## Technologies Used

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

## Installation

1. Clone the repository: `git clone [repository_url]`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create one `.env`.
   - Add the environment variables with your configuration MONGO_DB_URL and JWT_SECRET_KEY.
4. Start the server: `npm run start`
5. Access the application at: `http://localhost:8080`

## Usage

1. Visit the application in your web browser.
2. Browse the available events on the homepage.
3. Create a new event using the "Create New Event" button.
4. Request to join an event by clicking the "Join" button on an event card.
5. As an event organizer, view and manage player requests by clicking the "View Requests" button on an event card.
6. Accept or reject player requests using the corresponding buttons in the modal.
7. Interact with other features based on your requirements.



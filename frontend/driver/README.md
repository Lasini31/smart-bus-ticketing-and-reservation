Smart Bus Ticketing - Driver Dashboard
A modern, responsive React-based web application designed for bus drivers to easily manage their daily schedules, track active shifts, and monitor passenger boarding in real-time.

🚀 Features
Interactive Shift Schedule: View upcoming, active, completed, and missed (incompleted) bus turns for the day.
Active Turn Management: Start a turn to see a real-time list of passengers, their assigned seats, and their boarding stops.
Passenger Tracking: Seamlessly check off passengers as they board the bus.
Completed Journey Statistics: Review key metrics for completed routes, including total distance, passenger counts, and duration.
Driver Profile: Access detailed driver information, experience, and system status in a clean, modern modal.
API-Ready Architecture: Built with a dedicated API service layer (driverApi.js) ready to connect to a live backend, currently utilizing simulated network latency for a realistic frontend experience.
Modern UI/UX: Features smooth micro-animations, glassmorphic navigation headers, tailored typography (Inter font), and premium styling using Tailwind CSS and Framer Motion.
🛠️ Technology Stack
Frontend Framework: React (built with Vite)
Styling: Tailwind CSS
UI Components: Shadcn UI (Radix UI primitives)
Animations: Framer Motion
Icons: Lucide React
📂 Project Structure
text

src/
├── api/
│   └── driverApi.js             # Mock API service layer mirroring backend contracts
├── app/
│   ├── components/
│   │   ├── ui/                  # Reusable Shadcn UI components (Buttons, Cards, Dialogs)
│   │   ├── ActiveTurn.jsx       # Dashboard view for managing ongoing routes
│   │   ├── CompletedTurnDetails.jsx # Statistics view for finished routes
│   │   └── DriverProfile.jsx    # Driver information modal
│   └── App.jsx                  # Main application layout and state manager
├── styles/
│   └── theme.css                # Global CSS variables and font imports
└── main.jsx                     # Application entry point
⚙️ Getting Started
Prerequisites
Make sure you have Node.js installed on your machine.

Installation
Clone the repository and navigate to the project folder.
Install the dependencies:
bash

npm install
Start the development server:
bash

npm run dev
Open your browser and visit http://localhost:5173 (or the port specified in your terminal).
📡 API Integration
The application's data flow is structured around a Shared API Contract. The src/api/driverApi.js file currently acts as a mock backend service. It accurately simulates network requests (startShift, endShift, getPassengers, getDriverProfile) with 500ms latency to test frontend loading states and asynchronous UI updates. Once the real backend is deployed, simply update the URLs in this file to connect the dashboard to live data.

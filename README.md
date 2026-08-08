# Help Me Buddy 🤝
> Connecting Local Skills with Local Needs

Help Me Buddy is a universal, AI-powered hyperlocal service marketplace designed to bridge the gap between skilled individuals (freelancers, workers, small businesses) and local customers in need of immediate services.

---

## 🚀 Key Features

1. AI-Based Understanding: Integrates Gemini AI to analyze user-described issues and automatically recommend matching service categories and local providers.

2. Hyperlocal Matching: Displays verified local service providers instantly based on proximity.

3. One-Click Booking & Routing: Streamlined user-to-provider booking workflow with real-time status tracking and direct communication options.

4. Emergency Mode: Prioritizes urgent service requests for immediate assistance.

5. Rating & Trust System: Built-in verification and user feedback to ensure community reliability.

---

## 🛠️ Tech Stack

• Frontend: React.js, HTML5, CSS3, JavaScript

• Backend: Node.js, Express.js (REST API Architecture, JWT Authentication)

• Database: MongoDB (Mongoose Schemas for Users, Providers, Categories, Bookings)

• AI & Integrations: Gemini AI API Integration

• Deployment: Render

---

## ⚙️ Project Architecture & Workflow

1. User Enters Problem: The user describes their service need in natural text.
3. AI Processing: Gemini AI analyzes the prompt and categorizes the required service.
4. Provider Matching: The application queries MongoDB for verified nearby service providers matching the category.
5. Connection & Booking: The user reviews ratings, initiates a booking request, and tracks status updates in real time.

---

## 🔧 Installation & Local Setup

### Prerequisites
• Node.js (v18 or higher)
• npm or yarn
• MongoDB instance (Local or MongoDB Atlas)

### Steps

1. Clone the repository:
   git clone https://github.com/MohammedQadeer2/help_me_Buddy.git
   cd help_me_Buddy

2. Install backend dependencies:
   cd backend
   npm install

3. Install frontend dependencies:
   cd ../frontend
   npm install

4. Configure Environment Variables:
   Create a .env file in the backend folder and add:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key

5. Run the application:
   • Backend: npm run dev
   • Frontend: npm start

---

## 👥 Team & Acknowledgments

• Developed by: Team THE BLUE OCEAN
• Event: HACKFORGE 2.0

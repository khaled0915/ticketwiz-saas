# 🎫 TicketWiz - AI-Powered Support SaaS

TicketWiz is a Multi-Tenant B2B SaaS platform that automates customer support triage using Artificial Intelligence. It analyzes incoming support tickets in real-time to detect sentiment (Angry/Happy), assign priority (High/Low), and suggest solutions to agents.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_MySQL-blue)

## 🚀 Key Features

*   **🤖 AI Autopilot:** Integrates **Google Gemini 2.0** to read tickets and generate instant JSON analysis.
*   **📊 Smart Triage:** Automatically flags "High Priority" tickets based on context (e.g., "Refund", "Fire", "Server Down").
*   **❤️ Sentiment Detection:** Visualizes customer emotions (Red = Angry, Green = Happy) to help agents respond appropriately.
*   **🏢 Multi-Tenancy:** Single database supporting multiple isolated organizations (SaaS Architecture).
*   **🔐 Secure Auth:** JWT-based authentication with Bcrypt password hashing.

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS, Vite, Axios, React Router.
*   **Backend:** Node.js, Express.js.
*   **Database:** MySQL (Relational Schema).
*   **AI Engine:** Google Gemini API (v2 Flash).
*   **Tools:** Thunder Client, Git.

## 📸 Screenshots



## 📦 How to Run

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/khaled0915/ticketwiz-saas.git
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    ```
    
    Create a `.env` file in the server folder:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=ticketwiz
    JWT_SECRET=your_jwt_secret_key
    GEMINI_API_KEY=your_gemini_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```
    
    Run the server:
    ```bash
    npm start
    ```

3.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Setup Database:**
    - Import `server/schema.sql` into MySQL to create the database and tables.

## 📁 Project Structure

```
ticketwiz-saas/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/          # Login, Dashboard components
│   │   ├── api.js          # Axios instance
│   │   └── App.jsx         # React Router setup
│   └── package.json
├── server/                 # Express Backend
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   ├── openai.js       # OpenAI client
│   │   └── gemini.js       # Google Gemini client
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js   # Login, Register
│   │   └── ticketRoutes.js # Ticket CRUD with AI
│   ├── schema.sql          # Database schema
│   └── package.json
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register-saas` | Register new organization + admin |
| POST | `/login` | Login user |

### Ticket Routes (`/api/tickets`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create ticket with AI analysis |

## 🧠 AI Analysis

When a ticket is created, the AI automatically analyzes:
- **Sentiment Score:** Float from -1 (angry) to 1 (happy)
- **Priority:** Automatically assigned as `high`, `medium`, or `low`



## 👤 Author

**Khaled Saifullah**
- GitHub: [@khaled0915](https://github.com/khaled0915)

# 🎫 TicketWiz - AI-Powered Support SaaS

TicketWiz is a Multi-Tenant B2B SaaS platform that automates customer support triage using Artificial Intelligence. It analyzes incoming support tickets in real-time to detect sentiment (Angry/Happy), assign priority (High/Low), and suggest solutions to agents.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_MySQL-blue)

## 🚀 Key Features

*   **🤖 AI Autopilot:** Integrates **Google Gemini (Flash Model)** to read tickets and generate instant JSON analysis.
*   **📊 Smart Triage:** Automatically flags "High Priority" tickets based on context (e.g., "Refund", "Fire", "Server Down").
*   **❤️ Sentiment Detection:** Visualizes customer emotions (Red = Angry, Green = Happy) to help agents respond appropriately.
*   **📢 Public Support Portal:** Dedicated page for external customers to submit tickets without logging in.
*   **⚡ Real-Time Dashboard:** Auto-refreshing agent interface to see tickets instantly as they arrive.
*   **🏢 Multi-Tenancy:** Single database supporting multiple isolated organizations (SaaS Architecture).
*   **🔐 Secure Auth:** JWT-based authentication with Bcrypt password hashing.

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS, Vite, Axios, React Router.
*   **Backend:** Node.js, Express.js.
*   **Database:** MySQL (Relational Schema).
*   **AI Engine:** Google Gemini API.
*   **Tools:** Thunder Client, Git.



## 📦 How to Run

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/khaled0915/ticketwiz-saas.git
    ```

2.  **Setup Database:**
    - Create a MySQL database named `ticketwiz_saas`.
    - Import the `server/schema.sql` file into MySQL to create tables (organizations, users, tickets).

3.  **Setup Backend:**
    ```bash
    cd server
    npm install
    ```
    
    Create a `.env` file in the server folder:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=ticketwiz_saas
    JWT_SECRET=your_super_secret_key_here
    GEMINI_API_KEY=your_google_gemini_key_here
    ```
    
    Run the server:
    ```bash
    npm start
    ```

4.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
    Access the app at `http://localhost:5173`.



## 🔑 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register-saas` | Register new organization + admin |
| POST | `/login` | Login user |

### Ticket Routes (`/api/tickets`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/` | Fetch all tickets for logged-in organization |
| POST | `/create` | Create ticket (Internal Agent) |
| POST | `/public/:orgId` | Create ticket (Public Customer) - No Auth |
| PUT  | `/:id/status` | Mark ticket as Resolved |

## 🧠 AI Analysis

When a ticket is created, the AI automatically analyzes the text and generates:
- **Sentiment Score:** Float from -1 (angry) to 1 (happy).
- **Priority:** Automatically assigned as `high`, `medium`, or `low`.
- **Suggested Solution:** A short, actionable advice string for the agent.

## 👤 Author

**Khaled Saifullah**
- GitHub: [@khaled0915](https://github.com/khaled0915)
# Modern Full-Stack Personal Portfolio

A modern, responsive, and performance-optimized personal portfolio web application built with a vanilla frontend, an Express.js backend, and a MongoDB database.

---

## 🌟 Key Features

### 1. Multi-Page Architecture
- **Home (`index.html`):** Hero section, developer profile summary, quick skill pills, featured projects preview, and clean call-to-actions.
- **About (`about.html`):** Comprehensive biography, philosophy, stats metrics, and education/timeline.
- **Skills (`skills.html`):** Categorized technical proficiencies (Frontend, Backend, Database, DevOps & Tools).
- **Projects (`projects.html`):** Interactive project showcase with live discovery.
- **Contact (`contact.html`):** Interactive contact form with client/server validation, bot honeypot protection, and database persistence.

### 2. Advanced Project Discovery
- **Live Search:** Real-time debounced search by project title and description.
- **Dynamic Category & Technology Filtering:** Populated dynamically via `GET /api/projects/meta/technologies`.
- **Multi-criteria Sorting:** Sort by Featured First, Newest, or Alphabetical (A-Z).
- **Graceful States:** Loading skeleton placeholders and custom empty-state fallbacks.

### 3. Dark & Light Theme
- Seamless theme switching via header toggle button.
- CSS custom properties (`[data-theme="dark"]`) across all cards, navigation, forms, and footers.
- Persistent state using `localStorage`.
- Automatic fallback to OS preference via `prefers-color-scheme`.
- Zero FOUC (flash of unstyled content) via early inline theme resolution.

### 4. Spam-Protected Contact System
- **Honeypot Trap:** Hidden field (`hp_field`) catches bots and silently discards spam without database clutter.
- **Rate Limiting:** Protects `/api/contact` against spam bursts using `express-rate-limit`.
- **Server Validation:** Sanitize and validate names, email format (regex), subjects, and content.
- **Persistence:** Real human messages are safely stored in MongoDB (`Contact` collection).

### 5. Privacy-Conscious Analytics
- Ingests pageviews (`POST /api/analytics/pageview`) and project demo clicks (`POST /api/analytics/click`).
- Aggregates anonymous data without tracking raw IP addresses, user credentials, or personal identifiers.
- Private statistics endpoint (`GET /api/analytics/stats`) guarded by `x-admin-key` authentication.

### 6. Accessibility & Performance
- Full keyboard navigation with distinct `:focus-visible` outline rings.
- Respects `prefers-reduced-motion: reduce`.
- Responsive floating Scroll-to-Top action.
- Valid downloadable PDF resume (`resume.pdf`).
- Zero external frontend framework overhead (no React/Vue/Angular bloat).

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, Vanilla CSS3 (Custom Design System), Vanilla JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Security & Protection:** `express-rate-limit`, `cors`, `dotenv`

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_db
   FRONTEND_URL=http://localhost:5000
   ADMIN_API_KEY=portfolio_admin_secret_2026
   ```

4. **Seed Database with Sample Data:**
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm start
   # or for auto-reload during development:
   npm run dev
   ```

6. **View the Application:**
   Open [http://localhost:5000](http://localhost:5000) in your web browser.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Public | Fetch portfolio bio & contact info |
| `GET` | `/api/skills` | Public | Fetch technical skills list |
| `GET` | `/api/projects` | Public | Fetch projects (supports `?search=`, `?category=`, `?tech=`, `?sort=`) |
| `GET` | `/api/projects/meta/technologies` | Public | Fetch all unique technology tags across projects |
| `POST` | `/api/contact` | Public (Rate-limited) | Submit contact message (with bot honeypot trap) |
| `POST` | `/api/analytics/pageview` | Public | Record anonymous aggregate page view |
| `POST` | `/api/analytics/click` | Public | Record anonymous project link click |
| `GET` | `/api/analytics/stats` | Private (`x-admin-key`) | Fetch aggregate views, clicks, and distribution metrics |

---

## 🧪 Testing

Run the feature verification test script:
```bash
node test_features.js
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

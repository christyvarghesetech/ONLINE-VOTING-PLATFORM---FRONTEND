# Voting System Frontend 🖥️

A modern, responsive web application for online voting, built with raw HTML, Tailwind CSS, and Vanilla JavaScript.

## 🌟 Features
- **Responsive UI:** Built with Tailwind CSS and FontAwesome.
- **Secure Login:** Integration with Google & LinkedIn OAuth.
- **Real-time Interaction:** Connects to FastAPI backend.
- **Admin Panel:** Secured dashboard to view results and manage outcomes.
- **Tie Detection:** Automatic handling of election ties.

## 📂 Project Structure
- `index.html`: Login handling.
- `candidates.html`: Main voting interface.
- `voters.html`: "Thank You" page showing vote confirmation.
- `admin.html`: Admin login flow.
- `results.html`: Election results display.
- `js/`: Contains all logic (`api.js`, `auth.js`, `candidates.js`, etc.).
- `css/`: Custom styles and Tailwind configuration.

## ⚙️ Configuration
The frontend connects to the backend via `js/api.js`.

**For Local Development:**
Edit `js/api.js`:
```javascript
const API_BASE_URL = "http://localhost:8000";
```

**For Production:**
Edit `js/api.js`:
```javascript
const API_BASE_URL = "https://your-backend-url.onrender.com";
```

## 🚀 Deployment (Vercel)
1. Push code to GitHub.
2. Import repository to Vercel.
3. Keep default settings (Root directory is `.`).
4. **Important:** Ensure `vercel.json` is present to handle routing for Single Page App behavior.

## 🔑 Admin Access
- URL: `/admin.html`
- Default Password: `admin123` (Configurable in `js/admin.js`)

## 📝 Usage
1. User logs in.
2. User provides/confirms LinkedIn Profile (required).
3. User selects a candidate.
4. Vote is cast and user is redirected to the confirmation page.
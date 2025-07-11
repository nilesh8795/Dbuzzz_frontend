# Dbuzzz Frontend (React + Vite)

## Setup Instructions

### 🔧 Step 1: Backend Setup (Required First)

```bash
git clone https://github.com/nilesh8795/Dbuzzz_backend.git
cd Dbuzzz_backend
npm install
```

Create a `.env` file inside backend root:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dbuzzz
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=
```

Start the backend server:

```bash
npm start
```

Your backend will run on: `http://localhost:5000`  
(Optional live backend: `https://dbuzzz-backend.onrender.com`)

---

### 🚀 Step 2: Frontend Setup

```bash
git clone https://github.com/nilesh8795/Dbuzzz_frontend.git
cd Dbuzzz_frontend
npm install
```

Create a `.env` file in frontend root:

```env
# For local backend
# VITE_API_URL=http://localhost:5000/api

# For hosted backend
VITE_API_URL=https://dbuzzz-backend.onrender.com/api
```

Now start the frontend:

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

### 📦 Tech Stack

- React + Vite
- Tailwind CSS
- Redux Toolkit
- Axios
- React Router DOM


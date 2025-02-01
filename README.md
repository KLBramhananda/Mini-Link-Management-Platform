# Mini Link Management Platform

## 📌 Overview
A **Mini Link Management Platform** that allows users to **shorten, manage, and analyze** URLs efficiently. Users can create short URLs, track clicks, and manage their accounts seamlessly.

## ✨ Features
- 🔗 **URL Shortening**: Convert long URLs into short, unique links.
- ⏳ **Expiration Dates**: Set expiration dates for links.
- 🔑 **User Authentication**: Secure **registration and login** with email and password.
- 🛠 **User Management**:
  - Update profile (name & email).
  - Secure password hashing.
  - Delete account (removes all associated links and data).
- 📊 **Dashboard**:
  - View **original and shortened URLs**.
  - **Click analytics** (timestamps, IP, browser, OS details).
  - **Edit and delete** links.
- 📈 **Analytics**:
  - Device type (mobile, desktop, tablet).
  - Browser details.
- 📱 **Responsive Design**: Works on both desktop and mobile devices.
- 📃 **Pagination**: Implemented in Links and Analytics.

## 🏗 Tech Stack
### Frontend:
- **React** (with Vanilla CSS)
### Backend:
- **Node.js** with **Express**
- **MongoDB** (for database storage)
### Hosting:
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Heroku

## 🚀 Live Demo
🔗 [Live Demo](https://bramha-kl-mini-link-management-app.vercel.app/signup)

## 🛠 Setup Instructions
### Prerequisites:
- **Node.js** installed
- **MongoDB** (Local or Atlas connection)

### Clone the Repository
```sh
 git clone (https://bramha-kl-mini-link-management-app.vercel.app/signup)
 cd frontend
```

### Backend Setup
```sh
 cd backend
 npm install
 npm start
```
Create a **.env** file in the `backend` folder with:
```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```

## 📝 Features Implemented
- [x] User Authentication
- [x] URL Shortening
- [x] Expiration Dates
- [x] Click Analytics
- [x] Link Management
- [x] Dashboard with Pagination
- [x] Responsive UI

## 👤 Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `password123`

## 📜 License
This project is licensed under the **MIT License**.

## 💡 Future Enhancements
- 🔒 **OAuth (Google, GitHub) Authentication**
- 📧 **Email Notifications for Expiring Links**
- 📈 **Advanced Link Analytics**

## 🤝 Contributing
Contributions are welcome! Feel free to fork and submit a PR.

## 📬 Contact
For any queries, reach out via **[bramha.kl.r21en803@gmail.com]**.

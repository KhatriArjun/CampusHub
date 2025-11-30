# CampusHub Backend

CampusHub Backend is a Node.js and Express-based server designed to handle authentication, assignment processing, OTP verification, and various backend utilities for the CampusHub platform. It connects seamlessly with MongoDB Atlas and uses Nodemailer + Ethereal for development-time email previews.

---

## 🚀 Features

- JWT-based authentication
- OTP verification using Nodemailer (Ethereal test SMTP)
- MongoDB Atlas integration
- Clean REST API structure
- Modular and maintainable project architecture
- Secure password hashing using bcrypt

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **Nodemailer**
- **bcrypt**
- **JSON Web Tokens (JWT)**

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clonehttps://github.com/KhatriArjun/CampusHub.git
cd CampusHub
```

### 2. Install Dependency

```bash
npm install
```

### 3. Environment Variables

Create a .env file inside the project root and add:

```bash
PORT=8080
Username=campushub4u
Password=CampusHub123
secretKey="itis@secretkeyforproject"
```

## ✉️ OTP Email Configuration (Ethereal)

The project uses **Ethereal** — a fake SMTP email service used for testing email features without sending real emails.

### Steps to Configure Ethereal:

#### **1. Create an Ethereal Account**

- Visit the official Ethereal website:  
  **https://ethereal.email/**
- Click **"Create Ethereal Account"**.
- Copy the generated:
  - Ethereal email address
  - SMTP password
  - SMTP host & port

These credentials will be used in the backend.

---

#### **2. Update OTP Email Configuration**

Open the file:

utils/otpVerification.js

Inside the Nodemailer transporter configuration, replace the **auth** section with your Ethereal credentials:

```js
auth: {
  user: "YOUR_ETHEREAL_EMAIL",
  pass: "YOUR_ETHEREAL_PASSWORD",
}

```

## 3️⃣ View OTP Emails

Whenever an OTP is sent:

1. Log in to your **Ethereal** account on the website: [https://ethereal.email/](https://ethereal.email/)
2. Click the **"Open Mailbox"** button.
3. You will see the received OTP email instantly.
4. Open and preview the full email directly within Ethereal’s inbox.

## 4 Running the Server

Start the backend server using:

```bash
npm start

```

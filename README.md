# 💊 Pharm-Easy

**Pharm-Easy** is a web-based pharmacy locator and medicine search system built with **Next.js 15**, **Prisma**, and **NextAuth**.  
It helps users find the **nearest pharmacies**, search for **available medicines**, and view **AI-generated medicine information** — all from one dashboard.

---

## 🚀 Features

### 🧍 User Features
- 🔐 **Authentication (Login / Signup)** using secure credential-based login.
- 📍 **GPS-based location detection** to find nearby pharmacies.
- 💊 **Medicine Search** — enter any medicine name to find pharmacies that have it.
- 🧠 **AI Medicine Info** — get detailed, AI-generated information about each medicine.
- ⭐ **Most Popular Medicines** — displays the top 5 most-searched medicines.
- 🗺️ **Interactive Map** powered by Leaflet and OpenStreetMap (Free & Open Source).
- 🧾 **Account Management**
  - Update profile (name, email, or password)
  - Permanently delete account
- 🚪 **Logout** anytime.

---

### 🧑‍💼 Admin Features
- 🔒 Secure admin access only.
- 🧍‍♂️ **Manage Users** — view list of all registered users.
- 📜 **Activity Logs** — automatically records:
  - User registration
  - Successful login
  - Account updates
  - Account deletions
- 🧭 Simple dashboard navigation between *Users* and *Logs* pages.

---

## 🏗️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | Next.js 15 (App Router) |
| Backend | Node.js / API Routes |
| Database | Prisma ORM + SQLite / PostgreSQL |
| Authentication | NextAuth.js (Credential Provider) |
| Styling | Tailwind CSS + ShadCN UI |
| Maps | Leaflet + OpenStreetMap |
| Deployment | Vercel |

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Bettachin/pharm-easy.git
cd pharm-easy

# Medi-Mitra (Virtual Hospital System)

Medi-Mitra is a web-based healthcare helper built as a T.Y. B.Sc. Computer Science project. A logged-in user can find doctors and hospitals, book appointments and hospital visits, browse medicines and fill a cart, look up blood, platelet and sperm banks, and describe symptoms to a rule-based emergency chatbot that suggests a possible condition, a basic cure and the type of specialist to visit.

> The chatbot is a simple keyword matcher for learning purposes. It is **not** a medical diagnosis tool. Always consult a doctor.

## Features (what the code actually does)

| Feature | Details |
|---|---|
| Signup / Login / Logout | Email + password form. Accounts are kept in the browser's `localStorage` (demo-level, no server-side auth) |
| Find Doctors | Search by name or hospital, filter by specialty and location, book an appointment (patient name, phone, date, time) |
| Appointments | View and cancel booked appointments (stored in `localStorage`) |
| Hospitals | Search by name or address, filter by city and type, book a hospital visit |
| Hospital Bookings | View and cancel hospital visits (stored in `localStorage`) |
| Medicines | Search, filter by category, view details, add to cart |
| Cart | Change quantity, remove items, enter name / phone / address and place order (the order is confirmed on screen only; it is not stored or sent anywhere) |
| Blood, Platelet, Sperm Banks | Directory pages with search and filters |
| Emergency Assistant | Risk level (LOW / MEDIUM / CRITICAL) from keywords, symptom-to-disease matching over 49 diseases, suggested cure, specialist type, voice input, chat saved in `localStorage` |
| Theme | Light / dark toggle and sidebar navigation |

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite 7, Tailwind CSS 3, shadcn/ui (Radix UI), wouter (routing), TanStack React Query, lucide-react
- **Main server:** Node.js, Express 5 (serves the REST API and the Vite app)
- **Chatbot server:** Python, Flask, flask-cors
- **Data:** Seed data in `client/database/*.ts`, held in memory by `MemStorage` (`server/storage.ts`). Data added on the server side (chat history) is lost when the server restarts.
- **Database schema:** `shared/schema.ts` defines PostgreSQL tables with Drizzle ORM. The running app does not connect to PostgreSQL; the schema is used for types and for `npm run db:push`.

## Folder Structure

```
Medi-Mitra/
├── backend/            Flask chatbot: app.py, chatbot_logic.py, hospital_logic.py, medical_data.py
├── client/
│   ├── database/       Seed data: doctors, hospitals, bloodBanks, spermBanks, plateletBanks, medicines
│   ├── public/         favicon
│   └── src/
│       ├── auth/       LoginForm, SignupForm, LogoutButton, Auth
│       ├── components/ ChatBot, app-sidebar, theme provider/toggle, ui/ (shadcn components)
│       ├── context/    CartContext, AppointmentContext, HospitalBookingContext
│       ├── hooks/      use-mobile, use-toast
│       ├── lib/        queryClient, utils
│       └── pages/      home, doctors, hospitals, medicines, cart, appointments,
│                       HospitalBookingsPage, blood-banks, platelet-banks, sperm-banks,
│                       emergency, not-found
├── server/             Express: index.ts, routes.ts, storage.ts, vite.ts, static.ts
├── shared/             schema.ts and models/chat.ts (Drizzle tables and types)
├── script/build.ts     Production build script
├── package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, postcss.config.js
├── drizzle.config.ts, components.json
```

## Installation and Running

Requirements: Node.js 20.19+ (or 22.12+) and Python 3.

1. Clone the repository
   ```
   git clone https://github.com/MRAADARSH-glitch/Medi-Mitra.git
   cd Medi-Mitra
   ```
2. Install Node packages
   ```
   npm install
   ```
3. Install Python packages for the chatbot
   ```
   pip install flask flask-cors
   ```
4. Start the Express + Vite server on a port **other than 5000**, because the Flask chatbot uses port 5000
   ```
   PORT=3000 npm run dev            # Linux / macOS
   set PORT=3000 && npm run dev     # Windows (cmd)
   ```
5. In a second terminal start the chatbot
   ```
   cd backend
   python app.py
   ```
6. Open `http://localhost:3000` in the browser, sign up, and start using the app.

Environment variables: none are needed to run the app. `DATABASE_URL` is only needed for `npm run db:push` (Drizzle schema push to PostgreSQL).

## API Endpoints

Express (`server/routes.ts`):

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/doctors`, `/api/doctors/:id` | List doctors / one doctor |
| GET | `/api/hospitals`, `/api/hospitals/:id` | List hospitals / one hospital |
| GET | `/api/blood-banks` | List blood banks |
| GET | `/api/medicines` | List medicines |
| POST | `/api/emergency/chat` | Keyword-based emergency reply (stores messages in memory) |
| GET | `/api/emergency/chat/:sessionId` | Chat history for a session |

Flask (`backend/app.py`, port 5000):

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/emergency/chat` | Body `{ "message": "..." }`, returns `{ "reply": "..." }` with disease, cure and specialist. The Emergency page uses this endpoint. |

## Seed Data

6 doctors, 6 hospitals, 14 blood banks, 6 sperm banks, 5 platelet banks, 31 medicines (all Mumbai, Maharashtra) and 49 diseases in the chatbot dataset.

## Known Limitations

- Login accounts and passwords are kept in plain form in browser `localStorage`; there is no server-side authentication.
- Appointments, hospital visits, cart and chat are saved only in the browser.
- Placing a medicine order only shows a confirmation; there is no payment, order record or tracking.
- There are no API routes for sperm banks and platelet banks, and `/api/hospitals/emergency` is shadowed by `/api/hospitals/:id`; these pages and routes use what the code currently provides.
- The Express server has its own simple emergency chat route, but the Emergency page calls the Flask chatbot.
- Prices are shown with a `$` sign although the seed data is in rupees.

## Future Improvements

- Connect the app to PostgreSQL through the existing Drizzle schema
- Secure login with hashed passwords and sessions
- Payment gateway and order tracking for medicines
- Appointment, delivery and emergency notifications
- Location-based hospital and bank search using the stored latitude and longitude
- Real-time chat with doctors
- A smarter chatbot (machine learning or an AI service) for better symptom detection
- Add screenshots of each page to this README

# 🩺 MediGuide

> **"Your Health, Our Reminder."**  
> *Smart medical guidance and timely medication reminders, all in one place*

---

## 🌟 Overview & Merged Architecture

MediGuide is a unified healthcare and medication management platform merging the educational awareness system of **MEDI GUIDE** with the comprehensive medication reminders, pharmacy store, shopping cart, and doctor prescription optical scanner of **NS Medical Remainder** into **one single, cohesive, duplicate-free codebase**.

---

## 📁 Unified Project Structure

Every single file extension from both projects (`.html`, `.css`, `.js`, `.java`, `.txt`, `.bat`, `.md`) is preserved, unified, and functional:

```text
MediGuide/
├── 🌐 index.html        (Main Portal: Health Guides, Store, Reminders, Orders, Scanner, Profile)
├── 🔑 login.html        (Dedicated Patient & Doctor Login Page with 6-Digit Email OTP Verification)
├── 🎨 style.css         (Unified Theme: Medical Colors, Responsive Cards, Viewfinder Laser Animation)
├── ⚡ app.js            (Client Engine: Web Audio Synthesizer, 24 Guides, Pharmacy, Scanner, Cart)
├── ☕ MediGuide.java    (All-in-One Java Server on Port 3000, MySQL Database Bridge & Console CLI)
├── 🗄️ schema.sql        (MySQL Relational Database Schema: users, feedback, reminders, prescriptions)
├── 🚀 run.bat           (1-Click Launcher: Compiles Java, Starts Server, Opens Browser & Console)
├── 📄 users_database.txt (Persistent secure user registration storage)
├── 📄 feedback_log.txt  (Persistent user ratings and feedback comments)
└── 📖 README.md         (Comprehensive Platform Documentation)
```

---

## 🔑 Key Features Merged Across Both Projects

### 1. Single Unified Login & Profile Pages
- **One Login Page (`login.html` & `#login`)**:
  - Secure Patient Portal Authentication with input sanitization.
  - **Strict Email Verification**: Validates standard RFC email formats (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`).
  - **Rejection of Wrong / Improper Content**: Rejects script injections (`<script>`), SQL commands, prohibited symbols, and profanity with instant error alerts.
  - **6-Digit OTP Email Verification**: Generates a secure 6-digit verification code before registering and activating accounts.
  - **1-Click Demo Login**: Instant login option for Dr. Sashank Sunny.
- **One User Profile Page (`#profile`)**:
  - Displays user identity, verified email badge (`✔ Email Verified`), active session time, blood group, allergies, adherence score (98%), active reminder counts, order history, and feedback modal.

### 2. Doctor Prescription Scanner Feature
- **Represented at Both Corners**:
  - **Top-Left Corner**: Beside the brand logo (`📷 Scan Prescription`).
  - **Top-Right Corner**: Beside header action buttons with a cyan-teal gradient (`📷 Scan Rx`).
- **Interactive Viewfinder & Capture Showcase**:
  - Optical targeting framing brackets (`⌜ ⌝ ⌞ ⌟`).
  - Live webcam toggle (`getUserMedia`) or custom document file upload (`.jpg`, `.png`, `.pdf`).
  - Prescription Sheet preview with doctor signature (Dr. Sarah Jenkins, MD, License #48291).
  - **"📸 Take Prescription Scan"**: Activates dynamic laser scanline animation and frequency beep.
  - **1-Click Conversion**: Extracted medicines (*Amoxicillin 500mg*, *Paracetamol 650mg*, *Pantoprazole 40mg*) can be added to **⏰ Active Reminders** or **🛒 Shopping Cart** with a single click.

### 3. Medical Knowledge Guide (4 Categories)
- **Diseases**: Fever, Headache, Common Cold, Malaria, Dengue, Diabetes, Asthma, Hypertension.
- **Symptoms**: Persistent Cough, Chronic Fatigue, Severe Nausea, Acute Dizziness.
- **Phobias**: Claustrophobia, Acrophobia, Arachnophobia, Social Phobia, Aerophobia, Aquaphobia.
- **Viruses**: Influenza Virus, Coronavirus, Dengue Virus, Norovirus, Rabies Virus, Rhinovirus.
- Includes Causes & Reasons, Preventions & Care, Safe Medicine Availability, Clinical Doctor Consultation Guidance, and verified external medical pharmacy links (Apollo Pharmacy, Tata 1mg, Practo, Netmeds, Govt Health Portal).

### 4. Pharmacy Store, Reminders & Audio Beeps
- Real-time stock status with automated low-stock warnings.
- **Audible Synthesized Reminder Beeps**: Synthesizes medical alert beeps using Web Audio API (frequencies 880Hz, 1046Hz, 1318Hz) for scheduled dosages and reorder thresholds.
- Shopping cart with badge counter, item management, and checkout order generation.

### 5. Owner / Admin Portal
- Protected with passcode `sashank_admin_2026`.
- Inspects real-time registered users from `users_database.txt` and user feedback ratings from `feedback_log.txt`.

---

## ☕ Core Java Concepts in `backend/MediGuideApp.java`

1. **Objects & Classes**: Encapsulated `HealthTopic`, `Medicine`, `Reminder`, and `User` models.
2. **Input / Output (I/O)**: `Scanner(System.in)`, `System.out.printf`, and audio beeps via `Toolkit.getDefaultToolkit().beep()`.
3. **Decision Making**: `if-else` stock checks (`isLowStock()`) and email regex validation.
4. **Loops**: `while(running)` interactive menu loop, and `for` loops across catalogs and active reminders.
5. **Switch, Break, Continue**: Multi-branch menu selection with `switch`, `continue` for category skipping, and `break` for loop termination.

---

## 🚀 How to Run

1. **1-Click Desktop Launcher**:
   - Double-click `run.bat` inside the `MediGuide` folder.
   - Automatically compiles Java classes, starts the server on port 3000, opens your default web browser, and launches the interactive console!
2. **Direct Web Browser**:
   - Web Application: [http://localhost:3000/](http://localhost:3000/)
   - Login Page: [http://localhost:3000/login.html](http://localhost:3000/login.html)
   - Knowledge Guide: [http://localhost:3000/description.html](http://localhost:3000/description.html)
   - Welcome Greeting: [http://localhost:3000/greeting.html](http://localhost:3000/greeting.html)

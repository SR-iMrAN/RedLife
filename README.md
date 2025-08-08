# 🩸 RedLife — Blood Donation Platform (Frontend)

RedLife is a full-featured blood donation platform developed with React.js. It empowers users to register as blood donors, browse active donation requests, contribute to blog content, and even fund life-saving initiatives — all in a beautifully responsive design.

🔴 Live Site: https://redlife1.web.app/

---

## 🚀 Key Features

- 👥 Role-based access (Donor, Volunteer, Admin)  
- 📝 Blog management with rich-text editor (Jodit)  
- 📊 Dashboard-specific views for each user type  
- 📋 Donor request creation and tracking  
- 🔍 Donor search with filters (blood group, district, upazila)  
- 💬 SweetAlert2 & toast for user feedback  
- 🧾 Funding page with Stripe integration  
- 🔒 Protected routes with JWT (persistent on reload)  
- 🌍 BD Geocode-based district and upazila selector  
- 📱 Fully responsive across mobile, tablet, and desktop  

---

## 🧰 Technologies Used

- React with Vite  
- Tailwind CSS for styling  
- TanStack Query for efficient data fetching  
- React Hook Form for forms  
- Framer Motion for animations  
- Jodit React for blog editing  
- Stripe API for payment integration  
- JWT for authentication and authorization  

---



---

## 📦 Dependencies

- react  
- react-dom  
- vite  
- tailwindcss  
- @tanstack/react-query  
- react-hook-form  
- framer-motion  
- jodit-react  
- stripe  
- sweetalert2  
- jwt-decode  
- axios  
- react-router-dom  

---

## 🛠️ How to Run Locally

Follow these steps to get RedLife running on your local machine:

1. **Clone the repository:**

```bash
git clone https://github.com/SR-iMrAN/RedLife.git
Navigate to the project directory:


**cd redlife-frontend**
Install dependencies:


npm install
Start the development server:


npm run dev
Open your browser and visit:


http://localhost:3000 (Might be different in your case)

---

## 📁

    ███        ▄█    █▄       ▄████████ ███▄▄▄▄      ▄█   ▄█▄      ▄██   ▄    ▄██████▄  ███    █▄  
▀█████████▄   ███    ███     ███    ███ ███▀▀▀██▄   ███ ▄███▀      ███   ██▄ ███    ███ ███    ███ 
   ▀███▀▀██   ███    ███     ███    ███ ███   ███   ███▐██▀        ███▄▄▄███ ███    ███ ███    ███ 
    ███   ▀  ▄███▄▄▄▄███▄▄   ███    ███ ███   ███  ▄█████▀         ▀▀▀▀▀▀███ ███    ███ ███    ███ 
    ███     ▀▀███▀▀▀▀███▀  ▀███████████ ███   ███ ▀▀█████▄         ▄██   ███ ███    ███ ███    ███ 
    ███       ███    ███     ███    ███ ███   ███   ███▐██▄        ███   ███ ███    ███ ███    ███ 
    ███       ███    ███     ███    ███ ███   ███   ███ ▀███▄      ███   ███ ███    ███ ███    ███ 
   ▄████▀     ███    █▀      ███    █▀   ▀█   █▀    ███   ▀█▀       ▀█████▀   ▀██████▀  ████████▀  
                                                    ▀                                              

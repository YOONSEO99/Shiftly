# Shiftly (Manage My Shifts)

A client-side web application designed to help employees track their monthly work hours, calculate wages, and manage shifts across different workplaces.

## 🚀 Features
- **User Authentication:** Secure login and registration with validation (data stored in `localStorage` with a 60-minute session expiry).
- **Shift Management:** Add, edit, and view shifts with details like date, start/end time, hourly wage, and workplace.
- **Wage Calculation:** Automatically calculates the total profit per shift.
- **Search & Filter:** Search shifts by workplace and filter by date range.
- **Data Persistence:** Fully functional without a backend, utilizing browser `localStorage`.
- **Responsive Design:** Mobile-friendly, modern UI layout.

## 🛠️ Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API

## 💻 How to Run
1. Clone this repository:
   ```bash
   git clone <your-repository-url>
   ```
2. Navigate to the project directory.
3. Open `login.html` in your web browser to start the application.

## 📝 Project Structure
- `login.html` / `login.js`: User authentication and session creation.
- `register.html` / `register.js`: New user registration with strict data validation.
- `index.html` / `home.css`: Main dashboard displaying shifts and earnings.
- `style.css`: Global styles and authentication page layouts.

## 👤 Author
**Angela**
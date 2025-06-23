# Air Quality Index (AQI) App

## 🌈 Modern & Responsive Air Quality App

A beautiful, modern, and responsive web app to monitor real-time air quality (AQI) and weather conditions for your location. Built with **Tailwind CSS** for a stunning UI/UX and powered by the **IQAir API**.

---

## ✨ Features
- 📊 **Real-time AQI Data**: Instantly see the latest air quality index for your area.
- 🌡️ **Weather Info**: Temperature, humidity, and wind speed/direction.
- 📍 **Auto Location**: Detects your location automatically.
- 🎨 **Modern UI/UX**: Clean, glassmorphism, animated, and mobile-friendly design with Tailwind CSS.
- ⚠️ **Health Warnings**: Clear status, color-coded badges, and recommendations for each AQI level.
- 🖱️ **Interactive AQI Scale**: Clickable scale with detailed modal info and health tips.

---

## 🖼️ Preview
![Preview Screenshot](preview.png) <!-- Add your screenshot here -->

---

## 🚀 Getting Started

> **No build tools or npm required!**

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/your-username/airquality.git
   # or download ZIP and extract
   ```
2. **Open `index.html`** directly in your browser (Chrome, Edge, Firefox, etc).

3. **Allow Location Access** when prompted for the best experience.

---

## 🔑 API Key Setup
This app uses the [IQAir API](https://www.iqair.com/) for real-time data.
- Replace the `API_KEY` in `assets/js/script.js` with your own key:
  ```js
  const API_KEY = "your_api_key_here";
  ```

---

## 📈 AQI Scale Reference
| AQI Range | Description | Color |
|-----------|-------------|--------|
| 0 - 50    | Good        | 🟢 Green |
| 51 - 100  | Moderate    | 🟡 Yellow |
| 101 - 150 | Unhealthy (Sensitive Groups) | 🟠 Orange |
| 151 - 200 | Unhealthy   | 🔴 Red |
| 201 - 300 | Very Unhealthy | 🟣 Purple |
| 300+      | Hazardous   | ⚫ Brown |

---

## 📱 Mobile Friendly
- 100% responsive, works great on all devices.
- Modern glassmorphism, animated gradients, and color transitions.

---

## 👨‍💻 Developer
Developed by **Haris Ratno Pambudi, S.T**

---

## 📜 License
MIT License

---

## 📬 Contact
For questions or contributions, reach out at **harisratnopambudi@example.com** or create an issue on GitHub.


# Air Quality Index (AQI) App

## 📌 Overview
Air Quality Index (AQI) App is a simple and informative application that provides real-time air quality index data using the **IQAir API**. The app displays AQI levels along with weather conditions such as temperature, humidity, and wind speed, making it easier for users to monitor air quality and take necessary precautions.

## 🚀 Features
- 📊 **Real-time AQI Data**: Displays the latest air quality index for a specific location.
- 🌡️ **Weather Information**: Shows temperature, humidity, and wind speed.
- 📍 **Location-Based Data**: Provides AQI readings for a selected location.
- 🎨 **User-Friendly Interface**: Clean and intuitive design with categorized AQI levels.
- ⚠️ **Health Warnings**: Highlights risks for sensitive groups based on AQI scale.

## 📈 AQI Scale

| AQI Range | Description | Color Code |
|-----------|------------|------------|
| 0 - 50   | Good | 🟢 Green |
| 51 - 100  | Moderate | 🟡 Yellow |
| 101 - 150 | Unhealthy (Sensitive Groups) | 🟠 Orange |
| 151 - 200 | Unhealthy | 🔴 Red |
| 201 - 300 | Very Unhealthy | 🟣 Purple |
| 300+      | Hazardous | ⚫ Black |

## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/airquality.git
   ```
2. Navigate to the project directory:
   ```bash
   cd airquality
   ```
3. Install dependencies:
   ```bash
   npm install  # If using JavaScript/Node.js
   ```
   or
   ```bash
   pip install -r requirements.txt  # If using Python
   ```
4. Set up your **IQAir API Key**:
   - Sign up at [IQAir API](https://www.iqair.com/)
   - Get your API key
   - Create a `.env` file and add:
     ```env
     IQAIR_API_KEY=your_api_key_here
     ```
5. Run the application:
   ```bash
   npm start  # For JavaScript-based projects
   ```
   or
   ```bash
   python app.py  # For Python-based projects
   ```

## 📌 Usage

- Open the application in a browser or mobile device.
- Check the real-time air quality index for your location.
- Take necessary precautions based on AQI levels.

## 👨‍💻 Developer

Developed by **Haris Ratno Pambudi, S.T**

## 📜 License

This project is licensed under the MIT License.

## 📬 Contact

For questions or contributions, feel free to reach out at **harisratnopambudi@example.com** or create an issue on GitHub.


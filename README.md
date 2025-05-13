# 🎨 Nutshell Frontend – Your AI-Powered Budgeting App

![Nutshell Logo](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/logo.png)

**Nutshell** is an **AI-powered budgeting and expense tracking app**, designed with **React Native and Expo** to help users take control of their finances. 

🚀 Built for **DUHacks 4.0**  
🔗 Backend Repo: [BudgetingForAll-backend](https://github.com/hareeshbeecha/BudgetingForAll-backend)  

![Hackathon](https://img.shields.io/badge/Hackathon-DUHacks%204.0-purple)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange)

---

## **📈 Features**
✅ **AI-Powered Expense Categorization** using **GPT-4o**  
✅ **Smart Budgeting & FIRE Planning**  
✅ **Secure Authentication** with Firebase  
✅ **Interactive Insights & Graphs**  
✅ **React Native Bottom Navigation & UI Enhancements**  

---

## **🛠️ Tech Stack**
| **Category**  | **Technology** |
|--------------|--------------|
| 🌐 **Frontend** | React Native, Expo |
| 📈 **State Management** | Context API |
| 🔥 **Authentication** | Firebase Auth |
| 🎨 **UI Components** | React Native Paper, Recharts |

---

## **🚀 Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/hareeshbeecha/BudgetingForAll-ui.git
cd BudgetingForAll-ui
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Setup Environment Variables**
Create a `.env` file inside **`frontend/`** with:
```
FIREBASE_API_KEY=your-firebase-api-key
API_BASE_URL=http://localhost:5001/api  # Update if using deployed backend
```

### **4️⃣ Run the Application**
```sh
npx expo start
```

---

## **📲 Screenshots**
| Home | Expenses | AI Chat |
|------|---------|--------|
| ![Home](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/home-screen.jpeg) | ![Expenses](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/expenses.jpeg) | ![AI Chat](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/ai-chat.jpeg) |

| FIRE Dashboard | FIRE Insights |
|---------------|--------------|
| ![FIRE Dashboard](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/Fire-planner.jpeg) | ![Expense Tracker](https://github.com/hareeshbeecha/BudgetingForAll-ui-main/blob/main/screenshots/add-or-remove.jpeg) |

---

## **🛠️ API Integration**
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/expenses` | Fetch user expenses |
| `POST` | `/expenses` | Add a new expense |
| `POST` | `/ai/categorize` | AI-based categorization |
| `POST` | `/ai/advice` | Get AI financial advice |

📀 **Example Request**
```json
POST /api/ai/categorize
{
  "description": "Uber ride to airport"
}
```

📀 **Example Response**
```json
{
  "category": "Transport"
}
```

---

## **👥 Team**
- **Laxman Bankupalle** – Frontend Lead 💻  
- **Sai Prakash** – Full Stack Developer 🤖  
- **Reethu Bhargavi** – UI/UX Designer 🎨  
- **Hareesh Beecha** – Backend Specialist 🛠️  

📚 **Hackathon Submission Link**: [TBD]  

---

## **🙏 Contributing**
💪 Want to improve Nutshell?  
1. **Fork the repo**  
2. **Create a new branch** (`git checkout -b feature-branch`)  
3. **Commit changes** (`git commit -m "Added new feature"`)  
4. **Push to GitHub** (`git push origin feature-branch`)  
5. **Create a Pull Request** 🎉  

---

## **📩 Contact**
👤 **Beecha Venkata Naga Hareesh**  
📧 [beechahareesh@gmail.com](mailto:beechahareesh@gmail.com)  
💼 LinkedIn: [Hareesh Beecha](https://www.linkedin.com/in/hareeshbeecha/)  

---

🚀 **Made for DUHacks 4.0!** Give us a ⭐ if you like it! 😊🔥

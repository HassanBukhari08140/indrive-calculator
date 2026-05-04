# 🚗 InDrive Profit Calculator

> **A free tool for Pakistani InDrive drivers** — calculate your fuel cost and net profit before accepting any trip.

---

## 📱 What Is This App?

This is a web app that helps InDrive drivers instantly know:

- **Fuel cost** — based on trip distance and your car's fuel average
- **Net profit** — customer fare minus fuel cost
- **Saved cars** — enter your car's average once, use it every time

---

## ✨ Features

- 📍 Enter distance and fare — see profit or loss instantly
- ⛽ Set today's petrol price yourself
- 🚗 Add multiple cars (Alto, Civic, Corolla, or any car)
- ✏️ Edit or delete any car anytime
- 📱 Mobile friendly — feels just like a native app
- 💾 Data is saved locally in your browser

---

## 🚀 Live Demo

> 🔗 **[indrive-calculator.vercel.app](https://indrive-calculator.vercel.app)**  
> *(Update this link after deploying)*

---

## 📲 Use It Like an App on Your Phone

1. Open the link in Chrome
2. Tap the 3-dot menu (top right)
3. Select **"Add to Home Screen"**
4. It will appear on your home screen just like an app ✅

---

## 🛠️ Tech Stack

- **React** (JSX)
- **CSS-in-JS** (inline styles)
- **localStorage** — data is saved in the browser
- **Vercel** — free hosting

---

## 💻 Run Locally (For Developers)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/indrive-calculator.git
cd indrive-calculator

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

---

## 📦 Deploy on Vercel

1. Create an account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Click **Deploy** — done!

---

## 🧮 How Is It Calculated?

```
Fuel Used  = Distance ÷ Car Average (litres)
Fuel Cost  = Fuel Used × Petrol Price per Litre
Net Profit = Customer Fare − Fuel Cost
```

**Example:**
- Distance: 15 km | Alto average: 22 km/l | Fare: Rs. 500 | Petrol: Rs. 278/l
- Fuel Used = 15 ÷ 22 = **0.68 litres**
- Fuel Cost = 0.68 × 278 = **Rs. 190**
- Net Profit = 500 − 190 = **Rs. 310** ✅

---

## 🤝 Contributing

Found a bug? Want a new feature? **Open an issue or submit a pull request!**

Planned features:
- [ ] Return trip option
- [ ] InDrive commission deduction
- [ ] Trip history log
- [ ] Urdu language support

---

## 📄 License

MIT License — Free to use and share. ❤️

---

> **Built by:** Hassan Bukhari 
> **For Pakistani drivers, by a Pakistani driver**

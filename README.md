# 💳 Fake Payment App - Prototype Demo

A beautiful, modern fake payment processing application for prototyping and demonstrations. This app includes a Flask backend API and a polished frontend interface with a realistic payment experience.

## ⚠️ Important Notice

**This is a FAKE payment system designed for prototyping and demonstrations only!**
- No real payments are processed
- No real card validation occurs
- Do not use in production
- Do not enter real payment information 

## ✨ Features

- 🎨 Modern, beautiful UI with gradient design
- 💳 Realistic payment form with card input formatting
- ✅ Form validation and error handling
- 🔄 Loading states and animations
- ✨ Success confirmation with transaction details
- 📅 Schedule payment for later button
- 🧪 Test card numbers for easy testing
- 📱 Fully responsive design
- 🔒 Secure-looking UI elements (fake security badges)

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd /Users/wong.jason/Projects/payment-app-demo
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the server:**
   ```bash
   python app.py
   ```

2. **Open your browser:**
   Navigate to [http://localhost:5000](http://localhost:5000)

3. **Test the payment flow:**
   - Click any test card to auto-fill the form
   - Or manually enter payment details
   - Click "Pay Now" to process the fake payment

## 🧪 Test Card Numbers

The app includes these pre-configured test cards:

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa | `4532 1488 0343 6467` | 12/25 | 123 |
| Mastercard | `5425 2334 3010 9903` | 11/26 | 456 |
| American Express | `3782 822463 10005` | 10/27 | 1234 |

You can click any test card in the sidebar to auto-fill the payment form!

## 📁 Project Structure

```
payment-app-demo/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── static/               # Frontend files
    ├── index.html        # Main payment page
    ├── styles.css        # Styling and animations
    └── script.js         # Frontend logic
```

## 🔌 API Endpoints

### POST `/api/payment`
Process a fake payment

**Request Body:**
```json
{
  "cardNumber": "4532148803436467",
  "cardName": "JOHN DOE",
  "expiryDate": "12/25",
  "cvv": "123",
  "amount": 99.99,
  "currency": "USD"
}
```

**Success Response:**
```json
{
  "success": true,
  "transaction_id": "A1B2C3D4E5F6",
  "amount": 99.99,
  "currency": "USD",
  "timestamp": "2025-11-14T10:30:00.000000"
}
```

### GET `/api/transactions`
Get all transactions (stored in memory)

### GET `/api/transaction/<transaction_id>`
Get details of a specific transaction

### POST `/api/payment/schedule`
Schedule a fake payment for a future time

**Request Body (additional field):**
```json
{
  "scheduled_for": "2026-11-18T10:30:00"
}
```

## 🎯 Features in Detail

### Frontend Features
- **Auto-formatting**: Card numbers, expiry dates, and CVV are automatically formatted as you type
- **Visual Feedback**: Smooth animations and hover effects throughout
- **Error Handling**: User-friendly error messages for validation failures
- **Success Confirmation**: Beautiful success screen with transaction details
- **Scheduled Payments**: Set a future date/time and click "Schedule Payment for Later"
- **Test Cards**: One-click auto-fill for quick testing

### Backend Features
- **RESTful API**: Clean API endpoints for payment processing
- **Validation**: Basic validation of required fields, including positive amount checks
- **Transaction IDs**: Generates unique transaction IDs
- **In-Memory Storage**: Stores transactions for the session

## 🎨 Customization

### Change Colors
Edit the CSS variables in `static/styles.css`:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #10B981;
    --error: #EF4444;
}
```

### Change Port
Edit `app.py` and change the port number:
```python
app.run(debug=True, port=5000)  # Change 5000 to your desired port
```

## 🛠️ Development

### Running in Debug Mode
The app runs in debug mode by default, which includes:
- Auto-reload on file changes
- Detailed error messages
- CORS enabled for API testing

### Adding Features
Some ideas for enhancement:
- Add more payment methods (PayPal, Apple Pay, etc.)
- Implement payment history dashboard
- Add refund functionality
- Create admin panel
- Add email receipt generation
- Implement webhooks for payment events

## 📝 Notes

- Payments are stored in memory and will be lost when the server restarts
- The app simulates a 1-second processing delay for realism
- All card numbers are accepted (no real validation)

## 🤝 Contributing

This is a prototype/demo app. Feel free to fork and modify for your needs!

## 📄 License

This project is provided as-is for educational and prototyping purposes.

## 🙋 Support

For questions or issues, this is a standalone prototype without official support.

---

**Happy Prototyping! 🚀**

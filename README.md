# The Happy Oven - Bakery Website

A modern, animated, responsive bakery website for "The Happy Oven" - Freshly baked cakes delivered in Bengaluru.

## Features

- 🎂 Modern, responsive design with bakery-themed animations
- 🛒 Product browsing and detailed product pages
- 🛍️ Shopping cart functionality
- 💳 Checkout with Cash on Delivery
- 📧 Email notifications for orders
- 👤 User authentication (Register/Login)
- 📦 Order tracking with MongoDB
- 📱 Mobile-first responsive design
- 🎨 Soft pastel bakery color theme

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Vite (Build tool)
- EmailJS (Email notifications)

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- bcryptjs (Password hashing)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MongoDB:**
   - The MongoDB connection is already configured in `server/index.js`
   - Connection string: `mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/`
   - Database name: `the-happy-oven`

3. **Set up EmailJS** (for order notifications):
   - Go to [EmailJS](https://www.emailjs.com/) and create a free account
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Service ID, Template ID, and Public Key
   - Update the EmailJS configuration in `src/config/emailjs.js`

4. **Start the development servers:**

   **Terminal 1 - Backend Server:**
   ```bash
   npm run server
   ```
   Server will run on `http://localhost:5000`

   **Terminal 2 - Frontend Development Server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

5. **Build for production:**
```bash
npm run build
```

## Project Structure

```
├── server/
│   ├── models/          # MongoDB models (User, Order)
│   ├── routes/           # API routes (auth, orders)
│   └── index.js          # Express server entry point
├── src/
│   ├── components/       # Reusable components (Header, Footer)
│   ├── context/          # React context (AuthContext)
│   ├── pages/            # Page components
│   ├── utils/            # API utilities
│   ├── data/             # Product data
│   ├── config/           # Configuration files
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/:id` - Get user by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get all orders for a user
- `GET /api/orders/:orderId` - Get single order
- `PATCH /api/orders/:orderId/status` - Update order status

## Pages

1. **Home Page** (`/`)
   - Hero section with animated bakery elements
   - Product grid
   - Why Choose Us section
   - FAQ section

2. **Product Details Page** (`/product/:id`)
   - Large product image
   - Product information
   - Quantity selector
   - Variant options (Base: Wheat/Maida, Sweetener: Sugar/Brown Sugar)
   - Add to Cart / Proceed to Checkout

3. **Checkout Page** (`/checkout`)
   - Order summary
   - Customer details form (pre-filled for logged-in users)
   - Payment method (COD only)
   - Order placement with email notification
   - Orders saved to MongoDB

4. **Login Page** (`/login`)
   - User login form

5. **Register Page** (`/register`)
   - User registration form

6. **Orders Page** (`/orders`)
   - View all user orders grouped by date
   - Order details and status

## Products

- Belgian Chocolate Cake
- Tres Leches
- Cheesecakes
- Butter Cake (with Belgian dark & milk choco chips)
- Brownie
- Mawa Cake
- Pineapple Upside Down Cake
- Muffins
- Cupcakes

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  mobile: String,
  password: String (hashed),
  createdAt: Date
}
```

### Order Collection
```javascript
{
  userId: ObjectId (ref: User),
  orderDate: Date,
  productName: String,
  productImage: String,
  quantity: Number,
  baseVariant: String,
  sweetener: String,
  totalPrice: Number,
  customerName: String,
  customerMobile: String,
  address: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority
PORT=5000
```

For frontend, create `.env` file in root:
```
VITE_API_URL=http://localhost:5000/api
```

## Customization

- **Products**: Edit `src/data/products.js` to add/modify products
- **Colors**: Modify CSS variables in `src/index.css`
- **Contact Info**: Update Footer component in `src/components/Footer.jsx`
- **Prices**: Update product prices in `src/data/products.js`

## Security Notes

- Passwords are hashed using bcryptjs before storing in MongoDB
- API endpoints validate input data
- User authentication required for orders
- CORS enabled for development (configure for production)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© The Happy Oven - All rights reserved

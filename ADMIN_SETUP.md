# Admin Portal Setup Guide

## Creating an Admin User

To create an admin user, you have two options:

### Option 1: Using the Script (Recommended)

Run the following command in your terminal:

```bash
npm run create-admin
```

This will create an admin user with default credentials:
- **Email**: admin@happyoven.com
- **Password**: admin123
- **Name**: Admin User
- **Mobile**: 9999999999

### Option 2: Custom Admin User

You can also create an admin with custom details:

```bash
node server/scripts/createAdmin.js <email> <password> <name> <mobile>
```

Example:
```bash
node server/scripts/createAdmin.js admin@example.com mypassword123 "Admin Name" 9876543210
```

### Option 3: Manual Creation via MongoDB

1. Connect to your MongoDB database
2. Find or create a user in the `users` collection
3. Set `isAdmin: true` for that user

## Accessing Admin Portal

1. Go to: `http://localhost:3000/admin/login`
2. Or click the "Admin" link in the header (when logged out)
3. Login with your admin credentials

## Admin Dashboard Features

### Date Filtering
- Select any date to view orders for that specific delivery date
- Default shows today's orders
- View statistics and order details for selected date

### Statistics Display
- **Total Orders**: Number of orders placed for selected date
- **Total Quantity**: Total quantity of cakes ordered
- **Total Revenue**: Total revenue for the day

### Product-wise Statistics
- See breakdown by product name
- View orders, quantity, and revenue per product

### Order Details
- View all order details including:
  - Customer information
  - Product details
  - Weight, quantity, variants
  - Delivery address
  - Order status
  - Total price

## Security Notes

⚠️ **Important**: 
- Change the default admin password after first login
- Keep admin credentials secure
- Only grant admin access to trusted users
- Admin users can view all customer orders and information

## API Endpoints

### Admin Order Statistics
- `GET /api/orders/admin/stats?date=YYYY-MM-DD` - Get statistics for a date
- `GET /api/orders/admin/all?date=YYYY-MM-DD` - Get all orders for a date

## Troubleshooting

### Can't login as admin?
- Verify the user has `isAdmin: true` in the database
- Check if the user exists in MongoDB
- Ensure backend server is running

### No orders showing?
- Check if orders exist for the selected date
- Verify the date format (YYYY-MM-DD)
- Check MongoDB connection

### Statistics not loading?
- Check browser console for errors
- Verify backend server is running
- Check network tab for API call failures


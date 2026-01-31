# MongoDB Setup Instructions

## Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```
MONGODB_URI=mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority
PORT=5000
```

## MongoDB Connection Details

- **Username**: sid88067_db_user
- **Password**: UOoMVdXOReO6pWpf
- **Cluster**: the-happy-oven.nnwfxx6.mongodb.net
- **Database Name**: the-happy-oven

## Collections Created

The application will automatically create two collections:

1. **users** - Stores user registration and authentication data
2. **orders** - Stores all order information

## Starting the Server

1. Make sure you have installed all dependencies:
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run server
   ```

   The server will run on `http://localhost:5000`

3. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## Verifying Connection

Once the server starts, you should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

If you see connection errors, check:
- Your internet connection
- MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
- The connection string is correct

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  mobile: String,
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
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

## Security Notes

- Passwords are automatically hashed using bcryptjs before storage
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`


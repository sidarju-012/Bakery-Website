# Setup Instructions for The Happy Oven Website

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up MongoDB Environment**
   - Create a `.env` file in the root directory
   - Add the following content:
     ```
     MONGODB_URI=mongodb+srv://sid88067_db_user:UOoMVdXOReO6pWpf@the-happy-oven.nnwfxx6.mongodb.net/the-happy-oven?retryWrites=true&w=majority
     PORT=5000
     ```
   - See `MONGODB_SETUP.md` for detailed MongoDB setup instructions

2. **Configure EmailJS** (Required for order notifications)
   
   a. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up for a free account
   
   b. Create an Email Service:
      - Go to "Email Services" → "Add New Service"
      - Choose your email provider (Gmail recommended)
      - Follow the setup instructions
      - Note your **Service ID**
   
   c. Create an Email Template:
      - Go to "Email Templates" → "Create New Template"
      - Use this template structure:
        ```
        Subject: New Order from The Happy Oven
        
        Customer Name: {{customer_name}}
        Phone Number: {{phone_number}}
        Address: {{address}}
        
        Order Details:
        Product: {{product_name}}
        Quantity: {{quantity}}
        Base Variant: {{base_variant}}
        Sweetener: {{sweetener}}
        Total Price: {{total_price}}
        ```
      - Note your **Template ID**
   
   d. Get your Public Key:
      - Go to "Account" → "General"
      - Copy your **Public Key**
   
   e. Update `src/config/emailjs.js`:
      ```javascript
      export const EMAILJS_CONFIG = {
        SERVICE_ID: 'your_service_id_here',
        TEMPLATE_ID: 'your_template_id_here',
        PUBLIC_KEY: 'your_public_key_here'
      }
      ```

3. **Start Development Servers**

   **Terminal 1 - Backend Server:**
   ```bash
   npm run server
   ```
   This starts the Express server on `http://localhost:5000`

   **Terminal 2 - Frontend Development Server:**
   ```bash
   npm run dev
   ```
   This starts the React app on `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Customization

### Update Product Images
Replace the Unsplash image URLs in `src/data/products.js` with your own product images.

### Update Prices
Edit the `price` field for each product in `src/data/products.js`.

### Update Contact Information
Edit `src/components/Footer.jsx` to update phone number and email.

### Change Colors
Modify CSS variables in `src/index.css`:
```css
:root {
  --cream: #FFF8F0;
  --brown: #8B6F47;
  --pink: #F4C2C2;
  /* ... etc */
}
```

## Testing Email Notifications

1. Complete the EmailJS setup above
2. Place a test order through the checkout page
3. Check the email inbox configured in your EmailJS service
4. Verify all order details are included in the email

## Troubleshooting

### EmailJS not working?
- Verify all three IDs (Service ID, Template ID, Public Key) are correct
- Check that your email service is properly connected
- Ensure template variables match exactly (case-sensitive)
- Check browser console for error messages

### Images not loading?
- Replace Unsplash URLs with your own hosted images
- Ensure image URLs are accessible (CORS enabled if needed)

### Build errors?
- Run `npm install` again to ensure all dependencies are installed
- Check Node.js version (recommended: 16+)


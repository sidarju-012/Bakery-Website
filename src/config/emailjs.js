// EmailJS Configuration
// Replace these values with your EmailJS credentials
// Get them from: https://www.emailjs.com/

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',      // Your EmailJS service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',    // Your EmailJS template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY'       // Your EmailJS public key
}

// Initialize EmailJS (call this in your app initialization)
export const initEmailJS = () => {
  // EmailJS is initialized via CDN in index.html or via npm package
  // If using npm package, no initialization needed
}


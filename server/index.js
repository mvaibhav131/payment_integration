
import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();

// Use CORS and bodyParser
app.use(cors());
app.use(bodyParser.json());

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'YOUR_RAZORPAY_KEY_ID',  // Replace with your Razorpay key ID
    key_secret: 'YOUR_RAZORPAY_SECRET',  // Replace with your Razorpay key secret
});

// API endpoint to create an order
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;  // Amount in the smallest currency unit 

    try {
        const options = {
            amount: amount * 100,  // Amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: 'order_rcptid_11',  // Customize this
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/', (req, res) => {
   res.send('Welcome to Server!!!')
});

// API endpoint to verify the payment
app.post('/verify-payment', (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', 'YOUR_RAZORPAY_SECRET');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        res.status(200).json({ status: 'Payment Verified' });
    } else {
        res.status(400).json({ status: 'Payment Verification Failed' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});

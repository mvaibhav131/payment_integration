import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
    const [amount, setAmount] = useState(500);  // Set amount in INR

    const handlePayment = async () => {
        try {
            const orderData = await axios.post('http://localhost:5000/create-order', {
                amount,
            });

            const { id: order_id, amount: order_amount, currency } = orderData.data;

            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID',  // Replace with your Razorpay key ID
                amount: order_amount,
                currency,
                name: 'Your Company Name',
                description: 'Test Transaction',
                order_id,
                handler: async function (response) {
                    const paymentId = response.razorpay_payment_id;
                    const orderId = response.razorpay_order_id;
                    const signature = response.razorpay_signature;

                    const verificationData = {
                        razorpay_payment_id: paymentId,
                        razorpay_order_id: orderId,
                        razorpay_signature: signature,
                    };

                    const result = await axios.post('http://localhost:5000/verify-payment', verificationData);

                    if (result.data.status === 'Payment Verified') {
                        alert('Payment successful');
                    } else {
                        alert('Payment verification failed');
                    }
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log('Payment error: ', error);
        }
    };

    return (
        <div>
            <h1>Make a Payment</h1>
            <button onClick={handlePayment}>Pay ₹{amount}</button>
        </div>
    );
};

export default PaymentPage;

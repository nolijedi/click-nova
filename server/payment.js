const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your Stripe secret key
const router = express.Router();
const path = require('path');
const crypto = require('crypto');

// Store for activation keys (in production, use a database)
const activationKeys = new Map();

// Generate a unique activation key
function generateActivationKey() {
    return crypto.randomBytes(16).toString('hex').toUpperCase();
}

router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Click Nova - System Optimizer',
                            description: 'One-time purchase with unique activation key',
                        },
                        unit_amount: 199, // $1.99 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/download/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/download`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

router.get('/success', async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            // Generate and store activation key
            const activationKey = generateActivationKey();
            activationKeys.set(activationKey, {
                created: new Date(),
                used: false
            });

            // In production, you would email this key to the customer
            res.json({
                success: true,
                activationKey,
                downloadUrl: '/download/get-file'
            });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Error processing success:', error);
        res.status(500).json({ error: 'Failed to process payment success' });
    }
});

router.get('/get-file', (req, res) => {
    // In production, verify the user has paid before sending the file
    const filePath = path.join(__dirname, '../dist/ClickNova-Setup.exe');
    res.download(filePath, 'ClickNova-Setup.exe');
});

module.exports = router;

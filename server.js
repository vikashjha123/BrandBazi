require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact API Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, phone, business, service, message } = req.body;

    if (!name || !phone || !service) {
        return res.status(400).json({ success: false, message: 'Name, Phone, and Service are required.' });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            subject: `New Lead: ${name} - ${service}`,
            html: `
                <h3>New Contact Request</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Business Type:</strong> ${business || 'N/A'}</p>
                <p><strong>Service Needed:</strong> ${service}</p>
                <p><strong>Message:</strong></p>
                <p>${message || 'No additional message provided.'}</p>
            `
        };

        // Note: For this to work in production, you need to configure EMAIL_USER and EMAIL_PASS in your .env file.
        // Actually send the email using the provided credentials
        await transporter.sendMail(mailOptions);
        
        console.log(`Mock Email Sent: Lead from ${name} for ${service}`);
        
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;

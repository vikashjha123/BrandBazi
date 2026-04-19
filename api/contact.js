const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, phone, business, service, message } = req.body;
    
    if (!name || !email || !phone || !service) {
        return res.status(400).json({ success: false, message: 'Name, Email, Phone, and Service are required.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        // 1. Email to Business Owner (Lead Notification)
        const ownerMail = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            subject: `🚀 New Lead: ${name} - ${service}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #7c3aed;">New Contact Request</h2>
                    <p>You have a new lead from <strong>BrandBazi</strong> website.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Business Type:</strong> ${business || 'N/A'}</p>
                    <p><strong>Service Needed:</strong> ${service}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${message || 'No additional message.'}</div>
                </div>
            `
        };

        // 2. Email to Client (Auto-Confirmation)
        const clientMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank you for contacting BrandBazi!`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
                    <h2 style="color: #7c3aed;">Hello ${name}!</h2>
                    <p>Thank you for reaching out to <strong>BrandBazi</strong>. We have received your request for <strong>${service}</strong>.</p>
                    <p>Our team is currently reviewing your project details. One of our designers will get back to you via email or WhatsApp within the next 24 hours.</p>
                    <br/>
                    <div style="background: #7c3aed; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                        <strong>We're excited to help your business look premium!</strong>
                    </div>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 20px;">
                        Best regards,<br/>
                        <strong>BrandBazi Team</strong><br/>
                        <a href="https://wa.me/917250538660" style="color: #06b6d4;">Chat with us on WhatsApp</a>
                    </p>
                </div>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(ownerMail),
            transporter.sendMail(clientMail)
        ]);

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
}

const Otp = require("../models/Otp"); // Assuming you have an OTP model
const User = require("../models/User"); // Your User model
const nodemailer = require("nodemailer"); // For sending OTP via email
const crypto = require("crypto"); // Optional, for generating secure tokens

// Utility function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Set up Nodemailer transporter (for sending emails)
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Ensure you add this to .env
    pass: process.env.EMAIL_PASSWORD, // Ensure you add this to .env
  },
});

// Controller to send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Generate new OTP
    const otpCode = generateOTP();

    // Save OTP to database
    const otp = new Otp({ email, otp: otpCode });
    await otp.save();

    // Send OTP via email
    const mailOptions = {
        from: '"Retail Connect" <noreply@retailconnect.com>',
        to: email,
        subject: "Your One-Time Password (OTP)",
        html: `
          <!DOCTYPE html>
          <html lang="en" style="margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif;">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Retail Connect - OTP</title>
            <style>
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background-color: #f8f8f8;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .logo {
                display: block;
                margin: 0 auto 20px;
                max-width: 150px;
              }
              .otp-code {
                background-color: green;
                color: #fff;
                font-size: 28px;
                font-weight: bold;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 30px;
              }
              .cta {
                display: block;
                background-color: #e9522c;
                color: #fff;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                padding: 12px 24px;
                border-radius: 6px;
                text-align: center;
                margin-top: 30px;
              }
              .footer {
                text-align: center;
                color: #666;
                font-size: 14px;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="https://retailconnect.com/logo.png" alt="Retail Connect" class="logo">
              <div class="otp-code">${otpCode}</div>
              <p>Use this One-Time Password (OTP) to complete your registration on Retail Connect.</p>
              <a href="https://retailconnect.com" class="cta">Go to Retail Connect</a>
              <div class="footer">
                <p>This email was sent from Retail Connect. If you did not request this OTP, please contact us at support@retailconnect.com.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ message: "Failed to send OTP: " + err.message });
      } else {
        return res.status(200).json({ message: "OTP sent to your email" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controller to verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find OTP in database
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, delete it after use (optional)
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

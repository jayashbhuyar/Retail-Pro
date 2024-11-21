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
// exports.sendOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists with this email" });
//     }

//     // Generate new OTP
//     const otpCode = generateOTP();

//     // Save OTP to database
//     const otp = new Otp({ email, otp: otpCode });
//     await otp.save();

//     // Send OTP via email
//     const mailOptions = {
//         from: '"Retail Connect" <noreply@retailconnect.com>',
//         to: email,
//         subject: "Your One-Time Password (OTP)",
//         html: `
//           <!DOCTYPE html>
//           <html lang="en" style="margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif;">
//           <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Retail Connect - OTP</title>
//             <style>
//               .container {
//                 max-width: 600px;
//                 margin: 0 auto;
//                 padding: 40px;
//                 background-color: #f8f8f8;
//                 border-radius: 8px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//               }
//               .logo {
//                 display: block;
//                 margin: 0 auto 20px;
//                 max-width: 150px;
//               }
//               .otp-code {
//                 background-color: green;
//                 color: #fff;
//                 font-size: 28px;
//                 font-weight: bold;
//                 padding: 20px;
//                 border-radius: 8px;
//                 text-align: center;
//                 margin-bottom: 30px;
//               }
//               .cta {
//                 display: block;
//                 background-color: #e9522c;
//                 color: #fff;
//                 text-decoration: none;
//                 font-size: 16px;
//                 font-weight: bold;
//                 padding: 12px 24px;
//                 border-radius: 6px;
//                 text-align: center;
//                 margin-top: 30px;
//               }
//               .footer {
//                 text-align: center;
//                 color: #666;
//                 font-size: 14px;
//                 margin-top: 40px;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <img src="https://retailconnect.com/logo.png" alt="Retail Connect" class="logo">
//               <div class="otp-code">${otpCode}</div>
//               <p>Use this One-Time Password (OTP) to complete your registration on Retail Connect.</p>
//               <a href="https://retailconnect.com" class="cta">Go to Retail Connect</a>
//               <div class="footer">
//                 <p>This email was sent from Retail Connect. If you did not request this OTP, please contact us at support@retailconnect.com.</p>
//               </div>
//             </div>
//           </body>
//           </html>
//         `,
//       };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error("Error sending email:", err);
//         return res
//           .status(500)
//           .json({ message: "Failed to send OTP: " + err.message });
//       } else {
//         return res.status(200).json({ message: "OTP sent to your email" });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Controller to send OTP
exports.passchangesendOtp = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Ensure the user exists before sending OTP (forgot password scenario)
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
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
      subject: "Verify Your Email - Retail Connect",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Segoe UI', system-ui, sans-serif;
            }
    
            body {
              background-color: #f0f2f5;
              padding: 20px;
            }
    
            .email-container {
              max-width: 480px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
            }
    
            .email-header {
              background: linear-gradient(135deg, #3a0ca3, #4361ee);
              padding: 30px;
              text-align: center;
            }
    
            .brand-name {
              color: white;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 0.5px;
            }
    
            .email-content {
              padding: 32px 24px;
              text-align: center;
            }
    
            .welcome-text {
              color: #1a1a1a;
              font-size: 18px;
              margin-bottom: 24px;
            }
    
            .otp-box {
              background: linear-gradient(135deg, #f8f9fa, #e9ecef);
              border-radius: 8px;
              padding: 24px;
              margin: 24px 0;
            }
    
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #3a0ca3;
              font-family: monospace;
              background: white;
              padding: 12px;
              border-radius: 6px;
              margin: 12px 0;
              border: 2px dashed #4361ee;
            }
    
            .timer {
              color: #6c757d;
              font-size: 14px;
              margin-top: 8px;
            }
    
            .info-text {
              color: #4a5568;
              font-size: 14px;
              line-height: 1.6;
              margin: 16px 0;
              padding: 12px;
              background-color: #f8fafc;
              border-radius: 6px;
            }
    
            .highlight {
              background: linear-gradient(120deg, #4361ee20 0%, #4361ee20 100%);
              background-repeat: no-repeat;
              background-size: 100% 0.25em;
              background-position: 0 88%;
              font-weight: 500;
            }
    
            .email-footer {
              text-align: center;
              padding: 24px;
              background: #f8fafc;
              border-top: 1px solid #e2e8f0;
            }
    
            .footer-text {
              color: #64748b;
              font-size: 12px;
              line-height: 1.5;
            }
    
            .contact-link {
              color: #4361ee;
              text-decoration: none;
              font-weight: 500;
            }
    
            @media only screen and (max-width: 480px) {
              .email-container {
                width: 100%;
              }
    
              .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <div class="brand-name">Retail Connect (OTP)-${otpCode}</div>
            </div>
    
            <div class="email-content">
              <p class="welcome-text">
                👋 Hey there!
              </p>
    
              <div class="info-text">
                Here's your verification code to get started with <span class="highlight">Retail Connect</span>
              </div>
    
              <div class="otp-box">
                <div class="otp-code">${otpCode}</div>
                <div class="timer">Valid for 10 minutes</div>
              </div>
    
              <div class="info-text" style="background-color: #fff8f6; color: #e11d48;">
                Please don't share this code with anyone
              </div>
            </div>
    
            <div class="email-footer">
              <p class="footer-text">
                Questions? Contact us at 
                <a href="mailto:support@retailconnect.com" class="contact-link">
                  support@retailconnect.com
                </a>
              </p>
              <p class="footer-text" style="margin-top: 12px;">
                © ${new Date().getFullYear()} Retail Connect. All rights reserved.
              </p>
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
exports.passchangeverifyOtp = async (req, res) => {
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

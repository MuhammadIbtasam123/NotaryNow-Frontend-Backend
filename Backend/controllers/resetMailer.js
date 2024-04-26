import nodemailer from "nodemailer";

export async function sendRedirectLink(email, token) {
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER, // your Gmail email address
      pass: process.env.PASS, // your Gmail password
    },
  });

  // Mail options
  const mailOptions = {
    from: process.env.GMAIL_USER, // companys address
    to: email,
    subject: "Password Reset Request",
    text: `You are receiving this email because you has requested a password reset for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3000/reset-password?token=${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to send email" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({
        success: true,
        message: "Email sent successfully",
      });
    }
  });
}

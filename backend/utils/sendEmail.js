const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {

    console.log("========== SMTP CONFIG ==========");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);
console.log("=================================");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Connected Successfully");

    // Send email
    await transporter.sendMail({
      from: `"GMT LMS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully.");
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("================================");
    throw error;
  }
};

module.exports = sendEmail;
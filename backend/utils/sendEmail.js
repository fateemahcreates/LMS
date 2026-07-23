const nodemailer = require("nodemailer");

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GMT LMS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully.");
 } catch (error) {
  console.error("========== EMAIL ERROR ==========");
  console.error(error);
  console.error("================================");

  throw error;
}
};

module.exports = sendEmail;
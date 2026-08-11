const axios = require("axios");

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "GMT LMS",
          email: "contact@gmtsoftware.tech",
        },

        to: [
          {
            email: to,
          },
        ],

        subject,

        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully.");
  } catch (error) {
    console.error(
      "========== BREVO ERROR =========="
    );

    if (error.response) {
      console.error(
        error.response.data
      );
    } else {
      console.error(
        error.message
      );
    }

    console.error(
      "================================"
    );

    throw error;
  }
};

module.exports = sendEmail;
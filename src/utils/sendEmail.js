import transporter from "../config/mailConfig.js";

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    await transporter.sendMail({
      from: `"Sun & Shadow Group" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

export default sendEmail;
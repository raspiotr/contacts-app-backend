const nodemailer = require("nodemailer");

require("dotenv").config();

const { EMAIL_PASS, EMAIL_SENDER, BASE_URL } = process.env;

const sendVerificationEmail = async ({ email, verificationToken }) => {
  const config = {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const emailOptions = {
    from: "piotr_r.goit@gmail.com",
    to: email,
    subject: "Verify Your Email",
    html: `<b>Verify your email here: </b><a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">${BASE_URL}/users/verify/${verificationToken}</a>`,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendVerificationEmail;

/* const { text } = require("express");
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`

  const mailOptions = {
    from: 'willames.almeida.b@gmail.com',
    to: email,
    subject: 'Redefinir senha',
    text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
    html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`
  };

  await transporter.sendMail(mailOptions)
  console.log("email: ", email, "senha: ", token)
}

module.exports = {sendResetEmail} */
/* 
const sendmail = require("@sendgrid/mail");
require("dotenv").config();

sendmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:3333/reset-password?token=${token}`;

  const messege = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: "Redefinir senha",
    text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
    html: `<p>Clique no link abaixo para redefinir sua senha: <a href="${resetLink}">${resetLink}<a/></p>`,
  };
  await sendmail.send(messege)
};

module.exports = { sendResetEmail };
 */


// const { Resend } = require("resend"); 
// require("dotenv").config();


// const sendResetEmail = async (email, token) => {
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   const resetLink = `http://localhost:3333/reset-password?token=${token}`;

//   await resend.emails.send({ 
//     from: "onboarding@resend.dev", 
//     to: email,
//     subject: "Redefinir senha",
//     text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
//     html: `<p>Clique no link abaixo para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`,
//   });
// };

// module.exports = { sendResetEmail };


const nodemailer = require("nodemailer"); 

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({ 
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    secure: false, // false para porta 587 (TLS)
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const resetLink = `http://localhost:3333/reset-password?token=${token}`;

  await transporter.sendMail({ 
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Redefinir senha",
    text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
    html: `<p>Clique no link abaixo para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`,
  });
};

module.exports = { sendResetEmail };
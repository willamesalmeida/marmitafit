const { text } = require("express");
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
    from: 'no-reply@marmitasfit.com',
    to: email,
    subject: 'Redefinir senha',
    text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
    html: `<p>Clique no link para redefinir sua senha: <a href="${resetLink}">${resetLink}</a></p>`
  };

  await transporter.sendMail(mailOptions)

}

module.exports = {sendResetEmail}
import nodemailer from "nodemailer";

async function sendEmail({ to, subject, html, attachments = [] }) {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: ` "E-commerce App" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });
  // i always send one email every time to one user
  if (info.accepted.length < 1) return false;
  return true;
}

export default sendEmail;

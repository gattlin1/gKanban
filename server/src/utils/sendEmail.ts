import nodemailer from 'nodemailer';

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
) {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'righ5s34mb3pbfpk@ethereal.email',
      pass: 'FejYNW452fH4s5RuqW',
    },
  });
  let info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
  console.log('Message send: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

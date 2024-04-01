import nodemailer from "nodemailer";
import fs from "fs/promises";

const mailCompany = process.env.MAIL_SMTP_USER;
const password = process.env.MAIL_SMTP_KEY;
const port = process.env.MAIL_SMTP_PORT;
const host = process.env.MAIL_SMTP_HOST;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: mailCompany,
    pass: password,
  },
});

async function sendMail(mail, subject, attachementPath = null, content) {
  try {
    let masterMail = await fs.readFile(`mails/masterMail.txt`, "utf8");
    masterMail = masterMail.replace("{{content}}", content);

    const mailOptions = {
      from: mailCompany,
      to: mail,
      subject: subject,
      html: masterMail,
      attachments: [],
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject({
            success: false,
            error: "Erreur lors de l'envoi de l'e-mail",
          });
        } else {
          resolve({ success: true, message: "E-mail envoyé" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error" };
  }
}

export default sendMail;
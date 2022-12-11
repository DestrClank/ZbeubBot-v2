const values = require("../values.json")
const nodemailer = require("nodemailer")
require("dotenv").config()

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

module.exports = (subject, content) => {
    message = {
        from: `"Zbeub Bot" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_DEV,
        subject: `Zbeub Bot ${values.version.versionNumber} - ${subject}`,
        text: content
   }

   transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
   })
}
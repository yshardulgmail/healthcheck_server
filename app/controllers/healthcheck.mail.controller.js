const path = require('path')
const nodemailer = require('nodemailer')
const fs = require("fs")

const mailConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: "yshardul@gmail.com",
		pass: "scapgdtfilfytofg",
	},
}

const contactEmail = nodemailer.createTransport(mailConfig);
contactEmail.verify((error, success) => {
	if (error) {
		console.error(error)
	} else {
		console.log('Ready to send mail!')
	}
})

exports.sendMail = (req, res) => {
	const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../emailTemplates/batch_notification.template"), "utf8")
	const mail = {
		from: "yshardul@gmail.com",
		to: req.body.to,
		subject: 'BDX Healthcheck - Batch Review Summary',
		html: emailTemplateSource.replace("{{table_body}}", req.body.html)
	};

	console.log(mail);

	contactEmail.sendMail(mail, error => {
		if (error) {
			console.log(error);
			res.json({ status: "ERROR" })
		} else {
			res.json({ status: "Message Sent" })
		}
	});
};
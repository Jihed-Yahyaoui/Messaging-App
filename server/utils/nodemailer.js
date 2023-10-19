const nodemailer = require('nodemailer')

// Create a transporter to send emails 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yhmyhm44@gmail.com', // Sender email
        pass: 'qlszkwnnizrxtpiz'
    }
});

// Create email in the form of HTML
var mailHTML = hash => '<p>Activation link: <a href="http://localhost:3000/activate/' + hash + '">link</a></p>'


function mailOptions(email, hash) {
    return {
        from: 'Activation <activation@activation.com>', // The receiver sees this as the sender
        to: email,
        subject: 'Activating website',
        html: mailHTML(hash)
    }
};

module.exports = { transporter, mailOptions }
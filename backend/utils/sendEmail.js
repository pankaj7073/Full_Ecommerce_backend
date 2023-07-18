const nodemailer = require ('nodemailer');

let sendEmail = async(options) =>{
    let transport = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        secure:false,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
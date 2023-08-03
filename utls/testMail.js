const nodemailer = require('nodemailer');

const sendEmailMsg = async (options) =>{

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure:false,
        auth:{
            user: testAccount.user,
            pass:testAccount.pass
        },
    });
    
     const message = {
        from: 'E-shop App <saifkamal43@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html:"",
    };
     await transporter.sendMail(message);
}

module.exports = sendEmailMsg;
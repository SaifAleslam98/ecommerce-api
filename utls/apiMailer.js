const nodeMailer = require('nodemailer');
const mailGen = require('mailgen');

// Nodemailer
const sendEmail = async (options) => {
    /**Send Email From Real Account Gmail*/
    const config = {
        service: 'gmail',
        auth: {
            user: 'saifhassn94@gmail.com',
            pass: 'dfdsfsdgghfgdhjjkjh'
        }
    }
    // pass transporter to nodemailer
    const transporter = nodeMailer.createTransport(config);

    // using mailgen to configure a theme and info
    // eslint-disable-next-line new-cap
    const mailgenerator = new mailGen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'process.env.COMPANY_NAME',
            link: 'process.env.COMPANY_MAIL'

        }
    });

    // Preparing email contents
    var email = {
        body: {
            name: options.name,
            intro: 'You have received this email because a password reset request for your account was received.',
            action: {
                instructions: `Your Recovery Code is:${options.code}`,
                button: {
                    color: '#DC4D2F',
                    text: 'Reset your password',
                    link: `localhost:3000//api/v1/auth/reset?s=${options.id}`
                }
            },
            outro: 'If you did not request a password reset, no further action is required on your part.'
        }
    };
    // Generate an HTML email with the provided contents
    const emailBody = mailgenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailText = mailgenerator.generatePlaintext(email);

    // Put all containt inside one constructor
    const message = {
        from: 'no-reply@example..com',
        to: options.email,
        subject: 'reset password',
        html: emailBody,
        text: emailText,
    };
    console.log(options)
    await transporter.sendMail(message);
    
};

module.exports = sendEmail;

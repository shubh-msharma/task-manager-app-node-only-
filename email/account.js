
const sendGrid  = require('@sendgrid/mail');

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name,email)=>{
    sendGrid.send({
        to:email,
        from:'shubhamsharma4539@gmail.com',
        subject:`welcome to tm app`,
        text:`${name},welcome to tm app`
    })
}

const sendGoodByeEmail = (name,email)=>{
    sendGrid.send({
        to:email,
        from:'shubhamsharma4539@gmail.com',
        subject:`bye bye from tm app`,
        text:`${name},nice to eet you`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}
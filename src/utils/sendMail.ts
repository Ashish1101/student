import nodemailer from 'nodemailer'

type MailType = {
    from: string,
    to: string
    subject : string
    html : string
}
export default async (options : MailType) => {
    try {
      //create a transporter object
      const transporter = nodemailer.createTransport({
          host:'smtp.mailgun.org',
          port:587,
          auth: {
              user:'postmaster@sandboxf4f02702678d4ad49db5699563946f44.mailgun.org',
              pass: '1f17e76518a97d9babb3d55fc8b473a3-90346a2d-81a8dd96'
          }
      })

      //send mails and put options
      transporter.sendMail(options , (err , info) => {
          if(err) return console.log('error in message' , err.message)
          console.log('mail sent' , info.response);
      })

    } catch (err) {
        console.log('error' , err)
    }
}

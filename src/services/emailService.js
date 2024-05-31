import nodemailer from "nodemailer";
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        service: 'gmail',
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Origin Dev" <votrungnguyenlop1a@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Xác nhận đặt lịch khám bệnh", // Subject line
        text: "Test booking schedule doctor", // plain text body
        html: getBodyHTMLEmail(dataSend), 
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';

    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Email này nhằm xác nhận bạn đã đặt lịch khám bệnh trên hệ thống Bookingcare của chúng tôi.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ phụ trách: ${dataSend.doctorName}</b></div>
        <p>Nếu bạn xác nhận thông tin bên trên là đúng, vui lòng ấn vào đường link để hoàn tất thủ tục đặt lịch khám!</p>
        <div>
            <a href="${dataSend.redirectLink} target="_blank"">Click here</a>
        </div>
        <div>Bookingcare xin chân thành cảm ơn,</div>
        `
    }

    if (dataSend.language === 'en') {
        result = `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>This email to confirm that you have booked schedule on Bookingcare system.</p>
            <p>Booking schedule information:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If you confirm this informations are right, please click this below link to complete booking schedule procedure!</p>
            <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
            </div>
            <div>Best regards,</div>
        `
    }

    return result;
}

let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                // host: "smtp.gmail.com",
                service: 'gmail',
                port: 465,
                secure: true, // Use `true` for port 465, `false` for all other ports
                auth: {
                  user: process.env.EMAIL_APP,
                  pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
        
            const info = await transporter.sendMail({
                from: '"Origin Dev" <votrungnguyenlop1a@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Xác nhận đặt lịch khám và thông tin đơn thuốc", // Subject line
                text: "Test booking schedule doctor", // plain text body
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        // encoded string as an attachment
                        filename: `remedy-${dataSend.patientId}-${dataSend.patientName}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });

            resolve();
        } catch(e) {
            reject(e);
        }
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';

    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Email này nhằm xác nhận bạn đã được xác nhận việc đặt lịch khám bệnh trên hệ thống Booking Care.</p>
            <p>Thời gian đặt lịch: ${dataSend && dataSend.bookingTime ? dataSend.bookingTime.valueVi : ''}</p>
            <p>Thông tin hóa đơn và đơn thuốc được gửi trong tệp đính kèm dưới đây.</p>
            <p>Hệ thống Booking Care xin chân thành cảm ơn!</p>
        `
    }

    if (dataSend.language === 'en') {
        result = `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>This email to confirm that you have succeeded in booking schedule on Bookingcare system.</p>
            <p>Booking time: ${dataSend && dataSend.bookingTime ? dataSend.bookingTime.valueEn : ''}</p>
            <p>Booking schedule information and remedy is sent in this below file.</p>
            <div>Best regards,</div>
        `
    }

    return result;
}

module.exports = {
    sendSimpleEmail, sendAttachment,
    sendAttachment,
}

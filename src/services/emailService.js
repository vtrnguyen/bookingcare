import nodemailer from "nodemailer";
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
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

module.exports = {
    sendSimpleEmail,
}

import nodemailer from "nodemailer";
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
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
        html: `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Email này nhằm xác nhận bạn đã đặt lịch khám bệnh trên hệ thống Bookingcare của chúng tôi.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ phụ trách: ${dataSend.doctorName}</b></div>
            <p>Nếu bạn thông tin bên trên là đúng, vui lòng ấn vào đường link để hoàn tất thủ tục đặt lịch khám!</p>
            <div>
                <a href="${dataSend.redirectLink} target="_blank"">Click here</a>
            </div>
            <div>Bookingcare xin chân thành cảm ơn</div>
        `, 
    });
}

module.exports = {
    sendSimpleEmail,
}

import db from "../models";
require('dotenv').config();
import bcrypt from 'bcryptjs';
import { sendSimpleEmail } from './emailService';
import { v4 as uuidv4 } from 'uuid';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);            
        }
    })
}

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking/?token=${token}&doctorId=${doctorId}`;

    return result;
}

let postBookingAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email || !inputData.doctorId 
                || !inputData.timeType || !inputData.date
                || !inputData.patientName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter',
                });
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                // send email to patient to confirm booking schedule
                await sendSimpleEmail({
                    receiverEmail: inputData.email,
                    patientName: inputData.patientName,
                    time: inputData.timeString,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    redirectLink: buildUrlEmail(inputData.doctorId, token),
                });

                // upsert users
                let hashPasswordFromBcrypt = await hashUserPassword('123');
                let user = await db.User.findOrCreate({
                    where: {
                        email: inputData.email,
                    },
                    defaults: {
                        email: inputData.email,
                        password: hashPasswordFromBcrypt,
                        roleId: 'R3',
                    },
                });

                // create a booking record
                if (user && user[0]) {
                    await db.Bookings.findOrCreate({
                        where: { 
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            token: token,
                        },
                    });
                }

                if (user[1]) {
                    resolve({
                        errCode: 0,
                        errSubCode: 1,
                        errMessage: 'Booking a new appointment is successfully',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errSubCode: 0,
                        errMessage: 'This user has already booked the appointment before!!!',
                    });
                }

            }
        } catch (e) {
            reject(e);
        }
    });
}

let postVerifyBookingAppointment = (inputData) => {
    return new Promise (async (resolve, reject) => {
        try {
            if (!inputData.token || !inputData.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                let appointment = await db.Bookings.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        token: inputData.token,
                        statusId: 'S1',
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment succeed',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!!!',
                    });
                }
            }

            resolve();

        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    postBookingAppointment, postVerifyBookingAppointment
}

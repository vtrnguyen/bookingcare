import db from "../models";
require('dotenv').config();
import bcrypt from 'bcryptjs';

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

let postBookingAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email || !inputData.doctorId || !inputData.timeType || !inputData.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter',
                });
            } else {
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
                        },
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor booking patient succeed',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    postBookingAppointment,
}

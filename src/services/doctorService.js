import { where } from "sequelize";
import db from "../models";
require('dotenv').config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                where: {
                    roleId: 'R2',
                },
                include: [
                    { model: db.Allcodes, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            })

            resolve({
                errCode: 0,
                errMessage: 'Get users successful',
                data: doctors,
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: ['password', 'image']
                },
            });

            resolve({
                errCode: 0,
                errMessage: 'Get all doctors succeed',
                data: doctors,
            });
        } catch(e) {
            reject(e);
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentMarkdown 
                || !inputData.contentHTML || !inputData.action 
                || !inputData.selectedPrice || !inputData.selectedPayment 
                || !inputData.selectedProvince || !inputData.nameClinic 
                || !inputData.addressClinic || !inputData.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters input!!!',
                });
            } else {
                // upsert to Markdown
                if (inputData.action === "CREATE") {
                    await db.Markdowns.create({
                        contentMarkdown: inputData.contentMarkdown,
                        contentHTML: inputData.contentHTML,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdowns.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                        },
                        raw: false
                    });

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updatedAt = new Date();
                        await doctorMarkdown.save();
                    }
                }

                // upsert to Docto_Infor
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });

                if (doctorInfor) {
                    // update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.note = inputData.note;

                    doctorInfor.save();
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save detail infor user succeed',
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                let detailInfor = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ['password'],
                    }, 
                    include: [
                        { model: db.Markdowns, attributes: ['contentHTML', 'contentMarkdown', 'description'] },
                        { model: db.Allcodes, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Doctor_Infor,
                            attributes: {
                               exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcodes, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcodes, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcodes, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (detailInfor && detailInfor.image) {
                    detailInfor.image = new Buffer(detailInfor.image, 'base64').toString('binary');
                }

                if (!detailInfor) data = {};

                resolve({
                    errCode: 0,
                    errMessage: 'Get detail doctor successful',
                    data: detailInfor,
                });
            }
        } catch(e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.arrSchedule || !dataInput.doctorId || !dataInput.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!!!',
                })
            } else {
                let schedule = dataInput.arrSchedule;
                
                // add max number schedule to each element 
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item, index) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                // get all existing date from database
                let existing = await db.Schedule.findAll({
                    where: { doctorId: dataInput.doctorId, date: dataInput.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                });

                // comparing the schedule data to create with the existing data schedule, if it is different, do below
                let toCreate = _.differenceWith(schedule, existing, (elementSchedule, elementExisting) => {
                    return +elementSchedule.date === +elementExisting.date && elementSchedule.timeType === elementExisting.timeType;
                });

                // creating the schedule
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch(e) {
            reject(e);
        }
    })
}

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters!!!',
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        { model: db.Allcodes, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!dataSchedule) {
                    dataSchedule = [];
                };

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: dataSchedule,
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome, getAllDoctors,
    saveDetailInforDoctor, getDetailDoctorById,
    bulkCreateSchedule, getScheduleDoctorByDate
}

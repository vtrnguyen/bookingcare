import db from "../models";

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
            if (!inputData.doctorId || !inputData.contentMarkdown || !inputData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters input!!!',
                });
            } else {
                await db.Markdowns.create({
                    contentMarkdown: inputData.contentMarkdown,
                    contentHTML: inputData.contentHTML,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });

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

module.exports = {
    getTopDoctorHome, getAllDoctors,
    saveDetailInforDoctor
}

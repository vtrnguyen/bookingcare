import db from "../models";

let createClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.address 
                || !inputData.descriptionHTML || !inputData.descriptionMarkDown
                || !inputData.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                await db.Clinics.create({
                    name: inputData.name,
                    address: inputData.address,
                    image: inputData.imageBase64,
                    descriptionHTML: inputData.descriptionHTML,
                    descriptionMarkDown: inputData.descriptionMarkDown,
                });

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinics.findAll();

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: data,
            });
        } catch (e) {
            reject(e);
        }
    });
}

let getAllDetailClinicById = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                let data = await db.Clinics.findOne({
                    where: {
                        id: clinicId,
                    },
                    attributes: [
                        'name', 'descriptionHTML', 'descriptionMarkDown'
                    ]
                });

                if (data) {
                    let clinicDoctor = [];
                    // find all specialty doctor
                    clinicDoctor = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: clinicId,
                        },
                        attributes: [
                            'doctorId', 'provinceId',
                        ]
                    });

                    data.clinicDoctor = clinicDoctor;
                } else data = {};

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data,
                });

            }
        } catch(e) {
            reject(e);
        }
    });
}

module.exports = {
    createClinic, getAllClinic,
    getAllDetailClinicById,
}

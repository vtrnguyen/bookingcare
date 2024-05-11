import db from "../models";

let createSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.specialtyNameVi || !inputData.specialtyNameEn 
                || !inputData.descriptionHTML || !inputData.descriptionMarkDown
                || !inputData.imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                await db.Specialties.create({
                    nameVi: inputData.specialtyNameVi,
                    nameEn: inputData.specialtyNameEn,
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialties.findAll();

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
        } catch(e) {
            reject(e);
        }
    });
}

let getAllDetailSpecialtyById = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                let data = await db.Specialties.findOne({
                    where: {
                        id: specialtyId,
                    },
                    attributes: [
                        'descriptionHTML', 'descriptionMarkDown'
                    ]
                });

                if (data) {
                    let specialtyDoctor = [];
                    if (location === "all") {
                        // find all specialty doctor
                        specialtyDoctor = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId,
                            },
                            attributes: [
                                'doctorId', 'provinceId',
                            ]
                        });
                    } else {
                        // find specialty doctor by location
                        specialtyDoctor = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: specialtyId,
                                provinceId: location,
                            },
                            attributes: [
                                'doctorId', 'provinceId',
                            ]
                        });
                    }

                    data.specialtyDoctor = specialtyDoctor;
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
    })
}

module.exports = {
    createSpecialty, getAllSpecialty,
    getAllDetailSpecialtyById,
}

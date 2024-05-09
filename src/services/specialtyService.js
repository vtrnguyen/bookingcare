import db from "../models";

let createSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.specialtyNameVi || !inputData.specialtyNameEn 
                || !inputData.descriptionHTML || !inputData.descriptionMarkDown) {
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

module.exports = {
    createSpecialty, getAllSpecialty
}

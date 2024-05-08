import db from "../models";

let createSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.specialtyName || !inputData.imageBase64 
                || !inputData.descriptionHTML || !inputData.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameter!!!',
                });
            } else {
                await db.Specialties.create({
                    name: inputData.specialtyName,
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

module.exports = {
    createSpecialty,
}

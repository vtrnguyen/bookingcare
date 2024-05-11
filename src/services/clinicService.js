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

module.exports = {
    createClinic
}

import doctorService from "../services/doctorService"; 

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctors();
        return res.status(200).json(response);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let detailInfor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(detailInfor);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(data);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let data = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(data);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

module.exports = {
    getTopDoctorHome, getAllDoctors, 
    postInforDoctors, getDetailDoctorById,
    bulkCreateSchedule, getScheduleDoctorByDate
}
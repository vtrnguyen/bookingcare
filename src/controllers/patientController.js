import patientService from "../services/patientService";

let postBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookingAppointment(req.body);
        return res.status(200).json(data);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!!!',
        })
    }
}

let postVerifyBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postVerifyBookingAppointment(req.query);
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
    postBookingAppointment, postVerifyBookingAppointment
}
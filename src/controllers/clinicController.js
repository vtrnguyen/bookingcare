import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinic(req.body);
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
    createClinic
}

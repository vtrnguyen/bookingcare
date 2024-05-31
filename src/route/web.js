import express from "express";
import homeController from "../controllers/homeController";
import userConTroller from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";

let router = express.Router();

let inintWebRoutes = (app) => {
    // HOME CONTROLLER
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.crudPage);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // USERS API
    router.post('/api/login', userConTroller.handleLogin);
    router.get('/api/get-all-users', userConTroller.handleGetAllUsers);
    router.post('/api/create-new-user', userConTroller.handleCreateNewUser);
    router.delete('/api/delete-user', userConTroller.handleDeleteUser);
    router.put('/api/edit-user', userConTroller.handleEditUser);
    // ALLCODES 
    router.get('/api/allcode', userConTroller.getAllCode);

    // DOCTORS API
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-booked-patient', doctorController.getListBookedPatient)
    router.post('/api/send-remedy', doctorController.postSendingRemedy);
    
    // PATIENTS API
    router.post('/api/patient-booking-appointment', patientController.postBookingAppointment);
    router.post('/api/verify-booking-appointment', patientController.postVerifyBookingAppointment);

    // SPECIALTY API
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getAllDetailSpecialtyById);

    // CLINIC API
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getAllDetailClinicById);

    return app.use("/", router);
}

module.exports = inintWebRoutes;

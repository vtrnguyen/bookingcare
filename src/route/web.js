import express from "express";
import homeController from "../controllers/homeController";
import userConTroller from "../controllers/userController";

let router = express.Router();

let inintWebRoutes = (app) => {
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

    // ALLCODES API
    router.get('/api/allcode', userConTroller.getAllCode);

    return app.use("/", router);
}

module.exports = inintWebRoutes;

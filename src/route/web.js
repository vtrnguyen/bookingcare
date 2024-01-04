import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let inintWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.crudPage);
    router.post('/post-crud', homeController.postCRUD);

    return app.use("/", router);
}

module.exports = inintWebRoutes;

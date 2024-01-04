import db from "../models";
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });  
    } catch(error) {
        console.log(error);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let crudPage = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('POST CRUD from SERVER');
}

module.exports = {
    getHomePage, getAboutPage, crudPage, postCRUD
};

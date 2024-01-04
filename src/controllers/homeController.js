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

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('--------------------');
    console.log(data);
    console.log('--------------------');
    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
}

module.exports = {
    getHomePage, getAboutPage, crudPage, postCRUD, displayGetCRUD
};

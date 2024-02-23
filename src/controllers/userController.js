import userService from "../services/userService"

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'missing inputs parameter',
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // all, id (take all or take one)
    
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        })
    }
    
    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!",
        })
    }

    let message = await userService.deleteUser(req.body.id);
    
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

module.exports = {
    handleLogin, handleGetAllUsers, 
    handleCreateNewUser, handleEditUser, handleDeleteUser,
    getAllCode
}

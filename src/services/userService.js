import db from "../models";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);            
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);

            if (isExist) {
                // user already exist
                // compare password
                let user = await db.User.findOne({
                    where: {
                        email: email
                    },
                    raw: true,
                    attributes: ["email", "roleId", "password"],
                })

                if (user) {
                    // compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }

            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in the system. Please try other email`;
            }
            resolve(userData);

        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';

            if (userId === 'all') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                })
            } 

            if (userId && userId !== 'all') {
                users = db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                })
            }

            resolve(users);

        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist
            let check = await checkUserEmail(data.email);
            
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, please try other email!',
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
    
                resolve({
                    errCode: 0,
                    message: 'OK',
                });

            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: {
                id: userId,
            },
            raw: false,
        });
        
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: "The user is not exist!",
            })
        }

        await user.destroy();

        resolve({
            errCode: 0,
            errMessage: "The user is deleted",
        });

    })
}

let updateUser = (userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userData.id) {
                resolve({
                    errCode: 2,
                    errMesage: "Missing required parameter!",
                })
            }

            let user = await db.User.findOne({
                where: { id: userData.id },
                raw: false,
            })

            if (user) {
                user.firstName = userData.firstName;
                user.lastName = userData.lastName;
                user.address = userData.address;

                await user.save();
                
                resolve({
                    errCode: 0,
                    message: "Update user succeeds!"
                })

            } else {
                resolve({
                    errCode: 1,
                    errMesage: "User is not found!",
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                res.errCode = 1;
                res.errMesage = 'Missing required parameter!!!';
            } else {
                let allcode = await db.Allcodes.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.errMessage = 'OK';
                res.data = allcode;
            }

            resolve(res);
        } catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin, getAllUsers,
    createNewUser, deleteUser, updateUser,
    getAllCodeService
}

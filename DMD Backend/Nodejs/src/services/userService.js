import { reject } from "bcrypt/promises"
import { is } from "express/lib/request";
import db from "../models/index"
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, Password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                //compare Password
                let user = await db.Users.findOne({
                    attributes: ['email', 'roleId', 'Password'],
                    where: { email: email },
                    raw: true

                });
                if (user) {
                    //compare Password
                    let check = await bcrypt.compareSync(Password, user.Password); //false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok',
                            delete user.Password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password';

                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`

                }
            } else {
                //retunr error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in you  r system. Plz try other email! `

            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Users.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
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
            if (userId === 'ALL') {
                users = await db.Users.findAll({
                    attributes: {
                        exclude: ['Password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.Users.findOne({
                    where: { id: userId }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })

}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers
}
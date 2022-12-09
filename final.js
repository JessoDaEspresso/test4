const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

//URL and Manipulator Variable
let url = "mongodb+srv://jpirrotta:3U7J1ArsQKnmHjBw@senecaweb.24svbvv.mongodb.net/?retryWrites=true&w=majority"
let finalUsers;

const test4Schema = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "password": String
});

exports.startDB = () => {
    return new Promise((resolve, reject) => {
        const db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
            if (err) {
                console.log("FAILURE");
                reject(err);
            } else {
                console.log("SUCCESS");
                finalUsers = db.model("finalUsers", test4Schema);
                resolve();
            }
        });
    });
}

exports.register = (user) => {
    return new Promise((resolve, reject) => {
        if (user.email == null || user.email.trim() == "") {
            reject("Email is required");
        }
        if (user.password == null || user.password.trim() == "") {
            reject("Password is required");
        } else {
            bcrypt.hash(user.password, 10).then((hashedPassword) => {
                user.password = hashedPassword;
                const newUser = new finalUsers(user);
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("Email already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }
                    } else {
                        resolve();
                        console.log("User Created, added to DB");
                    }
                });
            });
        }
    });
}

exports.signIn = (user) => {
    return new Promise((resolve, reject) => {
        finalUsers.findOne().where("email").equals(user.email).exec().then((data) => {
                if (data == null) {
                    reject("User " + user.email + " not found");
                } else {
                    bcrypt.compare(user.password, data.password).then((res) => {
                        if (res == true) {
                            resolve();
                        } else {
                            reject("Incorrect Password for user " + user.email);
                        }
                    });
                }
            }
        );
    });
}
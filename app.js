var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var jwt = require('jsonwebtoken');
var dateFormat = require('dateformat');
var nodemailer = require('nodemailer');
var secret = 'venkateshhsetaknev';
var date = new Date();
var todayDate = dateFormat(date, "ddd, mmm dS, yyyy, h:MM:ss TT");

require('dotenv').config();
var dbHost = process.env.DB_HOST;
var dbPort = process.env.DB_PORT;
var dbName = process.env.DB_NAME;

var httpport = process.env.port || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

// Function to generate random
function getRandomCode() {
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    var rand;
    var charec = '';
    for (var i = 0; i < 8; i++) {
        rand = Math.floor(Math.random() * str.length);
        charec += str.charAt(rand);
    }
    return charec;
}

var MongoClient = mongodb.MongoClient;

var url = `mongodb://${dbHost}:${dbPort}/${dbName}`;
//var url = 'mongodb://venkatesh:kiran@ds161041.mlab.com:61041/taskmanager';

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established : ', url);

        var users = db.collection('tmusers');
        //########################### Signup and Signin api's ##############################################
        // signup api
        app.post('/signup', function (req, res) {
            //console.log('Signup hitted');
            var name = req.body.name;
            var gender = req.body.gender;
            var empid = req.body.empid;
            var contact = req.body.contact;
            var position = req.body.position;
            var skills = req.body.skills;
            var about = req.body.about;
            var email = req.body.email;
            var password = req.body.password;
            var project = "null";
            var task = "null";
            var status = "null";
            var comments = "null";
            var assignby = "null";
            var date = "null";

            bcrypt.hash(password, saltRounds).then(function (hash) {
                var encpwd = hash;
                var user = {
                    "name": name,
                    "gender": gender,
                    "empid": empid,
                    "contact": contact,
                    "position": position,
                    "skills": skills,
                    "about": about,
                    "email": email,
                    "password": encpwd,
                    "project": project,
                    "task": task,
                    "status": status,
                    "comments": comments,
                    "assignby": assignby,
                    "date": date
                }

                users.insert(user, function (err, data) {
                    if (data) {
                        res.json({
                            "output": data
                        })
                    } else {
                        res.json({
                            "output": data
                        });
                    }
                }) //DB query end
            }) //bcrypt end
        }); // signup api end

        //signin api
        app.post('/signin', function (req, res) {
            var email = req.body.email;
            var password = req.body.password;
            users.find({
                "email": email
            }).toArray(function (err, data) {
                if (data.length != 0) {
                    bcrypt.compare(password, data[0].password).then(function (result) {
                        if (result == true) {
                            var tokenData = {
                                "tmuser": data[0].email,
                                "ts": new Date()
                            };

                            var token = jwt.sign(tokenData, secret, {
                                "expiresIn": "1d"
                            });

                            res.json({
                                "output": "success",
                                "name": data[0].name,
                                "position": data[0].position,

                                "user": {
                                    "token": token,
                                    "email": data[0].email,
                                    "name": data[0].name,
                                    "position": data[0].position,
                                    "project": data[0].project
                                }
                            });
                        } else {
                            console.log('Invalid password');
                            res.json({
                                "output": result,
                                "message": "Enter valid password..!!"
                            });
                        }
                    })

                } else {
                    res.json({
                        "output": data,
                        "message": "Email doesnot exist..!!"
                    });
                }
            })
        }) // end

        //Forgot password recovery 
        app.post('/forgotpassword', function (req, res) {
            var useremail = req.body.email;
            users.find({
                "email": useremail
            }).toArray(function (err, data) {
                if (data.length != 0) {
                    var randomPasswd = getRandomCode();
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: '<email>',
                            pass: '<password>'
                        }
                    });
                    var mailOptions = {
                        from: '<email>',
                        to: useremail,
                        subject: 'Forgot password request from Task Manager',
                        html: "Here is your temporary password.Change your password after login immediately.<br><br><b>" + randomPasswd + "</b><br><br><br><br><br><br>With regards,<br>Team TaskManager."
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.json({
                                "message": "Mail sending failed..Try again...!!!"
                            })
                        } else {
                            bcrypt.hash(randomPasswd, saltRounds).then(function (hash) {
                                users.update({
                                    "email": useremail
                                }, {
                                    $set: {
                                        "password": hash
                                    }
                                }, function (err, data) {
                                    if (data) {
                                        res.json({
                                            "message": "Check your mail for new password...!!!",
                                            "output": "success"
                                        });
                                    } else {
                                        res.json({
                                            "message": "Reset failed...Try again...!!!"
                                        });
                                    }
                                }); //update end
                            }); //bcrypt end
                        }
                    }); //send mail end
                } else {
                    res.json({
                        "message": "Email not exist..!!!",
                        "output":"success"
                    })
                }
            })
        }) // end api

        //################################## Lead Page api's #####################################################
        // Retrive Resource data
        app.get('/resourceData', function (req, res) {
            users.find({
                "position": "Resource",
                "project": "null",
                "task": "null"
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end
        // Retrive Lead Profile Details
        app.get('/leadProfile', function (req, res) {
            users.find({
                "position": "Lead"
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end
        // Retrive Lead Assign Task Details
        app.get('/leadTaskDetails', function (req, res) {
            users.find({
                "position": "Resource",
                "project": {
                    $ne: "null"
                },
                "task": {
                    $ne: "null"
                }
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end
        // Retrive Lead Assign Task Details
        app.get('/leadAssign', function (req, res) {
            users.find({
                "position": "Resource",
                "project": {
                    $ne: "null"
                }
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end
        // Assign Task to Resource on his/her project
        app.post('/assignTask', function (req, res) {
            var email = req.body.email;
            var project = req.body.project;
            var task = req.body.task;
            var assignby = req.body.assignby;
            var date = todayDate;
            users.update({
                "email": email,
                "project": project
            }, {
                $set: {
                    "task": task,
                    "assignby": assignby,
                    "date": date
                }
            }, function (err, data) {
                if (data) {
                    console.log('Successfully updated taks Assign');
                    res.json({
                        "message": "Task Assigned Successfully",
                        "output": data
                    });
                } else {
                    console.log('Not updated Task Assign');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end api
        // Lead select Resource for his/her project to assign task
        app.post('/selectResource', function (req, res) {
            var email = req.body.email;
            var project = req.body.project;
            //console.log(`${email} ${project}`);
            users.update({
                "email": email
            }, {
                $set: {
                    "project": project
                }
            }, function (err, data) {
                if (data) {
                    console.log('Resource successfully selected');
                    res.json({
                        "output": data
                    });
                } else {
                    console.log('Oops not selected....???');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end api

        //################################## Resource Page api's #####################################################
        // Retrive Resource Profile Details
        app.get('/resourceProfile', function (req, res) {
            users.find({
                "position": "Resource"
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) //  get api end
        // Resource task assign update
        app.post('/resourceStatus', function (req, res) {
            var email = req.body.email;
            var project = req.body.project;
            var status = req.body.status;
            var comments = req.body.comments;
            users.update({
                "email": email,
                "project": project
            }, {
                $set: {
                    "status": status,
                    "comments": comments
                }
            }, function (err, data) {
                if (data) {
                    console.log('Successfully updated taks Assign');
                    res.json({
                        "output": data
                    });
                } else {
                    console.log('Not updated Task Assign');
                    res.json({
                        "output": data
                    });
                }
            })
        }) // end api
        //################################# Manager page api's #############################################################
        // Retrive Manager Profile Details
        app.get('/managerProfile', function (req, res) {
            users.find({
                "position": "Manager"
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) //  get api end
        // Retrive assigned project details to Manager
        app.get('/projectDetails', function (req, res) {
            users.find({
                "project": {
                    $ne: "null"
                }
            }).toArray(function (err, data) {
                if (err) {
                    res.json({
                        "output": data
                    });
                } else {
                    //console.log('Success');
                    res.json({
                        "output": data
                    });
                }
            })
        }) //  get api end
        //#################################### Api's end ####################################################################
    } // DB end
}); //MongoClient end
app.listen(httpport, function () {
    console.log(`Server listening on ${httpport}`)
})

/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Zhenhui He           Student ID: 176117216       Date: March 01, 2022
*
* Online (Heroku) Link:    https://web700-a4.herokuapp.com
*
********************************************************************************/ 

const collegeMod = require("./modules/collegeData.js");
const path = require('path'); 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");

var app = express();

//assignment 4 middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
//end of assignment 4 middleware


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'/views/home.html'));
});
app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname, '/views/about.html'));
});
app.get("/htmlDemo",(req,res)=>{
    res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
});

//assignment 4
app.get("/students/add", (req,res)=>{
    res.sendFile(path.join(__dirname, '/views/addStudent.html'));
})

//post request for the form
app.post('/students/add', (req, res)=>{
    collegeMod.addStudent(req.body).then((returnedData)=>{
        app.set('formData', returnedData);
        res.redirect('/students');
        //console.log(returnedData);
    }).catch((err)=>{
        res.send(err);
    })
});

app.get('/students',(req,res)=>{
    res.send(app.get('formData'));
})

//end of assignment 4


//get all students
app.get("/allstudents",(req,res)=>{
    collegeMod.initialize().then(()=>{
        collegeMod.getAllStudents().then((returnedData)=>{
            res.send(returnedData);
        }).catch(()=>{
            res.json({message:"no results"});
        })
    }).catch((err)=>{
        res.send(err.message);
    })
})

//get students by course
app.get("/students",(req,res) =>{
    let students = req.query.course;
    collegeMod.initialize().then(()=>{
        collegeMod.getStudentsByCourse(students).then((returnedData)=>{
            res.send(returnedData);
        }).catch(()=>{
            res.json({message:"no results"});
        })
    }).catch((err)=>{
        res.send(err.message);
    })
});

//return all tas
app.get("/tas",(req,res)=>{
    collegeMod.initialize().then(()=>{
        collegeMod.getTAs().then((TAs)=>{
            res.send(TAs);
        }).catch(()=>{
            res.json({message:"no results"});
        })
    }).catch((err)=>{
        res.send(err.message);
    })
});

//return all the courses
app.get("/courses", (req,res) =>{
    collegeMod.getCourses().then((courses)=>{
        res.send(courses);
    }).catch(()=>{
        res.json({message:"no results"});
    })
});

//return student by number
app.get("/student/:num", (req,res)=>{
    studentNum = req.params.num
    collegeMod.getStudentByNum(studentNum).then((returnedData)=>{
        res.send(returnedData);
    }).catch(()=>{
        res.json({message:"no results"});
    })
});


app.use((req, res, next)=>{
    res.status(404).send("Page Not Found");
})
// setup http server to listen on HTTP_PORT
collegeMod.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
}).catch((err)=>{
    console.log(err.message);
})
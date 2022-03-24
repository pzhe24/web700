/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Zhenhui He       Student ID: 176117216       Date: March 24, 2022
*
* Online (Heroku) Link:     https://web700-a4.herokuapp.com
*
********************************************************************************/ 

const collegeMod = require("./modules/collegeData.js");
const path = require('path');
const exphbs = require('express-handlebars'); 
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
//assignment 5 - setting up handlebars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: (url, options)=>{
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
           },

           equal: (lvalue, rvalue, options)=>{
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
    }
}));

//to fix the highlighting of the nav
app.use((req,res,next)=>{
    let route = req.path.substring(1);
    app.locals.activeRoute ="/"+(isNaN(route.split('/')[1])?route.replace(/\/(?!.*)/,""):route.replace(/\/(.*)/,""));
    //console.log(app.locals.activeRoute);
    next();
});

app.set("view engine", ".hbs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/htmlDemo",(req,res)=>{
    res.render("htmlDemo");
});

//assignment 4
app.get("/students/add", (req,res)=>{
    res.render("addStudent");
})

//assignment 4 middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
//end of assignment 4 middleware


//post request for the form
app.post('/students/add', (req, res)=>{
    collegeMod.addStudent(req.body).then((returnedData)=>{
        app.set('formData', returnedData);
        res.redirect('/studentss');
        //console.log(returnedData);
    }).catch((err)=>{
        res.send(err);
    })
});

app.get('/studentss',(req,res)=>{
    res.send(app.get('formData'));
})

//end of assignment 4

//assignment 5 updateStudent
app.post("/student/update", (req,res)=>{
    collegeMod.updateStudents(req.body).then((data)=>{
       // res.redirect("/student/" + req.body.studentNum);
       app.set('updatedData', data);
       res.redirect("/updatedstudents");
       //console.log(data);
    })
})

//to handle the updated data. assignment 5
app.get('/updatedstudents',(req,res)=>{
    returnedData = app.get('updatedData');
    res.render('students',{studentsList:returnedData});
})


//get all students
app.get("/allstudents",(req,res)=>{
    collegeMod.initialize().then(()=>{
        collegeMod.getAllStudents().then((returnedData)=>{
            res.render("students",{studentsList:returnedData});
        }).catch(()=>{
            res.render("students",{message: "no results"});
        })
    }).catch((err)=>{
        res.render("students",err);
    })
})

//assignment 5 getcoursebyid
app.get("/course/:id",(req,res)=>{
    let id = req.params.id;
    collegeMod.getCoursebyId(id).then((returnedData)=>{
        res.render("course",{course:returnedData});
    }).catch((err)=>{
        res.send(err);
    })
})

//return all the courses
app.get("/courses", (req,res) =>{
    collegeMod.getCourses().then((returnedData)=>{
        res.render("courses",{coursesList:returnedData});
    }).catch(()=>{
        res.render("courses",{message: "no results"});
    })
});


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



//return student by number
app.get("/student/:num", (req,res)=>{
    studentNum = req.params.num
    collegeMod.getStudentByNum(studentNum).then((returnedData)=>{
        res.render("student",{student:returnedData})
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
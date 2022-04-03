/*********************************************************************************
 * WEB700 – Assignment 06
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Zhenhui He       Student ID: 176117216       Date: April 03, 2022
 *
 * Online (Heroku) Link:     https://web700-assignment6.herokuapp.com
 *
 ********************************************************************************/

const collegeMod = require("./modules/collegeData.js");
const path = require("path");
const exphbs = require("express-handlebars");
var express = require("express");
const { redirect } = require("express/lib/response");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;
//assignment 5 - setting up handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: (url, options) => {
        return (
          "<li" +
          (url == app.locals.activeRoute
            ? ' class="nav-item active" '
            : ' class="nav-item" ') +
          '><a class="nav-link" href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },

      equal: (lvalue, rvalue, options) => {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

//to fix the highlighting of the nav
app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  //console.log(app.locals.activeRoute);
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

//assignment 4
app.get("/students/add", (req, res) => {
  collegeMod
    .getCourses()
    .then((data) => {
      res.render("addStudent", { courses: data });
    })
    .catch(() => {
      res.render("addStudent", { courses: [] });
    });
});

//assignment 4 middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//end of assignment 4 middleware

//post request for the form
app.post("/students/add", (req, res) => {
  collegeMod
    .addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send(err);
    });
});
//end of assignment 4

//assignment 5 updateStudent
app.post("/student/update", (req, res) => {
  collegeMod
    .updateStudents(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((err) => {
      res.send(err);
    });
});

//get all students
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeMod
      .getStudentsByCourse(req.query.course)
      .then((returnedData) => {
        if (returnedData.length > 0) {
          res.render("students", { studentsList: returnedData });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    collegeMod
      .getAllStudents()
      .then((returnedData) => {
        if (returnedData.length > 0) {
          res.render("students", { studentsList: returnedData });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((err) => {
        //res.render("students",{message: "no results"});
        res.send(err);
      });
  }
});

//assignment 5 getcoursebyid
app.get("/course/:id", (req, res) => {
  let id = req.params.id;
  collegeMod
    .getCoursebyId(id)
    .then((returnedData) => {
      if (returnedData) {
        console.log(returnedData);
        res.render("course", { course: returnedData });
      } else {
        res.status(404).send("Course Not Found");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//return all the courses
app.get("/courses", (req, res) => {
  collegeMod
    .getCourses()
    .then((returnedData) => {
      if (returnedData.length > 0) {
        res.render("courses", { coursesList: returnedData });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//return student by number
app.get("/student/:num", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  collegeMod
    .getStudentByNum(req.params.num)
    .then((data) => {
      if (data) {
        viewData.student = data; //store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // set student to null if there was an error
    })
    .then(collegeMod.getCourses)
    .then((data) => {
      viewData.courses = data; // store course data in the "viewData" object as "courses"
      // loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching
      // viewData.courses object
      for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
          viewData.courses[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.courses = []; // set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // if no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // render the "student" view
      }
    });
  console.log(viewData);
});

//assignment 6 course new routes
app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
  collegeMod
    .addCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/course/update", (req, res) => {
  collegeMod
    .updateCourse(req.body)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/course/delete/:id", (req, res) => {
  let id = req.params.id;
  collegeMod
    .deleteCourseById(id)
    .then(() => {
      res.redirect("/courses");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
});

app.get("/student/delete/:studentNum", (req, res) => {
  let studentNum = req.params.studentNum;

  collegeMod
    .deleteStudentByNum(studentNum)
    .then(() => {
      res.redirect("/students");
    })
    .catch(() => {
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});

//return all tas
app.get("/tas", (req, res) => {
  collegeMod
    .initialize()
    .then(() => {
      collegeMod
        .getTAs()
        .then((TAs) => {
          res.send(TAs);
        })
        .catch(() => {
          res.json({ message: "no results" });
        });
    })
    .catch((err) => {
      res.send(err.message);
    });
});

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
collegeMod
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

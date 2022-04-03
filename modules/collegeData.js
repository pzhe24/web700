// class Data {
//     constructor(students, courses){
//         this.students = students;
//         this.courses = courses;
//     }
// }

//const path = require('path');

// let dataCollection = null;
// let studentData = [];
// let courseData = [];

//const Sequelize = require('sequelize');
//new Sequelize('database', 'user', 'password,{
//host: ' ',
//     dialect: 'postgres',
//     port: 5432.
//     dialectOptions:{
//         ssl:{rejectUnauthorized: false}
//     },
//     query:{raw:true}
// });

const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d9uttuekqlu1cp",
  "pbohvwhnuhycco",
  "2cf8ab8c15c4e100e06c02d430db252506b0855ce476b98471e3682a56209502",
  {
    host: "ec2-18-214-134-226.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

var Student = sequelize.define("Student", {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "project_id" as a primary key
    autoIncrement: true, // automatically increment the value
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

var Course = sequelize.define("Course", {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

Course.hasMany(Student, { foreignKey: "course" });

//initialize function that reads the 2 files and sets them to their own variables.
module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(function () {
        resolve();
      })
      .catch(() => {
        reject("unable to sync the database");
      });
  });
};

//getAllStudents function that returns the student object.
module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

//Assignment 3 Functions
module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { course: course } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};
module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { studentNum: num } })
      .then((data) => {
        resolve(data[0]);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

//getCourses function that returns all the courses in the file.
module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    Course.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};
//Assignment 4 addStudent function
module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (var prop in studentData) {
      if (studentData[prop] == "") {
        studentData[prop] = null;
      }
    }

    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to create student");
      });
  });
};

//assignment 5 get course
module.exports.getCoursebyId = function (id) {
  return new Promise((resolve, reject) => {
    Course.findAll({ where: { courseId: id } })
      .then((data) => {
        // console.log(data);
        resolve(data[0]);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

//assignment 5 - updateStudent
module.exports.updateStudents = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;

    for (var prop in studentData) {
      if (studentData[prop] == "") {
        studentData[prop] = null;
      }
    }

    Student.update(studentData, {
      where: { studentNum: studentData.studentNum },
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to update student");
      });
  });
};

//getTAs function that returns all the students where TA = true.
//have to make an empty object, and concatenate it in a for loop,
//because resolve can  only return 1 object, which when ran it only returned the first result.
module.exports.getTAs = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};

//assignment 6 addCourse function
module.exports.addCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (var prop in courseData) {
      if (courseData[prop] == "") {
        courseData[prop] = null;
      }
    }

    Course.create(courseData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to add course");
      });
  });
};

//asssignment 6 updateCourse function
module.exports.updateCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (var prop in courseData) {
      if (courseData[prop] == "") {
        courseData[prop] = null;
      }
    }
    Course.update(courseData, { where: { courseId: courseData.courseId } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to update course");
      });
  });
};

//assignment 6 deleteCourseById function
module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({ where: { courseId: id } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Cannot delete course");
      });
  });
};

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({ where: { studentNum: studentNum } })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Cannot delete student");
      });
  });
};

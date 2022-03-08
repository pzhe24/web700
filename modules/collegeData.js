class Data {
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

const path = require('path'); 

let dataCollection = null;
let studentData = [];
let courseData = [];

//initialize function that reads the 2 files and sets them to their own variables.
module.exports.initialize = function(){
    const fs = require('fs');
    return new Promise(function(resolve, reject){
        fs.readFile(path.join(__dirname,'../data/students.json'), 'utf8', (err,data)=>{
            if(err){
                reject(err);
            }else{
                studentData = JSON.parse(data);
                fs.readFile(path.join(__dirname,'../data/courses.json'), 'utf8', (err, data)=>{
                    if(err){
                        reject(err);
                    }else{
                        courseData = JSON.parse(data);
                        dataCollection = new Data(studentData, courseData);
                        resolve(dataCollection);
                    }
                });
            }
        });
    })
}

//getAllStudents function that returns the student object.
module.exports.getAllStudents = function(){
    let student = dataCollection.students;
    return new Promise(function(resolve, reject){
        if(!(student.length == 0)){
            //console.log(student);
            resolve(student);
        }else{
            reject("NO STUDENT RESULTS RETURNED");
        }

    })
}

//getTAs function that returns all the students where TA = true.
//have to make an empty object, and concatenate it in a for loop,
//because resolve can  only return 1 object, which when ran it only returned the first result.
module.exports.getTAs = function(){
    let TAs = dataCollection.students;
    let results= [];
    return new Promise(function(resolve, reject){
        if(!(TAs.length == 0)){
            for(let i=0;i<TAs.length;i++){
                if(TAs[i].TA == true){
                    //console.log(TAs[i]);
                    results.push(TAs[i]);
                    resolve(results);
                }
            }
            //console.log(count+" students have TAs");
        }
        reject("NO TA RESULTS");
    })
}
//getCourses function that returns all the courses in the file.
module.exports.getCourses = function(){
    let course = dataCollection.courses;
    return new Promise(function(resolve, reject){
        if(!(course.length == 0)){
            //console.log(course);
            resolve(course);
        }else{
            reject("no course information received");
        }
    })
}
//Assignment 3 Functions
module.exports.getStudentsByCourse = function(course){
    let student = dataCollection.students;
    return new Promise(function(resolve, reject){
        let results = [];
        for(var i=0;i<student.length;i++){
            if(student[i].course == course){
                results.push(student[i]);
                resolve(results);
            }
        }
        if(results.length == 0){
            reject("no courses returned");
        }
    })
}
module.exports.getStudentByNum = function(num){
    let student = dataCollection.students;
    return new Promise(function(resolve, reject){
        let result = [];
        for(var i=0;i<student.length;i++){
            if(student[i].studentNum == num){
                resolve(student[i]);
            }
        }
        if(result.length == 0){
            reject("no student returned");
        }
    })
}

//Assignment 4 addStudent function
module.exports.addStudent = function(formData){  
    return new Promise(function(resolve, reject){
        if(formData.TA == undefined){
            formData.TA = false;
        }else{
            formData.TA = true;
        }
        formData.studentNum = dataCollection.students.length + 1;
        
        //object keys in different order if i do not specify it because req.body takes the information in the order of the form.
        dataCollection.students.push({"studentNum":formData.studentNum, "firstName":formData.firstName,
        "lastName":formData.lastName,"email":formData.email,"addressStreet":formData.addressStreet,
        "addressCity":formData.addressCity,"addressProvince":(formData.addressProvince).toUpperCase(),
        "TA":formData.TA,"status":formData.status,"course":parseInt(formData.course)});

        resolve(dataCollection.students);
    })
}



const mongoose = require("mongoose");
const validator = require("validator");


const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("ایمیل معتبر نمی‌باشد");
          }
        }
    },
    major: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 16,
        max: 99
    },
    description:{
        type: String,
        required: true
    },
    cv_file:{
        type: String
    }
}, {
    timestamps: true
});

// http://localhost:3000/uploads/60e33bc8d3f06d2355ef01b8/9713015_q4.pdf

schema.methods.toJSON = function () {
    const apply = this
    const applyObject = apply.toObject()
    
    const url = `/api/uploads/`+ applyObject.cv_file;
    if (applyObject.cv_file) {
        delete applyObject.cv_file;
        applyObject.cv_url = url;
    }
    return applyObject;
};



const Apply = new mongoose.model("Apply", schema);

module.exports = Apply;

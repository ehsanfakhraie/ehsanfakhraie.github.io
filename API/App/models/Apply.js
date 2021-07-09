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
    },
    opportunity:{
        type: mongoose.Types.ObjectId,
        ref: "Opportunity",
        required: true
    }
}, {
    timestamps: true
});


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

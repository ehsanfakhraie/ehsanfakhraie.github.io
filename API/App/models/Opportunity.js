const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

schema.virtual('applies', {
    ref: 'Applies',
    localField: '_id',
    foreignField: 'opportunity.opportunity'  
})

const Opportunity = new mongoose.model("Opportunity", schema);

module.exports = Opportunity;
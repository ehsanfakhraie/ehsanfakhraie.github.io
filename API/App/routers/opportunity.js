const express = require('express');
const Opportunity = require('../models/Opportunity')
const Apply = require('../models/Apply')
const {
    authenticateAdmin
} = require('../middleware/adminAuth');


const router = new express.Router();

router.post("/", authenticateAdmin, async (req, res) => {
    try {
        let opportunity = new Opportunity(req.body)
        await opportunity.save();
        res.status(201).send(opportunity);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get("/" , async (req, res) => {
    try {
        const opportunities = await Opportunity.find();
        res.send(opportunities);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/getAllApplies/:id', authenticateAdmin, async(req,res)=>{
    try{
        let foundApplies = await Apply.find({'opportunity':req.params.id}).populate("opportunity")
        res.send(foundApplies)
    }catch(err){
        res.status(500).send(err.message);   
    }
})

module.exports = router;

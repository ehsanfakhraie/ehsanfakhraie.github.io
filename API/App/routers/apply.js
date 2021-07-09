const express = require('express');
const Apply = require('../models/Apply')
const {
    authenticateAdmin
} = require('../middleware/adminAuth');


const router = new express.Router();

router.post("/", async (req, res) => {
    try {

        if(!req.files) {
            res.status(400).send({
                message: 'No file uploaded'
            });
        } else {
            let cv_file = req.files.cv_file;
            const apply = new Apply(req.body);


            let url = apply._id + "/" +  cv_file.name
            //Use the mv() method to place the file in upload directory
            cv_file.mv('./uploads/' + url);


            apply.cv_file = url

            //save and send response
            await apply.save();
            res.status(201).send(apply);
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.get("/", authenticateAdmin , async (req, res) => {
    try {
        const applies = await Apply.find().populate("opportunity");
        res.send(applies);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/find/:id", authenticateAdmin, async (req, res) => {
    try {
        const apply = await Apply.findById(req.params.id);
        if (!apply) {
            res.status(404).send({message:"Company Not Found"});
            return;
        }
        res.status(200).send(apply);
    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

router.post('/createnote', [

    body('title', 'Enter A Valid Title').isLength({ min: 3 }).exists().trim(),
    body('description', 'Enter A Valid Description').isLength({ min: 3 }).exists().trim(),
    body('tag', 'Enter A Valid Tag').optional().isLength({ min: 3 }).trim(),

], fetchuser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const userid = req.user.id;

        const note = await Note.create({
            title: req.body.title,
            description: req.body.description,
            user: userid,
            tag: req.body.tag
        });

        return res.status(201).json("Note Created Successully!");


    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: "Internal Server Error." });
    }

}
);


router.get('/readnotes', fetchuser, async (req, res) => {

    try {

        const userid = req.user.id;
        let note = await Note.find({ user: userid });
        return res.status(200).json(note);

    } catch (error) {

        console.error(error);
        return res.status(500).json({ errorMessage: "Internal Server Error." });
    }
});


router.put('/update/:id', [

    body('title', 'Enter A Valid Title').isLength({ min: 3 }).exists().trim(),
    body('description', 'Enter A Valid Description').isLength({ min: 3 }).exists().trim(),
    body('tag', 'Enter A Valid Tag').optional().isLength({ min: 3 }).trim(),

], fetchuser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const userid = req.user.id;
        const noteid = req.params.id;

        let note = await Note.findById(noteid);
        if (!note) {
            return res.status(400).json("Note Not Found.");
        }

        if (userid !== note.user.toString()) {
            return res.status(400).json("You Are Not Allowed.");
        }
        note = await Note.findById(noteid);

        const newnote = {};

        if (req.body.title) { newnote.title = req.body.title; }
        if (req.body.description) { newnote.description = req.body.description; }
        if (req.body.tag) { newnote.tag = req.body.tag; }

        note = await Note.findByIdAndUpdate(noteid,{$set: newnote},{new:true});

        return res.status(200).json("Updated");

    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: "Internal Server Error." });
    }


});


router.delete('/delete/:id', fetchuser, async (req, res) => {

    try {
        const noteid = req.params.id;

        let note = await Note.findById(noteid);
        if (!note) {
            return res.status(400).json("Note Not Found.");
        }

        if (req.user.id !== note.user.toString()) {
            return res.status(400).json("You Are Not Allowed.");
        }
        note = await Note.findByIdAndDelete(noteid);
        return res.status(200).json("Deleted");

    } catch (error) {

        console.error(error);
        return res.status(500).json({ errorMessage: "Internal Server Error." });
    }

});

module.exports = router;

const express = require('express');
const router = express.Router();
const Inquiry = require('../Models/eventInquiryFormModel');

router.post('/public-inquiry', async (req, res) =>{
    try{
        const {name, email, phone, message } = req.body;
        if(!name || !email || !phone || !message){
            return res.status(400).json({message: "One or more mandatory fields are required" });
        }
        const newInquiry = new Inquiry({ name, email, phone, message });
        await newInquiry.save();

        res.status(201).json({ message: "Inquiry Submitted Successfully", inquiry: newInquiry});
    } catch(error){
        console.error("something went wrong:", error);
    }
});

router.get('/all-event-inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error('Error fetching inquiries:', err.message);
    res.status(500).json({ error: 'Failed to fetch event inquiries' });
  }
});

router.patch('/update-inquiry-note/:id', async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({ error: 'Note cannot be empty' });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { internalNote: note },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Note updated successfully', updatedInquiry });
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/delete-inquiry/:id', async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete Inquiry Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
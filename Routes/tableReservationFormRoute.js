const express = require('express');
const router = express.Router();
const TableReservation = require('../Models/tableReservationFormModel');
const protectedResource  = require('../middleware/protectedResource');

router.post('/create-tableReservation', async (req, res) => {
    try{
        const { name, email, phone, date, time, guests } = req.body;

        if(!name || !email || !phone || !date || !time || !guests) {
            return res.status(400).json({ error: "One or more mandataory fields are required" });
        }
        const newtableReservation = new TableReservation({ name, email, phone, date, time, guests });
        await newtableReservation.save();
        res.status(201).json({ message: "Table Reservation created Successfully", tableReservation: newtableReservation });
    } catch (error) {
        console.error("Something went wrong:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/create-tableReservation', protectedResource, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: "One or more mandatory fields are missing" });
    }

    const newReservation = new TableReservation({name, email, phone, date, time, guests});

    await newReservation.save();
    res.status(201).json({
      message: "Table reservation created successfully",
      reservation: newReservation
    });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get('/all-reservations', async (req, res) => {
  try {
    const allReservations = await TableReservation.find().sort({ createdAt: -1 });
    res.status(200).json(allReservations);
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/delete-tableReservation', async (req, res) => {
  try {
    const deletedReservation = await TableReservation.findByIdAndDelete(req.params.id);
    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Table Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
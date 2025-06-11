const express = require('express');
const router = express.Router();
const TableReservation = require('../Models/tableReservationFormModel');
const Inquiry = require('../Models/eventInquiryFormModel');
const protectedResource = require('../middleware/protectedResource');

router.get('/stats', protectedResource, async(req, res) => {
    try {
        const totalReservations = await TableReservation.countDocuments();
        const confirmedReservations = await TableReservation.countDocuments({ status: "Confirmed" });

        const totalInquires = await Inquiry.countDocuments();
        const newInquires = await Inquiry.countDocuments({ status: 'New' });

        res.json({ totalReservations, confirmedReservations, totalInquires, newInquires });
    } catch (error) {
        res.status(500).json({ message: 'Dashboard stats failed' });
    }
});

router.patch('/update-reservationStatus/:id', async(req, res) => {
    const {status} = req.body;
    const validStatus = ['New', 'Confirmed', 'Cancelled'];
    if(!validStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid Status" });
    }
    
    const updatedReservation = await TableReservation.findByIdAndUpdate( req.params.id, {status}, {new: true} );
    res.json({ message: "Reservations status updated", updatedReservation });
});

router.patch('/update-inquiryStatus/:id', async (req, res) => {
    const {status, notes} = req.body;
    const updatedInquiry = await Inquiry.findByIdAndUpdate( req.params.id, {status, notes }, { new: true });
    res.json({ message: "Inquiry updated", updatedInquiry });
});

module.exports = router;
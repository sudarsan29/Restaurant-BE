const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URL} = require('./config');

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
});

mongoose.connection.on('connected',  () => {
    console.log("MongoDB connected");
});

mongoose.connection.on('error', (error) => {
    console.log('MongoDB not connected')
});

app.use(cors());
app.use(express.json());

require('./Models/userModel');
require('./Models/tableReservationFormModel');
require('./Models/eventInquiryFormModel');

app.use(require('./Routes/userRoute'));
app.use(require('./Routes/tableReservationFormRoute'));
app.use(require('./Routes/eventInquiryFormRoute'));
app.use(require('./Routes/adminRoute'));

app.listen(PORT, () => {
    console.log("Server started")
});
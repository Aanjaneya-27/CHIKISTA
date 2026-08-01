 const express = require('express');
 const cors = require('cors');
 const userRoutes = require('./routes/userRoutes');
 const requisitionRoutes = require('./routes/requisitionRoutes');
 const masterRoutes = require('./routes/MasterRoutes');
 const rentalRoutes = require('./routes/rentalRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/master', masterRoutes);
app.use("/api/rental", rentalRoutes);

module.exports = app;

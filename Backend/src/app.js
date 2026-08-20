//  const express = require('express');
//  const cors = require('cors');
//  const userRoutes = require('./routes/userRoutes');
//  const requisitionRoutes = require('./routes/requisitionRoutes');
//  const masterRoutes = require('./routes/MasterRoutes');
//  const rentalRoutes = require('./routes/rentalRoutes');

// const app = express();

// app.use(express.json());
// app.use(cors());

// app.use('/api/users', userRoutes);
// app.use('/api/requisitions', requisitionRoutes);
// app.use('/api/master', masterRoutes);
// app.use("/api/rental", rentalRoutes);

// module.exports = app;

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const requisitionRoutes = require('./routes/requisitionRoutes');
const masterRoutes = require('./routes/MasterRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();

app.use(
  cors({
    origin: [
      "https://chikista.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/rental', rentalRoutes);

module.exports = app;
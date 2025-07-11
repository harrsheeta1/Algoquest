require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));

app.listen(5000, () => console.log("Server started on port 5000"));

const progressRoutes = require('./routes/progressRoutes');
app.use('/api', progressRoutes);

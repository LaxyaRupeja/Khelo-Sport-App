const express = require('express');
const connectToDatabase = require('./Configs/db');
const router = require('./Routes/server.routes');
const cors = require("cors")

const app = express();
app.use(cors())
app.use(express.json());
app.use('/', router);
app.listen(8080, connectToDatabase());

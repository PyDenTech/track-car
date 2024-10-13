const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Dependendo das configurações do RDS, talvez precise habilitar/desabilitar isso
    }
});

app.post('/tracker', async (req, res) => {
    const { lat, lon, speed, time, battery } = req.body;
    try {
        await pool.query('INSERT INTO tracking_data (lat, lon, speed, time, battery) VALUES ($1, $2, $3, $4, $5)', [lat, lon, speed, time, battery]);
        res.send('Data received');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving data');
    }
});

app.listen(7700, () => {
    console.log('Server is running on port 7700');
});

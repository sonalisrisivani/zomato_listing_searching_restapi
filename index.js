const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Required for making API requests from different origins
const app = express();

app.use(cors()); // Enable CORS for cross-origin requests

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sonali@21',
  database: 'zomato'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// API endpoint to search restaurants based on query and location
app.get('/api/search', (req, res) => {
  const { q, location, sort } = req.query;
  console.log(`Search query: ${q}, Location query: ${location},  Sort by: ${sort}`);

  const query = `%${q}%`;
  let sql = `
    SELECT r.*, l.city, l.address, l.locality
    FROM restaurants r
    JOIN locations l ON r.location_id = l.id
    WHERE (r.name LIKE ? OR r.cuisines LIKE ?)
  `;
  const params = [query, query];

  if (location) {
    const locationQuery = `%${location}%`;
    sql += `
      AND (l.city LIKE ? OR l.address LIKE ? OR l.locality LIKE ? OR l.country_id = (SELECT id FROM countries WHERE name LIKE ?))
    `;
    params.push(locationQuery, locationQuery, locationQuery, locationQuery);
  }

  const sortColumn = sort ? mysql.escapeId(sort) : 'aggregate_rating';
  sql += ` ORDER BY ${sortColumn} DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Send the results as JSON
  });
});

// API endpoint to get details of a specific restaurant by ID
app.get('/api/restaurant/:id', (req, res) => {
  const { id } = req.params;

  const sqlRestaurant = `
    SELECT r.*, l.city, l.address, l.locality
    FROM restaurants r
    JOIN locations l ON r.location_id = l.id
    WHERE r.id = ?
  `;
  db.query(sqlRestaurant, [id], (err, restaurantResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (restaurantResults.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurantResults[0]); // Send the restaurant data as JSON
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const mysql = require('mysql');
const path= require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


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



// API endpoint to search restaurants based on query and location and sort
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



// API endpoint to get paginated restaurant data and sorting
app.get('/api/restaurants', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 if not specified
  const start = parseInt(req.query.start, 10) || 0; // Default to 0 if not specified
  
 
  const sqlPaginated = `
    SELECT r.id, r.name, r.aggregate_rating, r.votes, l.city AS location
    FROM restaurants r
    JOIN locations l ON r.location_id = l.id    
    LIMIT ? OFFSET ?
  `;

  // Execute the SQL query with the limit and start parameters
  db.query(sqlPaginated, [limit, start], (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

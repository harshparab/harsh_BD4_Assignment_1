const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: './database/database.sqlite',
    driver: sqlite3.Database,
  });
})();

// endpoint 1
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants;';

  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();

    if (result.restaurants.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: 'No restaurants found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 2
async function fetchRestaurantByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?;';

  let response = await db.all(query, [id]);

  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let result = await fetchRestaurantByID(id);

    if (result.restaurants.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: 'No restaurant found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 3
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?;';

  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;

  try {
    let result = await fetchRestaurantByCuisine(cuisine);

    if (result.restaurants.length > 0) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: `No restaurant found with ${cuisine} cuisine` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 4
async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?;';

  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let result = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);

    if (result.restaurants.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No restaurant found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 5
async function sortRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC;';

  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await sortRestaurantsByRating();

    if (result.restaurants.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No restaurant found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 6
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes;';

  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();

    if (result.dishes.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No dishes found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 7
async function fetchDishByID(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?;';

  let response = await db.all(query, [id]);

  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;

  try {
    let result = await fetchDishByID(id);

    if (result.dishes.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No dishes found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 8
async function filterDishByIsVeg(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?;';

  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let result = await filterDishByIsVeg(isVeg);

    if (result.dishes.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No dishes found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// endpoint 9
async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price DESC;';

  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await sortDishesByPrice();

    if (result.dishes.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: `No dishes found` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

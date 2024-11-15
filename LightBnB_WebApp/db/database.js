const { query } = require("express");
const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `
      INSERT INTO users (
        name,
        email,
        password
      )
      VALUES (
        $1,
        $2,
        $3
      )
      RETURNING *;
      `,
      [user.name, user.email, user.password]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(
      `
      SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
      FROM reservations
      LEFT JOIN properties ON properties.id = reservations.property_id
      JOIN property_reviews ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      ORDER BY start_date
      LIMIT $2
      `,
      [guest_id, limit]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit) {

  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `
    AND city LIKE $${queryParams.length}`;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND (cost_per_night >= $${
      queryParams.length - 1
    } AND cost_per_night <= $${queryParams.length})\n`;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `
    AND owner_id = $${queryParams.length}`;
  }

  queryParams.push(limit);
  console.log(queryParams);
  queryString += `
  GROUP BY properties.id`;
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;
  }
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ]
  return pool
    .query(
      `
      INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      country,
      street,
      city,
      province,
      post_code
      )
      VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14
      )
      RETURNING *;
      `,
      values
    )
    .then((res) => {
      console.log(res.rows);
      return res.rows[0];
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

const properties = require('./json/properties.json');
const users = require('./json/users.json');
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

 const getUserWithEmail = (email) => {
  return pool
    .query(
      `SELECT *
      FROM users
      WHERE users.email = $1;`,
      [email]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithId = (id) => {
  return pool
    .query(
      `SELECT *
      FROM users
      WHERE users.id = $1;`,
      [id]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

 const addUser = (user) => {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

 const getAllReservations = (userId) => {
  return pool
    .query(
      `SELECT * FROM reservations
      JOIN properties ON property_id = properties.id
       WHERE guest_id = $1 LIMIT 10;`, 
       [userId]
    )
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */



 const getAllProperties = function (options, limit) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `WHERE cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `WHERE cost_per_night <= $${queryParams.length} `;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `WHERE average_rating >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

// const property = {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
// }

const addProperty = (property) => {
  const queryParams = [];
  let queryString =
  `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
    street, city, province,post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)`;
  if (property.owner_id) {
    queryParams.push(`${property.owner_id}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.title) {
    queryParams.push(`${property.title}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.description) {
    queryParams.push(`${property.description}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.thumbnail_photo_url) {
    queryParams.push(`${property.thumbnail_photo_url}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.cover_photo_url) {
    queryParams.push(`${property.cover_photo_url}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.cost_per_night) {
    queryParams.push(`${property.cost_per_night}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.street) {
    queryParams.push(`${property.street}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.city) {
    queryParams.push(`${property.city}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.province) {
    queryParams.push(`${property.province}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.post_code) {
    queryParams.push(`${property.post_code}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.country) {
    queryParams.push(`${property.country}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.parking_spaces) {
    queryParams.push(`${property.parking_spaces}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.number_of_bathrooms) {
    queryParams.push(`${property.number_of_bathrooms}`);
    queryString += `VALUES $${queryParams.length} `;
  }
  if (property.number_of_bedrooms) {
    queryParams.push(`${property.number_of_bedrooms}`);
    queryString += `VALUES $${queryParams.length} `;
  }

  // queryParams.push(limit);
  // queryString += `
  // GROUP BY properties.id
  // ORDER BY cost_per_night
  // LIMIT $${queryParams.length};
  // `;
  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }
exports.addProperty = addProperty;

const { Database } = require("../../../database/database");

/**
 * Checks ownership for a Car.
 */
const checkCarOwnership = async (userId, carId) => {
  const database = new Database();
  const conn = database.connect();
  try {
    const query = `SELECT 
                    c.ID_Car,
                    c.ID_Seller,
                    CASE 
                        WHEN c.ID_Seller = ? THEN 1
                        ELSE 0 
                    END as can_modify
                    FROM ToPaD.Car c
                    WHERE c.ID_Car = ?;`;
    const [rows] = await conn.promise().query(query, [userId, carId]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    database.disconnect(conn);
  }
};

/**
 * Checks ownership for a Reservation.
 */
const checkReservationOwnership = async (userId, reservationId) => {
  const database = new Database();
  const conn = database.connect();
  try {
    const query = `SELECT 
                    r.ID_Reservation,
                    r.ID_Client,
                    CASE 
                        WHEN r.ID_Client = ? THEN 1
                        ELSE 0 
                    END as can_modify
                    FROM ToPaD.reservations r
                    WHERE r.ID_Reservation = ?;`;
    const [rows] = await conn.promise().query(query, [userId, reservationId]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    database.disconnect(conn);
  }
};

const checkReviewOwnership = async (userId, carId) => {
  const database = new Database();
  const conn = database.connect();
  try {
    const query = `SELECT 
                    r.ID_Car,
                    r.ID_client,
                    CASE 
                        WHEN r.ID_client = ? THEN 1
                        ELSE 0 
                    END as can_modify
                    FROM ToPaD.Review r
                    WHERE r.ID_Car = ?;`;
    const [rows] = await conn.promise().query(query, [userId, carId]);
    console.log(rows);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    database.disconnect(conn);
  }
};

module.exports = {
  checkCarOwnership,
  checkReservationOwnership,
  checkReviewOwnership,
};

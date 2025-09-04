const connection = require('./connection');

const getAll = async () => {
  const [occurrences] = await connection.execute('SELECT * FROM occurrences');
  return occurrences;
};

const createOccurrence = async (occurrence) => {
  const { title, status } = occurrence;
  const dateUTC = new Date().toISOString().slice(0, 19).replace("T", " ");


  const query = 'INSERT INTO occurrences(title, status, created_at) VALUES (?, ?, ?)';

  const [createdOccurrence] = await connection.execute(query, [title, status, dateUTC]);
  return {insertId: createdOccurrence.insertId};
};

const deleteOccurrence = async (id) => {
  const [removedOccurrence] = await connection.execute('DELETE FROM occurrences WHERE id = ?', [id]);
  return removedOccurrence;
};

const updateOccurrence = async (id, occurrence) => {
  const { title, status } = occurrence;
  
  const query = 'UPDATE occurrences SET title = ?, status = ? WHERE id = ?';

  const [updatedOccurrence] = await connection.execute(query, [title, status, id]);
  return updatedOccurrence;
};

module.exports = {
  getAll,
  createOccurrence,
  deleteOccurrence,
  updateOccurrence,
};

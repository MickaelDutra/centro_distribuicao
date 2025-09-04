const occurrencesModel = require('../models/occurrencesModel');


const getAll = async (_request, response) => {
  const occurrences = await occurrencesModel.getAll();
  return response.status(200).json(occurrences);
};

const createOccurrence = async (request, response) => {
  const createdOccurrence = await occurrencesModel.createOccurrence(request.body);
  return response.status(201).json(createdOccurrence);
};

const deleteOccurrence = async (request, response) => {
  const { id } = request.params;

  await occurrencesModel.deleteOccurrence(id);
  return response.status(204).json();
};

const updateOccurrence = async (request, response) => {
  const { id } = request.params;

  await occurrencesModel.updateOccurrence(id, request.body);
  return response.status(204).json();
};

module.exports = {
  getAll,
  createOccurrence,
  deleteOccurrence,
  updateOccurrence,
};

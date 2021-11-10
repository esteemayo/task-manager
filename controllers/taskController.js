const Task = require('../models/Task');
const factory = require('./handlerFactory');

exports.getAllTasks = factory.getAll(Task);
exports.getTaskById = factory.getOne(Task);
exports.getTaskBySlug = factory.getSlug(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
exports.deleteTask = factory.deleteOne(Task);

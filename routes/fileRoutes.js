const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Task endpoints matching frontend API
router.get('/folders/:folderId/tasks', TaskController.getUsertask);
router.post('/folders/:folderId/tasks', TaskController.postaddtask);
router.put('/tasks/:taskId', TaskController.postEdittask);
router.delete('/tasks/:taskId', TaskController.postDeletetask);

module.exports = router;

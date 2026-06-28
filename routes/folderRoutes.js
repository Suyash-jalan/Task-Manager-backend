const express = require('express');
const folderRouter = express.Router();

const folderController = require('../controllers/folderController');

folderRouter.get('/', folderController.getUserfolder);
folderRouter.post('/', folderController.postaddfolder);
folderRouter.put('/:folderId', folderController.postEditfolder);
folderRouter.delete('/:folderId', folderController.postDeletefolder);

module.exports = folderRouter;

const Folder = require("../models/Folder");
const Task = require("../models/Task");

exports.getUserfolder = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;

    Folder.find({ userID: userId })
        .then(folders => {
            res.status(200).json(folders);
        })
        .catch(err => {
            console.error("Error fetching folders:", err);
            res.status(500).json({ message: "Error fetching folders" });
        });
};

exports.postaddfolder = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, color } = req.body;
    const userId = req.user._id;

    const folder = new Folder({
        name,
        color: color || '#3b82f6',
        userID: userId
    });

    folder.save()
        .then(savedFolder => {
            res.status(201).json(savedFolder);
        })
        .catch(err => {
            console.error("Error creating folder:", err);
            res.status(500).json({ message: "Error creating folder", error: err.message });
        });
};

exports.postEditfolder = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const folderId = req.params.folderId;
    const { name, color } = req.body;
    const userId = req.user._id;

    Folder.findById(folderId)
        .then(folder => {
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
            if (folder.userID.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Forbidden" });
            }
            if (name !== undefined) folder.name = name;
            if (color !== undefined) folder.color = color;
            return folder.save();
        })
        .then(savedFolder => {
            res.status(200).json(savedFolder);
        })
        .catch(err => {
            console.error("Error editing folder:", err);
            res.status(500).json({ message: "Error editing folder" });
        });
};

exports.postDeletefolder = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const folderId = req.params.folderId;
    const userId = req.user._id;

    Folder.findById(folderId)
        .then(folder => {
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }
            if (folder.userID.toString() !== userId.toString()) {
                return res.status(403).json({ message: "Forbidden" });
            }
            // Delete all tasks associated with this folder, then delete the folder
            return Task.deleteMany({ folderId: folderId })
                .then(() => {
                    return Folder.deleteOne({ _id: folderId });
                });
        })
        .then(() => {
            res.status(200).json({ message: "Folder deleted successfully" });
        })
        .catch(err => {
            console.error("Error deleting folder:", err);
            res.status(500).json({ message: "Error deleting folder" });
        });
};

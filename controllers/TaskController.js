const tasks = require("../models/Task");

exports.getUsertask = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = req.user._id;
    const folderId = req.params.folderId;
    tasks.find({ userID: userId, folderId: folderId })
        .then(tasks => {
            res.status(200).json(tasks);
        })
        .catch(err => {
            console.error("Error fetching tasks:", err);
            res.status(500).json({ message: "Error fetching tasks" })
        })
}

exports.postaddtask = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = req.user._id;
    const folderId = req.params.folderId;
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = new tasks({
        userID: userId,
        folderId: folderId,
        title,
        description,
        status,
        priority,
        dueDate,
        tags
    })
    task.save()
    .then(savedTask => {
        res.status(201).json(savedTask);
    })
    .catch(err => {
        console.error("Error creating task:", err);
        res.status(500).json({ message: "Error creating task" })
    })
}

exports.postEdittask = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = req.user._id;
    const folderId = req.params.folderId;
    const taskId = req.params.taskId;
    const { title, description, status, priority, dueDate, tags } = req.body;
    
    tasks.findById(taskId)
    .then(task => {
        if(!task){
            return res.status(404).json({ message: "Task not found" })
        }
        if(task.userID.toString() !== userId.toString()){
            return res.status(403).json({ message: "Forbidden" })
        }
        if(title !== undefined) task.title = title;
        if(description !== undefined) task.description = description;
        if(status !== undefined) task.status = status;
        if(priority !== undefined) task.priority = priority;
        if(dueDate !== undefined) task.dueDate = dueDate;
        if(tags !== undefined) task.tags = tags;
        return task.save();
    })
    .then(savedTask => {
        res.status(200).json(savedTask);
    })
    .catch(err => {
        console.error("Error editing task:", err);
        res.status(500).json({ message: "Error editing task" })
    })
}

exports.postDeletetask = (req, res, next) => {
    if (!req.isLoggedIn || !req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const userId = req.user._id;
    const folderId = req.params.folderId;
    const taskId = req.params.taskId;
    
    tasks.findById(taskId)
    .then(task => {
        if(!task){
            return res.status(404).json({ message: "Task not found" })
        }
        if(task.userID.toString() !== userId.toString()){
            return res.status(403).json({ message: "Forbidden" })
        }
        return task.deleteOne({ _id: taskId });
    })
    .then(() => {
        res.status(200).json({ message: "Task deleted successfully" });
    })
    .catch(err => {
        console.error("Error deleting task:", err);
        res.status(500).json({ message: "Error deleting task" })
    })
}

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const TASKS = [];

app.get('/', (req, res) => {
    console.log("Request received at the / endpoint");

    // Calculate progress
    const completedTasks = TASKS.filter(task => task.isComplete).length;
    const totalTasks = TASKS.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return res.render("home.ejs", { tasks: TASKS, progress });
});

app.get('/completed-tasks', (req, res) => {
    const completedTasks = TASKS.filter(task => task.isComplete);
    return res.render("home.ejs", { tasks: completedTasks, progress: 100 });
});

app.post('/add-task', (req, res) => {
    const newTask = {
        id: TASKS.length + 1,
        name: req.body.name,
        isComplete: false
    };
    TASKS.push(newTask);
    return res.redirect("/");
});

app.post('/update-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const isComplete = req.body.isComplete === 'on';
    const taskIndex = TASKS.findIndex(task => task.id === id);

    if (taskIndex > -1) {
        TASKS[taskIndex].isComplete = isComplete;
        return res.redirect("/");
    }
});

app.post('/clear-tasks', (req, res) => {
  TASKS.length = 0; // Clear the array by setting its length to 0
  return res.redirect("/");
});

app.post('/delete-task/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = TASKS.findIndex(task => task.id === id);

  if (taskIndex > -1) {
      TASKS.splice(taskIndex, 1); // Remove the task from the array
  }

  res.json({ success: true });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
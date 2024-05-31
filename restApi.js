const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, 'data.json');

// Helper function to read data from the JSON file
function readData() {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Helper function to write data to the JSON file
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// CRUD operations
router.get('/users', (req, res) => {
  const users = readData();
  res.json(users);
});

router.get('/users/:id', (req, res) => {
  const users = readData();
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

router.post('/users', (req, res) => {
  const users = readData();
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

router.put('/users/:id', (req, res) => {
  const users = readData();
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex !== -1) {
    users[userIndex] = req.body;
    users[userIndex].id = parseInt(req.params.id);
    writeData(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

router.delete('/users/:id', (req, res) => {
  let users = readData();
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex !== -1) {
    users = users.filter(u => u.id != req.params.id);
    writeData(users);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

module.exports = router;

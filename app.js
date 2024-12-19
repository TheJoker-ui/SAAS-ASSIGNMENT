const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to read users from a JSON file
const readUsersFromFile = () => {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
};

// Function to write users to a JSON file
const writeUsersToFile = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Route to register a new user
app.post('/register', (req, res) => {
    const { email, age, password } = req.body;

    const users = readUsersFromFile();

    // Check if the user already exists
    if (users[email]) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    users[email] = { age, password };

    writeUsersToFile(users);
    return res.status(201).json({ message: 'User registered successfully', email });
});

// Route to update user information
app.put('/user/:email', (req, res) => {
    const { email } = req.params;
    const { age } = req.body; // Only updating age

    const users = readUsersFromFile();

    // Check if user exists
    if (!users[email]) {
        return res.status(404).json({ message: 'User not registed' });
    }

    // Update age if provided
    if (age) users[email].age = age;

    writeUsersToFile(users);
    return res.status(200).json({ message: 'User updated successfully' });
});

// Route to retrieve user information
app.get('/user/:email', (req, res) => {
    const { email } = req.params;

    const users = readUsersFromFile();

    // Check if user exists
    if (!users[email]) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(users[email]);
});

// Route to delete user
app.delete('/user/:email', (req, res) => {
    const { email } = req.params;

    const users = readUsersFromFile();

    // Check if user exists
    if (!users[email]) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    delete users[email];

    writeUsersToFile(users);
    return res.status(200).json({ message: 'User deleted successfully' });
});

// Sample route to log in (for demonstration purposes)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsersFromFile();

    // Check if the user exists and password matches
    if (users[email] && users[email].password === password) {
        return res.status(200).json({ message: 'Login successful', email });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

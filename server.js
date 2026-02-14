const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Tell Express to serve files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Point the root route to the index.html inside the public folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add this in server.js after your other routes
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');

const app = express();

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Optional catch-all for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Render provides a PORT env var — always use it
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

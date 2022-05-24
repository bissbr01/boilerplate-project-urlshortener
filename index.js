require('dotenv').config();
const express = require('express');
const cors = require('cors');


// Basic Configuration
const port = process.env.PORT || 3000;



app.use(session({
  secret: 'foo',
  store: MongoStore.create(options)
}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// Your first API endpoint
app.get('/api/hello', (req, res) => {
    res.json({ greeting: 'hello API' });
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

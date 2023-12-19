const express = require('express');
var cors = require('cors');

const connectToMongo = require('./db');
connectToMongo();

const app = express();
const port = process.env.PORT;
app.use(cors());

app.use(express.json()); //to get req body its middleware

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Notes Backend listening on port ${port}`)
})
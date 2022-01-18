const express = require('express');
const app = express();
const vaultRouter = require('../routes/vaultRouter');

app.use(express.json()); // middleware to parse req body as JSON object

app.use('/api/vault',vaultRouter);

app.listen(5000, function(){
    console.log('The server is listening to port 5000...');
})
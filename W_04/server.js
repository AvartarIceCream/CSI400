const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const apiAuthRoutes = require('./routes/auth/apiAuthRoutes');
const apiProtectRoutes = require('./routes/private/apiProtectRoutes');
const apiPublicRoutes = require('./routes/public/apiPublicRoutes');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('JWT API is running');
});

app.use('/api/auth', apiAuthRoutes);
app.use('/api/public', apiPublicRoutes); 
app.use('/api/protect', apiProtectRoutes); 

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

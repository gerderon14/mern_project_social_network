const express = require('express');
const app = express();

const  connectDB = require('./config/db')

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();
// Init Middleware
app.use(express.json({extended:false}));


app.get('/',(req,res)=> res.send('API Running'))
app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));

//Define routes

app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/posts',require('./routes/api/posts'))
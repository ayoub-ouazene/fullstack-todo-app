const express = require('express');
const app = express();
const cors = require('cors');
const UserRoute = require('./src/routes/users.js');
const TaskRoute = require('./src/routes/tasks.js');
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const cookieParser = require("cookie-parser");



const corsOptions = {
  origin: 'http://localhost:5500', 
  credentials: true, // This allows the browser to send cookies
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser()); 

// setting session

const seven_days = 1000*60*60*24*7;

app.use(session({
    "name":"sid",
    "secret":process.env.SESSION_SECRET,
    "resave" : false ,
    "saveUninitialized":false,

    "cookie":{
        httpOnly : true,
        // secure : true,  ---> if I want to use https
        // sameSite: 'none',
        maxAge : seven_days,
        secure:false
    }

}))



// Read the swagger.yaml file
const swaggerDocument = YAML.load(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

// Set up the Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users',UserRoute);
app.use('/api/tasks',TaskRoute);

// app.use(express.static(path.join(__dirname, '..', 'frontend')));




app.get('/',(req,res)=>{
  
    // res.status(200).sendFile(path.join(__dirname,'..','index.html'));
    res.status(200).send("welcome");

})



console.log('Docs available at http://localhost:3000/api-docs');

app.listen(3000,()=>{
    console.log(`listen at port 3000`);
})
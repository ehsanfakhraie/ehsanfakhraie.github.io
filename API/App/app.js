const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path')


const app = express();

app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 30 * 1024 * 1024 * 1024 //30MB max file(s) size
    },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(`${process.env.BASE_URL}`+'/uploads', express.static(path.join(__dirname, 'uploads')))

//================================== Routes ==================================\\
app.use(`${process.env.BASE_URL}`+'/apply',require('./routers/apply'))
app.use(`${process.env.BASE_URL}`+'/admin',require('./routers/superuser'))

module.exports = app;
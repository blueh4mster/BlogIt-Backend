const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path : './config.env'});

const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
    useNewUrlParser : true
}).then( con => {
    console.log("connected ");
});



const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`app listening on port ${port}`);
})
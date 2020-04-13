const path = require('path');
const file = (process.env.NODE_ENV === 'prod')? '.env' : '.test.env'; 

require('dotenv').config({
    path: path.resolve(process.cwd(), file)
});
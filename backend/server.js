const app = require('./app');

// Handlin Uncaught Error
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Uncaught Exception`);
    process.exit(1);
})

// config
const dotenv = require('dotenv');
dotenv.config({path:"backend/config/config.env"});
// connectDatabase
const connectDatabase = require('./config/database');
connectDatabase();
const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})


// Unhandled Promise Rejection mongo
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });
});
require('dotenv').config();
const app = require("./src/app")
const pool = require("./src/config/database")





app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
import dotenv from "dotenv" 

// loading .env file according to current environment  
dotenv.config({path:`.env.${process.env.NODE_ENV || "dev"}`}) 

const configs = {
    PORT : process.env.PORT || 3000 ,
    USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD || "123456"
}

export default configs
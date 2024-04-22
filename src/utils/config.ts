import dotenv from "dotenv" 

dotenv.config() 

const configs = {
    PORT : process.env.PORT || 3000 ,
    USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD || "123456" , 
    JWT_SECRET: process.env.JWT_SECRET || "123456" , 
    ORIGIN: process.env.ORIGIN || `http://localhost:3000`
}

export default configs
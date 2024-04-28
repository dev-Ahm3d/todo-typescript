import dotenv from "dotenv" 
import path from "path"

dotenv.config({
    path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
}) 
//console.log(process.env.NODE_ENV)
const configs = {
    PORT : process.env.PORT || 3000 ,
    USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD || "123456" , 
    JWT_SECRET: process.env.JWT_SECRET || "123456" , 
    ORIGIN: process.env.ORIGIN || "http://localhost:3000" , 
    SECRET_PEPPER: process.env.SECRET_PEPPER || "123456"
}

export default configs
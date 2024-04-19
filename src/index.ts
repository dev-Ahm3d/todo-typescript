import 'dotenv/config'
import express , {Application , Request , Response} from "express" 
import http from "http"
import morgan from "morgan"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import { MESSAGES } from "./utils/enums"
import { max_requests_limit, rate_limit_minutes } from "./utils/constants"
import httpStatus from "http-status"
import globalError from "./middlewares/error.middleware"

const app:Application = express() 
const server = http.createServer(app)

// middleware to parse incomig requests body 
app.use(express.json()) 

// for http request security .. adding some important headers for the response
app.use(helmet())

// logger 
app.use(morgan('common'))

//rate-limiting
const limiter = rateLimit({
	windowMs: rate_limit_minutes * 60 * 1000, // 15 minutes
	limit: max_requests_limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
    message: MESSAGES.RATE_LIMIT
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)


app.route("/").get((req:Request,res:Response)=>{
    res.json({
        message:"hello world"
    }) 
})


// global error handling middleware by express  
app.use(globalError)


// not found route 
app.all('*',(_req:Request,res:Response,_next)=>{
    return res.status(404).json({
        stausCode:404 ,
        message : httpStatus["404_MESSAGE"]
    })
})

server.listen(process.env.PORT || 3000 ,()=>{
    console.log("server is running...")
})

// handling rejections out of express like db connection
process.on('unhandledRejection' , err =>{
    //console.log("here")
    //console.error(`UnhandledRejection Errors : ${err.name} | ${err.message}`)
    server.close(()=>{
        console.error('Shutting down ..')
        process.exit(1)
    })
})

export default app
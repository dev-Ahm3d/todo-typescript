import express , {Application , Request , Response} from "express" 
import http from "http"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import { rateLimit } from "express-rate-limit"
import { MESSAGES } from "./utils/enums"
import { max_requests_limit, rate_limit_minutes } from "./utils/constants"
import globalError from "./middlewares/error.middleware"
import configs from "./utils/config"

const app:Application = express() 
const server = http.createServer(app)

app.use(cors({
    origin: configs.ORIGIN , 
    credentials: true
}))

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

import twilio from "twilio" 
import { StatusCodes } from "http-status-codes"

app.route("/").get(async (req:Request,res:Response)=>{
    // const accountSid = 'AC37f0b2a67f3ad6ce98a8d6b7aac92170';
    // const authToken = '7424a3f202d373f9877a5c4b055a04fc';
    // const client = twilio(accountSid, authToken);

    // client.messages
    //     .create({
    //         body: '',
    //         from: 'whatsapp:+14155238886',
    //         to: 'whatsapp:+201067115590',
    //         mediaUrl:["https://carwow-uk-wp-3.imgix.net/18015-MC20BluInfinito-scaled-e1707920217641.jpg" ,
    //             "https://fis.carmarthenshire.gov.wales/wp-content/uploads/2018/12/easy-pleasy-cookbook.pdf"
    //         ] 
    //     })
    //     .then(resp => {
    //         res.status(StatusCodes.OK).json(resp)
    //     })
})


// global error handling middleware by express  
app.use(globalError)


// not found route 
app.all('*',(_req:Request,res:Response,_next)=>{
    return res.status(404).json({
        stausCode:404 ,
        message : StatusCodes.NOT_FOUND
    })
})

server.listen(configs.PORT , ()=>{
    console.log("server is running...")
})

// handling rejections out of express like db connection
process.on('unhandledRejection' , err =>{
    //console.log("here")
    //console.error(`UnhandledRejection Errors : ${err.name} | ${err.message}`)
    server.close(()=>{
        console.log(err)
        console.error('Shutting down ..')
        process.exit(1)
    })
})

export default app
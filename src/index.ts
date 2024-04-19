import express , {Application , Request , Response} from "express" 
import 'dotenv/config'

const app:Application = express() 

app.route("/").get((req:Request,res:Response)=>{
    res.json({
        message:"hello world"
    }) 
})

app.listen(process.env.PORT || 3000 ,()=>{
    console.log("server is running...")
})

export default app
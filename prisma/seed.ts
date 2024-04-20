import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt"
import configs from "../src/utils/config";

const prisma = new PrismaClient() 

const {USER_DEFAULT_PASSWORD} = configs
const defaultPasswordHashed = bcrypt.hashSync(USER_DEFAULT_PASSWORD,10) 

const usersWithTasks = [
    {
        name: "ahmed mannaa",
        email: "admin@example.com",
        role: UserRole.ADMIN ,
        password: defaultPasswordHashed ,
        tasks:{
            create:{
                title: "Task 1",
                date:new Date("2022-01-01"),
                completed: false ,
                description: "Task 1 description"
            }
        }
    },
    {
        name: "ahmed ehab",
        email: "client1@example.com",
        role: UserRole.CLIENT , 
        password: defaultPasswordHashed ,
        tasks:{
            create:{
                title: "Task 2",
                date:new Date("2022-01-01"),
                completed: false ,
                description: "Task 2 description"
            }
        }
    } 
]


async function main(){
    await prisma.user.deleteMany() 
    for (let user of usersWithTasks){
        await prisma.user.create({data : user})
    }
}

main().catch(err =>{
    console.log(err) 
    process.exit(1)
}).finally(()=>{
    prisma.$disconnect()
})
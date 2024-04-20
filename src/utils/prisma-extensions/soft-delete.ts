import { Prisma } from "@prisma/client";

export default Prisma.defineExtension((client) =>{
    return client.$extends({
        model:{
            $allModels :{
                async softDelete<T>(
                    this: T , 
                    where: Prisma.Args<T,"update">["where"] 
                ){
                    const context = Prisma.getExtensionContext(this)
                    const result = await (context as any).update({
                        where ,
                        data : {deletedAt : new Date()}
                    }) 
                    return result
                }
            }
        }
    })
})
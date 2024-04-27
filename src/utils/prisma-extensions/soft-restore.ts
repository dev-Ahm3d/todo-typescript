import { Prisma } from "@prisma/client";

export default Prisma.defineExtension((client) =>{
    return client.$extends({
        model:{
            $allModels :{
                async softRestore<T>(
                    this: T , 
                    where: Prisma.Args<T,"update">["where"] 
                ){
                    const context = Prisma.getExtensionContext(this)
                    const result = await (context as any).update({
                        where ,
                        data : {deletedAt : null}
                    }) 
                    return result
                }
            }
        }
    })
})
interface IError {
    message: string ,
    stack?: string ,
    name?: string ,
    statusCode: number
}

export {IError}
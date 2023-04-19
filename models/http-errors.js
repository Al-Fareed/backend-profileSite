class HttpError extends Error{
    constructor(message,errorCode){
        super(message); //ADd a message property
        this.code = errorCode; //Adds a code property
    }
}

module.exports = HttpError;
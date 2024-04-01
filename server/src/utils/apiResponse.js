export default class ApiResponse {
    constructor(success, data=null, message=null, errors=null, headers=null){
        this.success = success;
        this.message = message;
        this.headers = headers;
        this.data = data;
        this.errors = errors;
    }
}
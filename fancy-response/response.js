let request;
let respond;

export default class Response {

    constructor(req, res) {
        //Private variables
        request = req;
        respond = res;

        //Public variables
        this._success = res.statusCode < 300;
        this.message = '';
        this.status_code = res.statusCode;
    }

    set _success(success) {
        if (!success && !this.error) {
            this.error = `Something went wrong (${this.status_code})`;
        }
        this.success = success;
    }

    set _status_code(status) {
        this.status_code = status;

        if (status >= 300) {
            this._success = false;
        }
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    status(status = 200) {
        this._status_code = status;
        respond.status(status);
        return this;
    }

    appendToken(token) {
        this.token = token;
        return this;
    }

    removeToken() {
        delete this.token;
        return this;
    }

    setError(error) {
        this.error = error;
        return this;
    }

    fire() {
        respond.json(this);
    }
}

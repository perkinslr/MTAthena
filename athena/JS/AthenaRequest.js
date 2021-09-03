/*
executeOnLoad = true




/////
*/

class AthenaRequest {
    constructor(ack) {
        this._ack = ack;
        this.deferred = new Deferred();
        this.aborted = false;
    }

    abort() {
        this.aborted = true;
    }
}

this.AthenaRequest = AthenaRequest;

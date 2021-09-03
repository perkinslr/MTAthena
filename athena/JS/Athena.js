/*
executeOnLoad = true




/////
*/

class Athena {
    constructor(tloFactory) {
        this._tloFactory = tloFactory;
        this._clients = {};
    }

    registerAthenaClient(name) {
        if (this._clients[name]) {
            this._clients[name].connectionLost("Replaced");
        }
        this._clients[name] = this._tloFactory(name);
    }

    deliverMessages(name, ack, messages) {
        let client = this._clients[name]
        if (client) {
            this._clients[name].deliveryChannel.messageReceived(messages)
        }
    }
    
}
this.Athena = Athena

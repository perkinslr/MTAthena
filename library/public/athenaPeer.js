/*
This class is the server-side representation of a (possibly remote) client
These should only be instantiated on the host (the class need not even be loaded on other maptool instances).
*/
class AthenaPeer {
    constructor(server) {
	this.server = server
    }

    doConnect(transport) {
	this._transport = transport
	this._uid = transport.uid
	return this
    }

    doCall(procedure, args) {
	if (!this[procedure]) {
	    console.log(18, procedure)
	}
	let func = this[procedure].bind(this)
	return func(...args)
    }
    callRemote(procedure, ...args) {
	return this._transport.sendMessage("call", [procedure, args])
    }

    connectionLost(reason){}

    toString() {
	return `<AthenaPeer: uid: ${this._uid} />`;
    }
}

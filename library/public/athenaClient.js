/*
This class manages the connection to the instance of AthenaServer running on the host.
Each instance of maptool should have exactly *one* copy of AthenaClient per athena namespace
Each Athena Page connects to the AthenaClient of the local maptool client.

*/
this.self = this
class AthenaClient {
    constructor() {
	this._pages = {};
	if (!isServer) {
	    self.relayMessage = () => {
		try {
		    
		    let [[ns, uid, idx, args]] = MTScript.getMTScriptCallingArgs()
		    this._transport.messageReceived(uid, idx, args)
		}
		catch(e){
		    console.log(e.stack)
		    throw e
		}
	    }
	}

	self.webMessage = () => {
	    
	    try {
		let [[ns, pid, idx, args]] = MTScript.getMTScriptCallingArgs()
		let page = this._pages[pid]
		page._transport.messageReceived(pid, idx, args)
	    }
	    catch(e){
		console.log(e.stack)
		throw e
	    }
	}

    }

    registerAthenaPage(name, page) {
	console.log(41, name, page)
        if (this._pages[name]) {
            this._pages[name].connectionLost("Replaced");
        }
        this._pages[name] = page
	return page
    }

    doConnect(transport) {
	this._transport = transport
	this._uid = transport.uid
	this.sendMessage("connected")
    }

    sendMessage(...args) {
	return this._transport.sendMessage(args)
    }

    doCall(procedure, args) {
	let func = this[procedure].bind(this)
	return func(...args)
    }


    callRemote(procedure, ...args) {
	return this._transport.sendMessage("call", [procedure, args])
    }
    
    toString() {
	return `<AthenaClient: uid: ${this._uid} />`;
    }
    
    
}

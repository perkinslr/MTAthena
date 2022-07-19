/*
This class manages the peer-to-peer organization of this namespace
Only one copy of this is allowed per namespace, and should be created *only* on the game host.
*/
this.self = this
class AthenaServer {
    constructor(peerFactory) {
	let peers = this._peers = {}
	self.relayMessage = () => {
	    try {

		let [[ns, uid, idx, args]] = MTScript.getMTScriptCallingArgs()
		if (""+args[0] == 'connected') {
		    let peer = new peerFactory(this)
		    let transport = new ReliableMessageDelivery(playerName, peer, uid)
		    peer.doConnect(transport)
		    this.registerPeer(uid, peer)
		}
		let peer = peers[uid]
		peer._transport.messageReceived(uid, idx, args)
	    }
	    catch(e){
		console.log(e.stack)
		throw e
	    }

	}

    }
    toString() {
	return `<AthenaServer: Peers: ${this._peers.Length} />`;
    }

    registerPeer(peer, client) {
	if (this._peers[peer]) {
	    this._peers[peer].disconnect("Replaced")
	}
	this._peers[peer] = client
    }

    doCall(procedure, args) {
	let func = this[procedure].bind(this)
	return func(...args)
    }


    
    
}



class ReliableMessageDelivery {
    static createPair(uid, parent, peer) {
	let left = new ReliableMessageDelivery(uid, parent, null)
	let right = new ReliableMessageDelivery(uid, peer, left)
	left.peer = right
	return [left, right]
    }
    constructor(uid, parent, peer, html5) {
	if (html5 == undefined) {
	    html5 = false;
	}
	this.uid = uid
	this.parent = parent
	this.peer = peer
	this._msg_idx = 0
	this.pending = {}
	this.html5 = html5
    }

    _sendMessage(idx, args) {
	if (this.html5) {
	    let encoded = JSON.stringify([namespace, this.uid, idx, args])
	    let link = "macro:WebMessage@lib:com.lp-programming.maptool.athena"
	    
	    fetch(link, {method: "POST",
			 body: encoded})
	}
	else if (typeof this.peer == "string") {
	    MTScript.setVariable("args", JSON.stringify([namespace, this.uid, idx, args]))
	    let encoded = MTScript.evalMacro(`[r: base64.encode(args)]`)
	    let macro = "macro://RelayMessage@lib:com.lp-programming.maptool.athena/none/Impersonated?"+encoded
	    MTScript.setVariable("link", macro)
	    MTScript.setVariable("server", this.peer)
	    MTScript.evalMacro(`[r: execLink(link, 1, server)]`) 
	}
	else if (this.peer instanceof Array) {
	    let pk = this.peer[0]
	    let pn = this.peer[1]
	    MTScript.setVariable("pk", pk)
	    MTScript.setVariable("pn", pn)
	    MTScript.setVariable("args", JSON.stringify([namespace, this.uid, idx, args]))
	    MTScript.evalMacro(`[r: runJsFunction(pn, pk, "LivePage.instance.webMessage", "LivePage.instance", json.append("[]", args))]`) 
	}
	else {
	    this.peer.messageReceived(this.uid, idx, args)
	}
    }
    
    sendMessage(...args) {
	let idx = this._msg_idx++
	let msg = this.pending[idx] = new Deferred()
	this._sendMessage(idx, args)
	return msg
    }
    respond(idx, success, obj) {
	this._sendMessage(idx, ["response", [success, obj]])
    }

    messageReceived(uid, idx, args) {
	let op = args[0]
	switch (op) {
	case "connected":
	    this.parent.onConnect()
	    break;
	case "call":
	    try {
		Deferred.maybeDeferred(this.parent.doCall(...args[1])).addCallback((r)=>{
		    this.respond(idx, true, r)
		}).addErrback((e)=>{
		    console.log(e.stack)
		    this.respond(idx, false, e)
		})
	    }
	    catch (e) {
		console.log(e.stack)
		this.respond(idx, false, ""+(new Failure(e)))
	    }
	    break;
	case "response":
	    let d = this.pending[idx]
	    this.pending[idx] = undefined
	    if (args[1][0]) {
		d.callback(args[1][1])
	    }
	    else {
		d.errback(args[1][1])
	    }
	    break
	}

	
		
    }
}

function repl() {
    let stop = false
    while (!stop) {
	let line = MTScript.evalMacro("[r: line]")
	eval(line)
    }
}

MTScript.registerMacro("repl", repl)

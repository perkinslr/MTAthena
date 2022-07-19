class LivePage {
    constructor(pid) {
	this._transport = new ReliableMessageDelivery(pid, this, pid, true)
	this.doConnect()
    }
    doConnect(transport) {
	this.sendMessage("connected")
    }

    sendMessage(...args) {
	return this._transport.sendMessage(args)
    }

    callRemote(procedure, ...args) {
	return this._transport.sendMessage("call", [procedure, args])
    }

    doCall(procedure, args) {
	let func = this[procedure].bind(this)
	return func(...args)
    }


    webMessage(msg) {
	let [ns, uid, idx, args] = msg
	this._transport.messageReceived(uid, idx, args)
    }

    
}


UserData.then(async (ud) => {
    try {
	let pid = ud[0]
	let scripts = ud[1]
	let jsClass = ud[2]
	
	window.namespace = ud[3]
	for (var script of scripts) {
	    let r = await fetch(script)
	    let s = await r.text()
	    let p = document.createElement("script")
	    p.innerHTML = s
	    document.body.appendChild(p)

	}
	let lc = eval(jsClass)
	LivePage.instance = new lc(pid)
    }
    catch (e) {
	let p = document.createElement("pre")
	p.innerHTML = "" + e.stack
	document.body.appendChild(p)
	console.log(e.stack)

    }
})

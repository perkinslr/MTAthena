let serverInfo = JSON.parse(""+MTScript.evalMacro(`[r: getInfo("server")]`))

console.log(serverInfo)
this.self = this

self.isServer = serverInfo['personal server'] || serverInfo['hosting server']
let playerName = MTScript.evalMacro('[r: getPlayerName()]')



class MyAthenaClient extends AthenaClient {
    setTotal(total) {
	for (let pid in this._pages) {
	    let page = this._pages[pid]
	    page.callRemote("setTotal", total)
	}
	
    }
}


let athenaClient = new MyAthenaClient()

if (isServer) {
    class Calculator {
	constructor() {
	    this.text = "0"
	}
	buttonClicked(button) {
	    let allowed = '0123456789.+-x/%()'.split('')
	    if (allowed.indexOf(button)+1) {
		if (this.text == "0") {
		    this.text = ""
		}
		this.text += button
	    }
	    else if (button == 'AC') {
		this.text = '0'
	    }
	    else if (button == '=') {
		this.text = eval(this.text.replace('x', '*'))
	    }
	    else {
		return false;
	    }
	    return true;
	    
		
	    
	}
    }

    let calculator = new Calculator()
    class MyAthenaPeer extends AthenaPeer {
	hello(msg) {
	    MapTool.chat.broadcast("Peer sent ", msg)
	}

	getTotal() {
	    return calculator.text
	}

	buttonClicked(b) {
	    if (calculator.buttonClicked(b)) {
		for (let pid in this.server._peers) {
		    let peer = this.server._peers[pid]
		    peer.callRemote("setTotal", calculator.text)
		}
	    }
	}
	
    }
    let server = new AthenaServer(MyAthenaPeer)

    let localPeer = new MyAthenaPeer(server)
    
    let [clientTransport, serverTransport] = ReliableMessageDelivery.createPair(playerName, athenaClient, localPeer)
    
    athenaClient.doConnect(clientTransport)
    localPeer.doConnect(serverTransport)

    server.registerPeer(playerName, localPeer)

    "Server Initialized"

}
else {
    try {
	let serverName = MTScript.evalMacro("[r: js.getServer()]")
	let clientTransport = new ReliableMessageDelivery(playerName, athenaClient, serverName)
	athenaClient.doConnect(clientTransport)
	"Client Initialized"
    }
    catch(e) {
	throw e
    }
}


class DemoPage extends AthenaPage {

    constructor(html5Name, html5Type) {
	super(html5Name, html5Type)
	this.jsIncludes.push("lib://com.lp-programming.maptool.athena/samplePage.js")
	this.jsClass = "SamplePage"
    }
    buttonClicked(text) {
	return this.parent.callRemote("buttonClicked", text)
    }
    setTotal(text) {
	this.callRemote("setTotal", text)
    }
    getTotal(text) {
	return this.parent.callRemote("getTotal")
    }

}

console.log(119)

try {
    let page = new DemoPage("demoPage", "frame")
    page.setFragmentParent(athenaClient)
    page.renderLivePage()
    
}
catch (e) {
    console.log(e.stack)
}

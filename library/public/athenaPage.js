/*
This class is the tabletop-side representation of a web page running in an html5 context
*/

console.log(5555)

class AthenaPage {
    docFactory = "lib://com.lp-programming.maptool.athena/Demo.html"
    jsIncludes = ["lib://com.lp-programming.maptool.athena/reliableMessageDelivery.js",
		  "lib://com.lp-programming.maptool.athena/defer.js",
		 ]
    jsClass = "LivePage"
    constructor(html5Name, html5Type) {
	this.html5Name = html5Name
	this.html5Type = html5Type
	this.peerID = html5Type+':'+html5Name
    }

    setFragmentParent(parent) {
	this.parent = parent
	parent.registerAthenaPage(this.peerID, this)
	this._transport = new ReliableMessageDelivery(this.peerID, this, [this.html5Type, this.html5Name])
    }

    doCall(procedure, args) {
	let func = this[procedure].bind(this)
	return func(...args)
    }
    callRemote(procedure, ...args) {
	return this._transport.sendMessage("call", [procedure, args])
    }

    renderLivePage() {
	MTScript.setVariable("pageType", this.html5Type)
	MTScript.setVariable("pageName", this.html5Name)
	MTScript.setVariable("pageURI", this.docFactory)
	MTScript.setVariable("userdata", [this.peerID, this.jsIncludes, this.jsClass, namespace])
	return MTScript.evalMacro("[r: js.makeHtml5(pageType, pageName, pageURI, userdata)]")
    }

    connectionLost(reason) {}

    toString() {
	return `AthenaPage: uid: ${this.peerID} `;
    }
}

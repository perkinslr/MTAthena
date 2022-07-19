class SamplePage extends LivePage {
    buttonClicked(b) {
	let v = b.innerHTML.trim()
	this.callRemote('buttonClicked', v)
    }
    setTotal(total) {
	document.getElementById("total").innerHTML = total
    }
    doConnect(transport) {
	this.sendMessage("connected")
	this.callRemote("getTotal").addCallback(this.setTotal.bind(this))
    }

}

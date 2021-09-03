/*
dependencies = Defer ReliableMessageDelivery AthenaRequest AthenaObject 
 */
/////


class postFormOutputFactory {
    constructor(clientID) {
        this._client = clientID;
    }
  
    send(ack, messages) {
        console.log(JSON.stringify(messages))
        let macroArgs = JSON.stringify([this._client, ack, messages]);
        
        let form = document.createElement("form")
        form.method = "JSON"
        form.action = "macro://jsRelay@Lib:RelayJavascript/none/?"
        let inp = document.createElement("input")
	inp.name = "athenaArgs"
        inp.value = macroArgs
        form.appendChild(inp)
        let sub = document.createElement("input");
        sub.type="submit"
        document.body.appendChild(form)
        form.appendChild(sub)
        setTimeout(()=>{
	    sub.click();
	    document.body.removeChild(form);
	}, 1);
        
        return new Request(ack);

	
    }
    

    
}

this.postFormOutputFactory = postFormOutputFactory

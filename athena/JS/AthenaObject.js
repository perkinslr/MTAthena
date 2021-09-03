/*
executeOnLoad = true




/////
*/


class AthenaObject {
    constructor(clientID, outputFactoryFactory) {
	let factory = new outputFactoryFactory(clientID, null);
	this.deliveryChannel = new ReliableMessageDelivery(factory, this);
	this._children = {0: this}
	this._childID = 0;
	this.remoteCalls = {};
	this.disconnectNotifications = [];
        this.remoteCallCount = 0;
    }

    sendCallRemote(remoteRef, methodName, args, kwargs) {
        let objectID = remoteRef.objectID;
        

        let resultDeferred = new Deferred();
        let requestId = 'c2s' + this.remoteCallCount++;

        this.remoteCalls[requestId] = resultDeferred;

        this.deliveryChannel.addMessage(
            ['call', [objectID, methodName, requestId, args, kwargs]]);

        resultDeferred.addErrback(
            function(err) {
		let errclass;
                this.showErrorDialog(methodName, err, errclass);
            });
    

        return resultDeferred;
    }

    showErrorDialog(methodName, err) {
        var e = document.createElement("div");
        e.style.padding = "12px";
        e.style.border = "solid 1px #666666";
        e.style.position = "absolute";
        e.style.whiteSpace = "nowrap";
        e.style.backgroundColor = "#FFFFFF";
        e.style.zIndex = 99;


        var titlebar = document.createElement("div");
        titlebar.style.borderBottom = "solid 1px #333333";

        var title = document.createElement("div");
        title.style.fontSize = "1.4em";
        title.style.color = "red";
        title.appendChild(
            document.createTextNode("Error"));

        titlebar.appendChild(title);

        e.appendChild(titlebar);

        e.appendChild(
            document.createTextNode("Your action could not be completed because an error occurred."));


        var errorLine = document.createElement("div");
        errorLine.style.fontStyle = "italic";
        errorLine.appendChild(
            document.createTextNode(
                err.toString() + ' caught while calling method "' + methodName + '"'));
        e.appendChild(errorLine);

        var line2 = document.createElement("div");
        line2.appendChild(
            document.createTextNode("Please retry."));
        e.appendChild(line2);

        var close = document.createElement("a");
        close.href = "#";
        close.onclick = function() {
            document.body.removeChild(e);
            return false;
        };
        close.style.display = "block";

        close.appendChild(
            document.createTextNode("Click here to close."));

        e.appendChild(close);

        document.body.appendChild(e);

        var elemDimensions = Divmod.Runtime.theRuntime.getElementSize(e);
        var pageDimensions = Divmod.Runtime.theRuntime.getPageSize();

        e.style.top  = Math.round(pageDimensions.h / 2 - elemDimensions.h / 2) + "px";
        e.style.left = Math.round(pageDimensions.w / 2 - elemDimensions.w / 2) + "px";
    }

    showErrorFrame(methodName, err, errclass) {
	
	MTScript.execMacro(`[Frame5('error'):{
            <div style="padding=12px; border=1px solid #666666">
               <div style="borderBottom: 1px solid #333333">Error</div>
               Your action could not be completed because an error occurred.
               <div style="fontStyle:italic">${err.toString()} caught while calling method "${methodName}"</div>
            </div>}
        ]`);
    }


    nextID() {
	return ++this._childID
    }

    addChild(child) {
	this._children[nextID()] = child;
    }

    connectionLost(reason) {
	console.log(reason)
    }

    action_call(childID, funcName, requestId, funcArgs) {
	let result;
        let success = true;
	try {
console.log("a: "+childID)
	    let child = this._children[childID]
		console.log("child: "+child)
	    let func = child[funcName]
		console.log("func: "+func)
		
	    result = func.bind(child)(...funcArgs);
	}
	catch (error) {
            result = error;
            success = false;
        }
	
	if (result instanceof Promise) {
	    let d = new Deferred();
	    result.then(d.callback, d.errback);
	    result = d
	}
	if (result instanceof Deferred) {
	    result.addCallbacks(
		(result)=>{
		    this.deliveryChannel.addMessage(
			['respond', [requestId, true, result]]);
		},
		(err)=>{
		    this.deliveryChannel.addMessage(
			['respond', [requestId, false, err.error]]);
		}
	    );
	}
	else {
	    this.deliveryChannel.addMessage(['respond', [requestId, success, result]]);
        }
	
    }
    action_respond(responseId, success, result) {
        var d = this.remoteCalls[responseId];
        delete this.remoteCalls[responseId];

        if (success) {
            d.callback(result);
        } else {
            d.errback(Divmod.namedAny(result[0]).apply(null, result[1]));
        }
    }
}


this.AthenaObject = AthenaObject;

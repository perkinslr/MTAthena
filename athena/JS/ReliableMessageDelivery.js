/*
executeOnLoad = true




/////
*/

class ReliableMessageDelivery {
    constructor(outputFactory, topLevelObject) {
        this.running = false;
        this.messages = [];
        this.ack = -1;
        this.seq = -1;
        this._paused = 0;
        this.failureCount = 0;
        this.outputFactory = outputFactory;
        this.requests = []
        this.tlo = topLevelObject;
    }

    start() {
        this.running = true;
        if (this.requests.length > 0) {
            this.flushMessages();
        }
    }

    stop(){
        this.running = false;
        for (let i = 0; i < this.requests.length; ++i) {
            this.requests[i].abort();
        }
        this.requests = null;
        this.tlo.connectionLost('Connection closed by remote host');

    }
    acknowledgeMessage(ack) {
        while (this.messages.length && this.messages[0][0] <= ack) {
            this.messages.shift();
        }
    }

    /**
     * A message representing a list of actions to take, of the format
     * [[sequenceNumber, [actionName, actionArguments]], ...] has been
     * received from the server.  Dispatch those messages to methods named
     * action_* on this object.
     */
    messageReceived(message) {
	console.log('xyzzy')
        console.log(JSON.stringify(message))
        this.pause();
        if (message.length) {
            if (this.ack + 1 >= message[0][0]) {
                var ack = this.ack;
                this.ack = Math.max(this.ack, message[message.length - 1][0]);
                for (var i = 0; i < message.length; ++i) {
                    var msg = message[i];
	console.log(JSON.stringify(msg))
                    var seq = msg[0];
                    var payload = msg[1];
                    var actionName = payload[0];
                    var actionArgs = payload[1];
                    if (seq > ack) {
	console.log("geting action")
                        let action = this.tlo['action_'+actionName];
                        if (action) {
		console.log("got action: "+action)
                            action = action.bind(this.tlo);
                        }
                        try {
                            action(...actionArgs);
                        } catch (e) {
                            console.log(""+e+': Action handler ' + payload[0] +
                                       ' for ' + seq + ' failed.');
                        }
                    }
                }
            } else {
                Divmod.debug("transport",
                             "Sequence gap!  " + this.page.livepageID +
                             " went from " + this.ack + " to " + message[0][0]);
            }
        }
        this.unpause();
    }

    pause() {
        this._paused += 1;
    }

    unpause() {
        this._paused -= 1;
        if (this._paused == 0) {
            this.flushMessages();
        }
    }

    addMessage(msg) {
        ++this.seq;
        this.messages.push([this.seq, msg]);
        this.flushMessages();
    }

    flushMessages() {
        if (!this.running || this._paused) {
            return;
        }

        var outgoingMessages = this.messages;

        if (outgoingMessages.length == 0) {
            if (this.requests.length != 0) {
                return;
            }
        }

        if (this.requests.length > 1) {
            this.failureCount -= 1;
            this.requests[0].abort();
        }

        var theRequest = this.outputFactory.send(this.ack, outgoingMessages);

        this.requests.push(theRequest);
        theRequest.deferred.addCallback(function(result) {
            this.failureCount = 0;
            this.acknowledgeMessage(result[0]);
            this.messageReceived(result[1]);
        });
        theRequest.deferred.addErrback(function(err) {
            this.failureCount += 1;
        });
        theRequest.deferred.addCallback(function(ign) {
            for (var i = 0; i < this.requests.length; ++i) {
                if (this.requests[i] === theRequest) {
                    this.requests.splice(i, 1);
                    break;
                }
            }
            if (this.failureCount < 3) {
                if (!theRequest.aborted) {
                    this.flushMessages();
                }
            } else {
                this.stop();
            }
        });
    }

    sendCloseMessage() {
        this.stop();
        this.outputFactory(true).send(this.ack, [["unload", ["close", []]]]);
    }


}

this.ReliableMessageDelivery = ReliableMessageDelivery;


class Deferred {
    static maybeDeferred(obj) {
	if (obj instanceof Deferred) {
	    return obj;
	}
	let d = new Deferred()
	d.callback(obj)
	return d
    }
    constructor(...p) {
        this._callbacks = [];
        this._called = false;
        this._pauseLevel = 0;
	if (p.length > 0) {
	    let a = Deferred.maybeDeferred(p[0])
	    a.then(this.callback, this.errback);
	}
    }
    addCallbacks(callback, errback, callbackArgs, errbackArgs) {
        if (!callbackArgs) {
            callbackArgs = [];
        }
        if (!errbackArgs) {
            errbackArgs = [];
        }
        this._callbacks.push([callback, errback, callbackArgs, errbackArgs]);
        if (this._called) {
            this._runCallbacks();
        }
        return this;

        
    }
    addCallback(callback, ...args) {
        this.addCallbacks(callback, null, args, null);
        return this;
    }
    addErrback(errback, ...args) {
        this.addCallbacks(null, errback, null, args);
        return this;
    }
    addBoth(callback, ...args) {
        this.addCallbacks(callback, callback, args, args);
        return this;
    }
    _pause() {
        this._pauseLevel++;
    }
    _unpause() {
        this._pauseLevel--;
        if (this._pauseLevel) {
            return;
        }
        if (!this._called) {
            return;
        }
        this._runCallbacks();
    }
    _runCallbacks() {
        if (!this._pauseLevel) {
            var cb = this._callbacks;
            this._callbacks = [];
            while (cb.length) {
                var item = cb.shift();
                if (this._isFailure(this._result)) {
                    var callback = item[1];
                    var args = item[3];
                } else {
                    var callback = item[0];
                    var args = item[2];
                }

                if (callback == null) {
                    continue;
                }

                args.unshift(this._result);
                try {
                    this._result = callback.apply(null, args);
                    if (this._isDeferred(this._result)) {
                        this._callbacks = cb;
                        this._pause();
                        this._result.addBoth(function (r) {
                            this._continue(r);
                        });
                        break;
                    }
                } catch (e) {
                    this._result = new Failure(e);
                }
            }
        }

    }
    _isFailure(obj) {
        return (obj instanceof Failure);
    }
    _isDeferred(obj) {
        return (obj instanceof Deferred);
    }
    _continue(result) {
        this._result = result;
        this._unpause();
    }
    _startRunCallbacks(result) {
        if (this._called) {
            throw new Divmod.Defer.AlreadyCalledError();
        }
        this._called = true;
        this._result = result;
        this._runCallbacks();
    }
    callback(result) {
        this._startRunCallbacks(result);
    }
    errback(err) {
        if (!this._isFailure(err)) {
            err = new Failure(err);
        }
        this._startRunCallbacks(err);
    }
    then(callback, errback) {
	this.addCallback(callable)
	if (errback === undefined) {
	    return;
	}
	this.addErrback(errback)
	    
    }

    toString() {
	return `<Deferred: current=${this._result} />`;
    }
}



class Failure {
    constructor(error) {
        this.error = error;
	this.stack = error.stack
    }

    toString() {
        return 'Failure: ' + this.error + ' <br/>' + this.stack;
    }

}

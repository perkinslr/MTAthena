/*
executeOnLoad = true




/////
*/


class runJSOutputFactory {
    constructor(name, _type, funcName) {
        this._name = name;
        this._type = _type;
        this._func = funcName;
    }
  
    send(ack, messages) {
        let macroArgs = JSON.stringify([ack, messages]);
	MTScript.setVariable("macroArgs", macroArgs);
        let macroStr = `runJSFunction("${this._name}", "${this._type}", "${this._func}", "null", macroArgs)`;
        MTScript.evalMacro(macroStr);
        return new AthenaRequest(ack);
    }
    

    
}


this.runJSOutputFactory = runJSOutputFactory;

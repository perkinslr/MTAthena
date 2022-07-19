[h: args=(base64.decode(macro.args))]
[h: ns=json.get(args, 0)]
[h: serverName=json.get(args, 1)]

[h: js.evalNS(ns, "initAthena(MTScript.getMTScriptCallingArgs()[0])", serverName)]
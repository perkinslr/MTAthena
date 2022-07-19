[h: args=(base64.decode(macro.args))]
[h: ns=json.get(args, 0)]

[h: js.evalNS(ns, "relayMessage()", args)]
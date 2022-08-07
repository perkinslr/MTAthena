function errorWrapper(fn) {
    function wrapped(...args) {
	try {
	    return fn(...args);
	}
	catch (e) {
	    console.log(e.trace)
	    return "Exception: "+e
	}
    }
    return fn
}

try {
    let serverInfo = JSON.parse(""+MTScript.evalMacro(`[r: getInfo("server")]`))
    let isServer = serverInfo['personal server'] || serverInfo['hosting server']

    let serverName;

    function getServer() {
	let playerName = MTScript.evalMacro(`[r: getPlayerName()]`)
	if (isServer) {
	    serverName = playerName
	    return serverName
	}
	return serverName
	
    }

    function setServer(name) {
	serverName = name
    }

    function sendServer(args) {
	try {
	    console.log(22)
	    console.log(args)
	    args = args.split(',')
	    let response_macro = args[0]
	    let macro_library = args[1]
	    let target_name = args[2]
		
	    if (isServer) {
		let playerName = MTScript.evalMacro(`[r: getPlayerName()]`)
		let link = `macro://${response_macro}@lib:${macro_library}/none/Impersonated?${playerName}`
		MTScript.setVariable("link", link)
		MTScript.setVariable("player", target_name)
		MTScript.evalMacro(`[r: execLink(link, "1", player)]`)

	    }
	}
	catch (e) {
	    console.log(e.stack)
	    throw e
	}
    }

    MTScript.registerMacro("getServer", errorWrapper(getServer))
    MTScript.registerMacro("setServer", errorWrapper(setServer))
    MTScript.registerMacro("sendServer", errorWrapper(sendServer))

    if (!isServer) {
	let playerName = MTScript.evalMacro(`[r: getPlayerName()]`)
	let link = "macro://GetServer@lib:com.lp-programming.maptool.athena/none/Impersonated?SetServer,com.lp-programming.maptool.athena," + playerName
	MTScript.setVariable("link", link)
	MTScript.evalMacro(`[r: execLink(link, "1", "not-self")]`)
    }

}
catch (e) {
    console.log(e.stack)
    MapTool.chat.broadcast("error loading addon: "+e)
}

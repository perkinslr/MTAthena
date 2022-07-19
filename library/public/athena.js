try {
    let serverInfo = JSON.parse(""+MTScript.evalMacro(`[r: getInfo("server")]`))
    let isServer = serverInfo['personal server'] || serverInfo['hosting server']

    let myLib = "com.lp-programming.maptool.athena";
    let toLoad = [
	`lib://${myLib}/reliableMessageDelivery.js`,
	`lib://${myLib}/athenaClient.js`,
	`lib://${myLib}/defer.js`,
	`lib://${myLib}/athenaPage.js`,
    ];

    if (isServer) {
	toLoad.push(`lib://${myLib}/athenaServer.js`)
	toLoad.push(`lib://${myLib}/athenaPeer.js`)
    }
    
    
    
    function injectInto(namespace) {
	try {
	    MTScript.setVariable("namespace", namespace)
	    MTScript.evalMacro(`[r: js.createNS(namespace)]`)
	    MTScript.evalMacro(`[r: js.evalNS(namespace, "let namespace = MTScript.getMTScriptCallingArgs()[0]", namespace)]`)
	    for (script of toLoad) {
		MTScript.setVariable("script", script)

		MTScript.evalMacro(`[r: js.evalURI(namespace, script)]`)
	    }
	}
	catch (e) {
	    throw e
	}
    }

    function injectScript(namespace, source, path) {
	try {

	    MTScript.setVariable("source", source)
	    MTScript.setVariable("path", path)
	    let script = MTScript.evalMacro("[r: data.getStaticData(source, path)]")
	    
	    MTScript.setVariable("namespace", namespace)
	    MTScript.setVariable("script", script)
	    MTScript.evalMacro(`[r: js.evalNS(namespace, script)]`)
	}
	catch (e) {
	    throw e
	}
    }
    
    
    MTScript.registerMacro("injectAthena", injectInto)
    MTScript.registerMacro("injectScript", injectScript)
}
catch (e) {
    MapTool.chat.broadcast(e.stack)
}

/*
let playerName = MTScript.evalMacro('[r: playerName()]')
let athenaServer = null
let athenaClient



if (isServer) {
    load("com.lp-programming.maptool.athena", "/public/athenaServer.js")
    athenaServer = new AthenaServer()
    athenaClient = new AthenaClient(true, athenaServer)
}
else
{
    let link = "macro://GetServer@lib:com.lp-programming.maptool.utils/none/Impersonated?SetServer,com.lp-programming.maptool.athena,"+playerName
    MTScript.setVariable("link", link)
    MTScript.evalMacro(`[h: execLink(link, 1, "all")]`)
}

function initAthena() {
    serverName = MTScript.getMTScriptCallingArgs()[0]
    athenaClient = new AthenaClient(false, serverName)
}




*/


function load(namespace, scriptName) {
    MTScript.setVariable("namespace", namespace);
    MTScript.setVariable("scriptName", scriptName);
    let data = MTScript.evalMacro("[r: data.getStaticData(namespace, path)]");
    return eval(data)
}


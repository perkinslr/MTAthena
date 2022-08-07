let FrameProperties = []
let frameCounter = 0

function makeHtml5(kind, name, location, userdata) {
    console.log("making ", kind, "named", name)
    FrameProperties.push([kind, name, userdata])
    frameCounter++
    console.log("Frame counter: "+frameCounter);
    MTScript.evalMacro(`[r: html.${kind}5("${name}", "${location}", '${userdata}')]`)
    console.log("waiting for "+frameCounter+" frames")
}

function makeFrame5(name, location, rest) {
    FrameProperties.push(["frame", name, rest])
    frameCounter++
    console.log("Frame counter: "+frameCounter);
    MTScript.evalMacro(`[r: html.frame5("${name}", "${location}", "${rest}")]`)
    console.log("waiting for "+frameCounter+" frames")
	
}

function getFrameProperties() {
    console.log("waiting for "+(frameCounter-1)+" frames")
    if (!(--frameCounter)) {
	while (FrameProperties.length) {
	    let fp = FrameProperties.shift()
	    MTScript.setVariable("frameKind", fp[0])
	    MTScript.setVariable("frameName", fp[1])
	    MTScript.setVariable("frameData", [fp[2]])
	    console.log(fp[0])
	    console.log(fp[1])
	    console.log(fp[2])
	    MTScript.evalMacro(`[r: runJsFunction(frameName, frameKind, "setUserData", "window", frameData)]`)
	}
    }
}

function resetFrameStack() {
    frameCounter = 0;
    FrameProperties.length = 0;
    return "Resetting frame stack"
}

MTScript.registerMacro("makeHtml5", makeHtml5)
MTScript.registerMacro("makeFrame5", makeFrame5)
MTScript.registerMacro("getFrameProperties", getFrameProperties)
MTScript.registerMacro("resetFrameStack", resetFrameStack)

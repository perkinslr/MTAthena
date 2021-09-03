# Header containing metadata.  Ini style settings.  Lines beginning with # are comments.
# Header ends at the first non whitespace line after #####
#

autoExecute = true
includeLabel = false
applyToTokens = true
fontColorKey = black
fontSize = 1.00
minWidth =
maxWidth =
toolTip = 
#####

[h: js.eval("
try {
	this.athena.deliverMessages(...(JSON.parse(args[0])['athenaArgs']))
}
catch (e) {
	console.log(e.stack)
	throw e
}
", macro.args)]

[h: js.eval("
try {
	this.athena.deliverMessages(...(JSON.parse(args[0])['athenaArgs']))
}
catch (e) {
	console.log(e.stack)
	throw e
}
", macro.args)]
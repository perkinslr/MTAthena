/*
executeOnLoad = true




/////
*/
this.makeAthena = function(factory) {
	let tloFactory = function(name) {
		return new AthenaObject(name, factory)
	}
	return new Athena(tloFactory)
}

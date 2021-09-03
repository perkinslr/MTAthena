/*
executeOnLoad = true




/////
*/

function load(url) {
    MTScript.setVariable("url", url)
    let r = MTScript.execMacro(`[r: REST.get(url)]`)
    eval(r);
}

this.load = load;

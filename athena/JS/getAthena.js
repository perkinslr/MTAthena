/*
executeOnLoad = true




/////
*/


this.getAthena = function(name) {
    athena.registerAthenaClient(name)
    console.log(13)
    return `<script type='text/javascript'>
        window.page = new AthenaObject("${name}", postFormOutputFactory);
        window.page.deliveryChannel.start()
    </script>`
}



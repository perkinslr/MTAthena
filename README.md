# Get which player is hosting the server

The js UDF `[r: js.getServer()]` will give you the name of the player running the server.


# Dynamic frame data in lib:frames

You can use the JS UDF for dynamically passing data into frames created by
`[r: html.frame5(...)]`.  To use it, replace html.frame5 with js.makeFrame5, and
the same parameters as you would pass to html.frame5

In the html frame opened, you *must* include the script
```
<script type="text/javascript" src="lib://com.lp-programming.maptool.jsFrame/fetchUserProperties.js?cachelib=false" >
</script>
```

!!!Note that you cannot use <script />!!!
This script should be included as high up as you can.  If you do something that
keeps it from running, it will break the internal state. You can reset the internal
state by running `[r: js.resetFrameStack()]`.  Do this if your frames aren't
initializing properly.

The above script creates a top level Promise called `UserData` which resolves
with the third parameter to the html.frame5 call.  So somewhere on your page
you can access it like so
```
<script delay type="text/javascript">
UserData.then((ud) => {
  console.log("My user data is "+ud)
})
</script>
```
You can see it in action via
`[r: js.makeFrame5("exampleFrame", "lib://com.lp-programming.maptool.utils/Page.html", getUserName())]`
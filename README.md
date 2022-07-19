# MT Athena
[Inspired by Divmod Nevow's Athena Live Page.](https://github.com/perkinslr/nevow-py3)

This framework provides easy remote-procedure calls between HTML5 javascript contexts and the graalvm context running in MapTool.
It *also* provides similar RPCs between graalvm-js running on the hosting MT instance and graalvm-js running on client MT instances.
This allows state to be tracked in exactly one place: the server, and then views into the state to be given to players, and updated in real-time.


## Usage

This framework is designed to be injected into a javascript context, for use in other frameworks.
Until framework dependencies and cross-framework inheritance are implemented, you may need to manually resolve the order.
Injecting athena into a namespace is done via `[r: js.injectAthena(namespace)]`, it will create the namespace if it doesn't already exist.

## Demo

There is a calculator demo, heavily inspired by Nevow's calculator demo, which can be started via

```
[r: js.injectAthena("testNamespace")]
[r: js.evalURI("testNamespace","lib://com.lp-programming.maptool.athena/athenaDemo.js")]
```

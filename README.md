# Appcelerator.Hyperloop.appPauseResume
Cross-platform Hyperloop Module for detecting if app paused or resumed on both the iOS and Android
- iOS uses core T.App EventListeners pause and resume
- Android uses Narive Java Classes via Hyperloop and a setInterval to check and detect - Credit for native code: https://github.com/benbahrenburg/benCoding.Android.Tools

## How to:

1. Copy the appPauseResume.js file to your `lib/` (Alloy) or your Resources (Classic) directory
2. Copy the example code to your Titanium app
3. Go for it!

## Example

```js
// require appPauseResumeModule
var appPauseResume = require('appPauseResume');

// run appPauseResume and add resume and pause callbacks
appPauseResume({pause: function(){

                    Ti.API.info("appPauseResume - pause");

                },
                resume: function(){

                    Ti.API.info("appPauseResume - resume");

                },
                setIntervalTime: 1000,  // Optional - Default: 1000 miliseconds (1 second) 
});
```

## License
MIT

## Copyright
&copy; 2018 by Dieskim
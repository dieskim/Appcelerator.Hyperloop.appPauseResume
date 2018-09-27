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

// NOTE - IF YOU WOULD LIKE TO USE START ON IOS - Add the following to the top of you alloy.js
//////////////////////////////////////////////////////////////////////////////
// 					START - STARTUP DETECTION FOR IOS						//
if(OS_IOS){

	var TiApp = require('Titanium/TiApp');
	var UIApplicationDelegate = require('UIKit').UIApplicationDelegate;
		 
	// Create a new class to handle the delegate
	var TiAppApplicationDelegate = Hyperloop.defineClass('TiAppApplicationDelegate', 'NSObject', 'UIApplicationDelegate');
		 
	// Add the selector to handle the result
	TiAppApplicationDelegate.addMethod({
		selector: 'application:didFinishLaunchingWithOptions:',
		instance: true,
		returnType: 'BOOL',
		arguments: [
			'UIApplication',
			'NSDictionary'
		],
		callback: function(application, options) {
		if (this.didFinishLaunchingWithOptions) {
			return this.didFinishLaunchingWithOptions(application, options);
		}
		return true;
		}
	});
		 
	// Instantiate the delegate subclass
	var applicationDelegate = new TiAppApplicationDelegate();
		 
	// Called when the application finished launching. Initialize SDK's here for example
	applicationDelegate.didFinishLaunchingWithOptions = function(application, options) {
		 	
		 // fire app event start
		 Ti.App.fireEvent('start');

		return true
	};
		 
	// Finally, assign your subclass to the "applicationDelegate" property of the TiApp class
	TiApp.app().registerApplicationDelegate(applicationDelegate);

};
// 					END - STARTUP DETECTION FOR IOS							//
//////////////////////////////////////////////////////////////////////////////

// below that require the module and run code as follows

// require appPauseResumeModule
var appPauseResume = require('appPauseResume');

// run appPauseResume and add resume and pause callbacks
appPauseResume({start: function(){

						Ti.API.info("appPauseResume - start");

				},
				pause: function(){

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
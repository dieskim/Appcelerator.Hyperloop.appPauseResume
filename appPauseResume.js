/**
 * appPauseResume Hyperloop iOS and Android Module
 * Cross-platform Hyperloop Module for detecting if app paused or resumed on both the iOS and Android
 * - iOS uses core T.App EventListeners pause and resume
 * - Android uses Narive Java Classes via Hyperloop and a setInterval to check and detect - Credit for native code: https://github.com/benbahrenburg/benCoding.Android.Tools
 *
 * 
 *
 * @example    <caption>Require and run an exported function to listen for pause and resume callbacks</caption> 
 * 	
 * 	// IF YOU WOULD LIKE TO USE START ON IOS - Add the following to the top of you alloy.js
 * 	//////////////////////////////////////////////////////////////////////////////
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

 * 	// below that require the module and run code as follows
 	// require appPauseResumeModule
	var appPauseResume = require('appPauseResume/appPauseResume');

	// run appPauseResume and add resume and pause callbacks
	appPauseResume({start: function(){

						Ti.API.info("appPauseResume - start");

					},pause: function(){

                    	Ti.API.info("appPauseResume - pause");

                	},
                	resume: function(){

                    	Ti.API.info("appPauseResume - resume");

                	},
                	setIntervalTime: 1000,  // Optional - Default: 1000 miliseconds (1 second) 
	});
 * 
 * @module appPauseResume
 */

 /**
  * appPauseResume function
  *
  * @param      {object}  	data					appPauseResume data
  * @param      {callback}  data.resume				resume callback that will fire when app resumes
  * @param      {callback}  data.pause				pause callback that will fire when app pauses
  * @param      {integer}  	data.setIntervalTime	Optional - setInterval time - Default: 1000 miliseconds (1 second)
  * 
  */
function appPauseResume(data){

	// set setIntervalTime else default
	var setIntervalTime = data.setIntervalTime || 1000; // Default: 1000 miliseconds (1 second)
	
	// set firstStart
	var firstStart = true;

	// START IF - iOS / Android
	if(OS_IOS){

		// START IF - has data.start 
		if (data.start){
			
			// IF YOU WOULD LIKE TO USE START ON IOS - SEE README ABOVE FOR REQUIRMENT TO GET THIS TO WORK
			// addEventListener start - Fired when the application is started
			Ti.App.addEventListener('start', function(e){
				
				// run data start callback
				data.start();
				
			});	

		};      
		// END IF - has data.start

		// START IF - has data.pause 
		if (data.pause){
			
			// addEventListener pause - Fired when the application is paused and goes to the background
			Ti.App.addEventListener('pause', function(e){
				
				// run data pause callback
				data.pause();
				
			});	

		};      
		// END IF - has data.pause

		// START IF - has data.resume 
		if (data.resume){
			
			// addEventListener resume - Fired when the application resumes and comes back to the foreground
			Ti.App.addEventListener('resume', function(e){
				
				// run data resume callback
				data.resume();
				
			});	

		};      
		// END IF - has data.resume

	}else{ // OS_ANDROID

		// set wasInForeGround true
		var wasInForeGround = true;

		// START - setInterval - check every 1 second if app in forground or background 
		setInterval(function() {
		    
		    // get isInForeground via isInForegroundCheck function
		    var isInForeground = isInForegroundCheck();

		    // START IF - check for firstStart
		    if(firstStart && isInForeground){

		    	// START IF - has data.start 
				if (data.start){

					// run data start callback
					data.start();

				};      
				// END IF - has data.start
				
		    	// set firstStart
		    	firstStart = false;

		    };
		    // END IF - check for firstStart

		    // START IF - check for change wasInForeGround !== isInForeground
	        if (wasInForeGround !== isInForeground) {
	             
	            // START IF - if changed and NOW isInForeground
	            if(isInForeground){
	                 
	                // START IF - has data.resume 
					if (data.resume){

						// run data resume callback
						data.resume();

					};      
					// END IF - has data.resume
	                 
	            }else{
	                 
	                // START IF - has data.pause 
					if (data.pause){

						// run data resume callback
						data.pause();

					};      
					// END IF - has data.pause
	                 
	            }
	            // END IF - if changed and NOW isInForeground
	             
	            // set  wasInForeGround = isInForeground;
	            wasInForeGround = isInForeground;
	             
	        };
	        // START IF - check for change wasInForeGround !== isInForeground

		}, setIntervalTime);

	};
	// END IF - iOS / Android

};

/**
 * isInForegroundCheck checks if Android App is in foreground
 *
 * @return     {boolean}  True if in foreground, False otherwise.
 * 
 */
function isInForegroundCheck(){

	// require classes
	var Context = require('android.content.Context');
	var Activity = require('android.app.Activity');
	var ActivityManager = require('android.app.ActivityManager');
	var RunningAppProcessInfo = require('android.app.ActivityManager.RunningAppProcessInfo');

    // get appContext
    var appActivity = new Activity(Titanium.App.Android.getTopActivity());
    var appContext = appActivity.getApplicationContext();

    // get runningAppProcesses
    var appActivityManager = ActivityManager.cast(appContext.getSystemService(Context.ACTIVITY_SERVICE));
    var runningAppProcesses = appActivityManager.getRunningAppProcesses();

    // get packageName
    var packageName = appContext.getPackageName();

    // set importanceForeground
    var importanceForeground = RunningAppProcessInfo.IMPORTANCE_FOREGROUND;

    // START LOOP - runningAppProcesses
    for (var i = 0; i<runningAppProcesses.size(); i++){
        
        // get appProcess
        var appProcess = RunningAppProcessInfo.cast(runningAppProcesses.get(i));

        // START IF - process is app process and importance is foreground
        if(appProcess.processName == packageName && appProcess.importance == importanceForeground){
            
            // return true - app is in foreground
            return true;

        };
        // END IF - process is app process and importance is foreground

    };
    
    // else return false
    return false;

};
// END FUNCTION - isInForegroundCheck

// export appPauseResume
module.exports = appPauseResume;
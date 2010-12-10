// This is a mini object, to wrap audio functionality and make it better useable inside the
// tests.
// It basically implements the Finite state machine that the spec shows on page 110, and maps
// all state changes to the proper method call.
// The constructor has the following signature:
// 		new myAudio = ("url to the audio file", {
// 			autoPlay: true|false,
// 			repeatTimes: 0..x
// 			onOpen:function(){},
// 			onPlay:function(){},
// 			onStop:function(){},
// 			onPause:function(){},
// 			onComplete:function(){}
// 		})
// All options are optional.
var wma = Widget.Multimedia.AudioPlayer;
var myAudio = function(url, options){
	this.state = null;
	this._quit = false;
	this.cleanUp = function(){
		wma.stop();
		wma.onStateChange = null;
	}
	wma.onStateChange = embed.hitch(this, function(newState){
//document.getElementById("dbg").innerHTML += "<br />"+this.state +" =&gt; "+ newState;
		var fsm = [
			// oldState, newState, function to call
			[null, "opened", "onOpen"],
			["opened", "opened", "onOpen"],
			["opened", "stopped", "onStop"],
			["opened", "playing", "onPlay"],
			["stopped", "playing", "onPlay"],
			["playing", "stopped", "onStop"],
			["playing", "paused", "onPause"],
			["playing", "completed", "onComplete"],
			["completed", "playing", "onPlay"],
			["completed", "opened", "onOpen"],
			["paused", "playing", "onPlay"],
			["paused", "stopped", "onStop"],
			["stopped", "playing", "onPlay"],
			["stopped", "opened", "onOpen"]
		];
		// Set this.state before calling the method in t[2] that one maybe relies on the new state value.
		// Since we are not calling it asynchronously.
		var oldState = this.state;
		this.state = newState;
		if (options.onStateChange) options.onStateChange(oldState, newState);
		for (var i=0, l=fsm.length, t; i<l; i++){
			t = fsm[i];
			if (t[0]==oldState && t[1]==newState){
				if (options[t[2]]) options[t[2]]();
				break;
			}
		}
	});
	if (options.autoPlay){
		if (!options.onOpen){
			options.onOpen = function(){
				wma.play(options.repeatTimes ? options.repeatTimes : 1);
			}
		} else {
			var b4 = options.onOpen;
			options.onOpen = function(){
				wma.play(options.repeatTimes ? options.repeatTimes : 1);
				b4();
			}
		}
	}
	wma.open(url);
};

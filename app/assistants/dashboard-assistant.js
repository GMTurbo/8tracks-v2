//var DashboardAssistant = function(musicPlayer) {

function DashboardAssistant(musicPlayer, loading) {
	this.musicPlayer = musicPlayer;
	this.toggle = false;
	if (typeof loading !== "undefined") {
		this.load = loading;
	} else {
		this.load = false;
	}
	// if there isn't anything in the musicPlayer, don't open up the dashboard
	if (this.musicPlayer.audio() === 0) {
		Mojo.Controller.getAppController().closeStage('dashboard');
	}

	this.appController = Mojo.Controller.getAppController();
	this.locked = false;
	this.setupListeners = function() {
		this.musicPlayer.audio().addEventListener('ended', this.trackEnded.bind(this), false);
		this.musicPlayer.audio().addEventListener('play', this.trackChange.bind(this), false);
		this.musicPlayer.audio().addEventListener('playing', this.trackPlaying.bind(this), false);
		this.musicPlayer.audio().addEventListener('pause', this.trackPaused.bind(this), false);
	};
	this.removeListeners = function() {
		this.musicPlayer.audio().removeEventListener('ended', this.trackEnded.bind(this), false);
		this.musicPlayer.audio().removeEventListener('play', this.trackChange.bind(this), false);
		this.musicPlayer.audio().removeEventListener('playing', this.trackPlaying.bind(this), false);
		this.musicPlayer.audio().removeEventListener('pause', this.trackPaused.bind(this), false);
	};
}

DashboardAssistant.prototype = {
	setup: function() {
		this.controller.get('dashboard-player').addEventListener(Mojo.Event.tap, this.tapHandler.bindAsEventListener(this));
		if (typeof this.musicPlayer !== "undefined" && this.musicPlayer !== 0) {
			if (typeof this.musicPlayer.audio() !== "undefined") {
				this.setupListeners();
				this.updateSong();
			}
		}
	},

	handleLockEvent: function(event) {
		this.locked = !!event.locked;
	},
	cleanup: function() {
		this.removeListeners();
		this.controller.get('dashboard-player').removeEventListener(Mojo.Event.tap, this.tapHandler.bindAsEventListener(this));
		//	Ares.cleanupSceneAssistant(this);
	},
	activate: function() {
	//	this.loading(this.load);
	},

	updateSong: function(arg) {
		if (typeof arg === "undefined") {
			Mojo.Log.info("Updating the dashboard");
			var song = this.musicPlayer.song();
			data = {
				title: song.name,
				artist: song.artist,
				pause: this.musicPlayer.isPlaying() ? "pause" : "",
				unlike: this.musicPlayer.liked() ? "unlike" : ""
			};
			renderedInfo = Mojo.View.render({
				object: data,
				template: 'dashboard/dashboard-player'
			});
			// Insert the HTML into the DOM, replacing the existing content.
			this.controller.get('dashboard-player').update(renderedInfo);
			myNewString = this.musicPlayer.photo().replace("sq100", "max200");
			strarray = myNewString.split(".");
			if (strarray[strarray.length - 1] === "jpeg" || strarray[strarray.length - 1] === "gif") {
				myNewString = Mojo.appPath + "/images/8tracksDash2.png";
			}
			// the template render doesn't do this properly, doing it manually
			this.controller.get('dashboard-player-art').style.background = "url(\"" + myNewString + "\") center center no-repeat";
		} else {
			Mojo.Log.info("Updating the dashboard");
			data = {
				title: arg,
				artist: "",
				pause: this.musicPlayer.isPlaying() ? "pause" : "",
				unlike: this.musicPlayer.liked() ? "unlike" : ""
			};
			renderedInfo = Mojo.View.render({
				object: data,
				template: 'dashboard/dashboard-player'
			});
			// Insert the HTML into the DOM, replacing the existing content.
			this.controller.get('dashboard-player').update(renderedInfo);
			myNewString = this.musicPlayer.photo().replace("sq100", "max200");
			strarray = myNewString.split(".");
			if (strarray[strarray.length - 1] === "jpeg" || strarray[strarray.length - 1] === "gif") {
				myNewString = Mojo.appPath + "/images/8tracksDash2.png";
			}
			// the template render doesn't do this properly, doing it manually
			//var thumbUrl = this.musicPlayer.photo();//Util.albumArtLargeUrlFormatter(song.thumbnails[0]);
			this.controller.get('dashboard-player-art').style.background = "url(\"" + myNewString + "\") center center no-repeat";
		}
	},
	updateDashboard: function(data) {
		if (data.type === 'audio') {
			this.musicPlayer.update(data.audio, data.photo, data.trackinfo);
			this.updateSong();
		} else if (data.type === 'error') {
			this.updateSong(data.text);
		} else if (data.type === 'likeState') {
			this.musicPlayer.updateLike(data.state);
		}
	},
	trackEnded: function(event) {
		this.updateSong();
	},
	trackChange: function(event) {
		this.updateSong();
	},
	trackPaused: function(event) {
		if (!this.musicPlayer.isPlaying()) {
			this.controller.get('playpause2').removeClassName("pause");
			this.controller.get('playpause2').removeClassName("loading");
		} else {
			this.controller.get('playpause2').addClassName("pause");
		}
	},
	togglePlay: function() {
		if (this.musicPlayer.isPlaying()) {
			this.controller.get('playpause2').removeClassName("pause");
			this.musicPlayer.audio().pause();
		} else {
			this.controller.get('playpause2').removeClassName("loading");
			this.controller.get('playpause2').addClassName("pause");
			this.musicPlayer.audio().play();
		}
	},
	trackPlaying: function() {
		this.controller.get('playpause2').removeClassName("loading");
		this.controller.get('playpause2').addClassName("pause");
	},
	toggleLike: function() {
		if (this.musicPlayer.liked()) {
			this.controller.get('likeunlike').removeClassName("unlike");
			this.musicPlayer.toggleLike(false);
		} else {
			this.controller.get('likeunlike').addClassName("unlike");
			this.musicPlayer.toggleLike(true);
		}
	},

	updatePausePlayIcon: function() {
		if (this.musicPlayer.isPlaying()) {
			this.controller.get('playpause2').addClassName("pause");
		} else {
			this.controller.get('playpause2').removeClassName("pause");
		}
	},
	loading: function(state) {
		if (state) {
		//	this.controller.get('playpause2').removeClassName("pause");
		//	this.controller.get('playpause2').addClassName("loading");
		} else {
		//	this.controller.get('playpause2').removeClassName("loading");
		}
	},
	relaunch8tracks: function() {
		var parameters = {
			id: 'com.gmturbo.8tracks',
			params: {
				focus: true
			}
		};
		return new Mojo.Service.Request('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: parameters
		});
	},
	tapHandler: function(event) {
		var id = event.target.id;
		switch (id) {
		case 'playpause2':
			//if (event.target.className.indexOf("loading") < 0) {
				this.togglePlay();
			//}
			break;
		case 'next2':
			this.loading(true);
			this.musicPlayer.skipTrack();
			this.updateSong("Retrieving Next...");
			break;
		case 'likeunlike':
			if (this.musicPlayer.loggedIn()) {
				this.toggleLike();
			}
			break;
		default:
			if (!this.locked) {
				this.relaunch8tracks();
			}
			break;
		}
	}
};
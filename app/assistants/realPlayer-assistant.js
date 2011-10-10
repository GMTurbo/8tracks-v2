function RealPlayerAssistant(mixInfo, token, response, creds, setid, liked) {
	this.mixInfo = mixInfo;
	this.token = token;
	this.creds = creds;
	this.loggedin = creds.loggedIn;
	this.snapindex = 0;
	this.toggle = false;
	this.tracks = [];
	this.tracks.push(response.set.track);
	this.trackinfo = response;
	this.mphoto = mixInfo.cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/tracks_01.png" : mixInfo.cover_urls.sq100;
	this.lastsong = false;
	this.songProps = []; //skipped durations liked
	this.listindex = 0;
	this.commentlist = [];
	this.setid = setid;
	this.songstate = 1;
	this.headsetService = undefined;
	this.setupListeners = function() {
		this.stream1.addEventListener('ended', this.trackEnded.bind(this), false);
		this.stream1.addEventListener('play', this.trackPlay.bind(this), false);
		this.stream1.addEventListener('playing', this.trackPlaying.bind(this), false);
		this.stream1.addEventListener('pause', this.trackPaused.bind(this), false);
		this.stream1.addEventListener('timeupdate', this.updateScrubber.bind(this), false);
		this.stream1.addEventListener('stalled', this.trackStalled.bind(this), false);
		this.stream1.addEventListener('error', this.trackError.bind(this), false);
		this.stream1.addEventListener('canplay', this.trackReady.bind(this), false);
		this.stream1.addEventListener('ratechange', this.trackRateChange.bind(this), false);
		this.stream1.addEventListener('durationchange', this.trackDurationChanged.bind(this), false);
	};
	this.removeListeners = function() {
		this.stream1.removeEventListener('pause', this.trackPaused.bind(this), false);
		this.stream1.removeEventListener('play', this.trackPlay.bind(this), false);
		this.stream1.removeEventListener('playing', this.trackPlaying.bind(this), false);
		this.stream1.removeEventListener('Ended', this.trackEnded.bind(this), false);
		this.stream1.removeEventListener('timeupdate', this.updateScrubber.bind(this), false);
		this.stream1.removeEventListener('stalled', this.trackStalled.bind(this), false);
		this.stream1.removeEventListener('error', this.trackError.bind(this), false);
		this.stream1.removeEventListener('canplay', this.trackReady.bind(this), false);
		this.stream1.removeEventListener('ratechange', this.trackRateChange.bind(this), false);
		this.stream1.removeEventListener('durationchange', this.trackDurationChanged.bind(this), false);
	};
	this.writeDescription = function() {
		//this.$.divider2.setLabel("Tracks (" + this.tracks.length + ")");
	};
	this.downloaded = false;
	if (typeof this.stream1 !== "object") {
		this.stream1 = new Audio();
	}
	this.fillTagGrid = function(tags) {
		list = [];
		step = Math.floor(tags.length / 3, 0);
		for (i = 0; i < step; i++) {
			list.push({
				tag1: tags[3 * i],
				tag2: tags[3 * i + 1],
				tag3: tags[3 * i + 2]
			});
		}
		ret = 0;
		//get remaining tags
		count = tags.length - (3 * step);
		var remainder;
		switch (count) {
		case 1:
			remainder = {
				tag1: tags[tags.length - 1]
			};
			list.push(remainder);
			ret = 1;
			break;
		case 2:
			remainder = {
				tag1: tags[tags.length - 2],
				tag2: tags[tags.length - 1]
			};
			list.push(remainder);
			ret = 2;
			break;
		}

		listModel = {
			items: list
		};
		return {
			getList: function() {
				return listModel;
			},
			getBadTagCount: function() {
				return ret;
			}
		};
	};
	this.fillList = function(tracks) {
		this.list = new Array(tracks.length);
		for (var i = 0; i < tracks.length; i++) {
			if (i !== tracks.length - 1) {
				if (this.songProps[i].skipped) {
					this.list[i] = {
						title: tracks[i].name,
						currentartist: tracks[i].performer,
						skipped: tracks[i].name,
						likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
						duration: this.songProps[i].duration.toString() === "NaN:NaN" ? "?" : this.songProps[i].duration,
						liked: this.songProps[i].liked,
						buyImage: "images/buy.png"
					};
				} else {
					this.list[i] = {
						title: tracks[i].name,
						currentartist: tracks[i].performer,
						oldsong: tracks[i].name,
						likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
						duration: this.songProps[i].duration.toString() == "NaN:NaN" ? "?" : this.songProps[i].duration,
						liked: this.songProps[i].liked,
						buyImage: "images/buy.png"
					};
				}
			} else {
				if (this.songProps[i].set === false) {
					this.songProps[i].liked = tracks[i].faved_by_current_user;
					this.songProps[i].set = true;
				}
				this.list[i] = {
					title: tracks[i].name,
					currentartist: tracks[i].performer,
					currentsong: tracks[i].name,
					buyImage: "images/speaker.png",
					likeImage: this.songProps[i].liked === true ? "images/likedstar.png" : "images/unlikedstarblack.png",
					duration: "...",
					liked: this.songProps[i].liked
				};
			}
		}
		listModel = {
			items: this.list.reverse()
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
	this.fillCommentList = function(comments, userid) {
		this.commentlist = new Array(comments.length);
		//new Date(tracks[i].first_published_at).toRelativeTime() === "NaN years ago" ? "by " + tracks[i].user.login : new Date(tracks[i].first_published_at).toRelativeTime()
		for (var i = 0; i < comments.length; i++) {
			this.commentlist[i] = {
				username: comments[i].user.login,
				userid: comments[i].user_id,
				timestamp: new Date(comments[i].created_at).toRelativeTime() === "NaN years ago" ? comments[i].created_at : new Date(comments[i].created_at).toRelativeTime(),
				body: comments[i].body,
				otheruserimage: comments[i].user.avatar_urls.sq56 === "/images/avatars/sq56.jpg" ? "images/unknownUser.jpg" : comments[i].user.avatar_urls.sq56,
				myuserimage: comments[i].user.avatar_urls.sq56 === "/images/avatars/sq56.jpg" ? "images/unknownUser.jpg" : comments[i].user.avatar_urls.sq56,
				hide: userid === comments[i].user_id ? "hide" : "",
				show: userid === comments[i].user_id ? "show" : "",
				right: userid === comments[i].user_id ? "right" : ""
			};
		}
		listModel = {
			items: this.commentlist.reverse()
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
	this.populateList = function(bit) {
		f = this.fillList(this.tracks);
		this.controller.setWidgetModel("list2", f.getList());
		if (typeof bit === "undefined") {
			current = this.controller.get("list2").mojo.getNodeByIndex(0);
			current.addClassName("current");
		}
	};
}

RealPlayerAssistant.prototype = {
	setup: function() {
		this.cmdMenuModel = {
			visible: true,
			items: [
				{},
				{
				items: [{
					iconPath: 'images/pause1.png',
					label: $L('Pause'),
					command: '0'
				},{
					iconPath: 'images/forward.png',
					label: $L('Forward'),
					command: 'fwd'
				}]
			},{}]
		};

		cookie3 = new Mojo.Model.Cookie("nmp");
		if (!cookie3.get()) {
			nmpState = 'autoplay';
		} else {
			nmpState = cookie3.get().answer;
		}

		this.appMenuModel = {
			items: [
				{
				label: "Share Mix...",
				command: 'share'
			},
				{
				label: "Refresh Comments",
				command: 'refcom'
			},
				{
				label: "Auto-play Next Mix",
				command: nmpState == 'autoplay' ? "return" : "autoplay",
				iconPath: nmpState == 'autoplay' ? Mojo.appPath + "/images/check_mark.png" : "none"
			}
				]
		};

		//if (!this.loggedin) {
		//	this.appMenuModel.items[1].label = "Like Mix (Login Required)";
	//	}
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);
		var atts = {
			textFieldName: 'comment',
			hintText: 'Enter comment',
			modelProperty: 'value',
			multiline: true,
			limitResize: false
		};
		this.controller.setupWidget('multilineTextField', atts, {});
		this.controller.setupWidget("progressbarId", this.attributes = {
			title: "Progress Bar",
			image: "images/header-icon.png",
			modelProperty: "progress"
		},
		this.model = {
			iconPath: "../images/progress-bar-background.png",
			progress: 0
		});
		

		this.headsetService = new Mojo.Service.Request('palm://com.palm.keys/headset', {
			method: 'status',
			parameters: {
				'subscribe': true
			},
			onFailure: function() {
				Mojo.Log.error("Could not subscribe to headset events");
			},
			onSuccess: this.handleheadset.bind(this)
		});

		this.bluetoothService = new Mojo.Service.Request('palm://com.palm.keys/media', {
			method: 'status',
			parameters: {
				'subscribe': true
			},
			onFailure: function() {
				Mojo.Log.error("Could not subscribe to headset events");
			},
			onSuccess: this.handleBluetooth.bind(this)
		});
		if (this.stream1.currentSrc.length > 0) {
			this.removeListeners();
			this.stream1.pause();
			this.stream1 = 0;
			this.stream1 = new Audio();
		}
		this.setupListeners();
		this.libs = MojoLoader.require({
			name: "mediaextension",
			version: "1.0"
		});
		try {
			this.extObj = this.libs.mediaextension.MediaExtension.getInstance(this.stream1);
			this.extObj.audioClass = "media";
		}
		catch(err) {
			//this.banner(err);
		}
		this.controller.setupWidget("scrollerId2", {
			mode: 'vertical'
		},
		{
			snapIndex: 0
		});
		attributes = {
			itemTemplate: "templates/tagTemplate",
			swipeToDelete: false,
			reorderable: false
		};
		tags = this.mixInfo.tag_list_cache;
		this.controller.setupWidget("taglist2", attributes, this.fillTagGrid(tags.split(",")).getList());
		this.controller.document.addEventListener("keyup", this.keyupHandler.bind(this), true);
		this.controller.listen(this.controller.get("taglist2"), Mojo.Event.listTap, this.handleListTap.bind(this));
		Mojo.Event.listen(this.controller.document, Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
		Mojo.Event.listen(this.controller.document, Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
		Mojo.Event.listen(this.controller.get("overlayMix"), Mojo.Event.tap, this.infoTapped.bind(this));
		//	likeTap
		//addcomment
		Mojo.Event.listen(this.controller.get("addcomment"), Mojo.Event.tap, this.addComment.bind(this));
		//sendbuttonid
		Mojo.Event.listen(this.controller.get("sendbuttonid"), Mojo.Event.tap, this.postComment.bind(this));

		Mojo.Event.listen(this.controller.get("overlayHeart"), Mojo.Event.tap, this.likeTap.bind(this));
		Mojo.Event.listen(this.controller.get("overlayNewMix"), Mojo.Event.tap, this.nextMixtapped.bind(this));
		//	Mojo.Event.listen(this.controller.get('musicControls'), Mojo.Event.tap, this.tapHandler.bind(this));
		this.controller.listen(this.controller.get("scrollerId2"), Mojo.Event.scrollStarting, this.handleUpdateScroll.bindAsEventListener(this));
		this.controller.listen(this.controller.get("userInfo1"), Mojo.Event.tap, this.showUserProfile.bind(this));
		//Mojo.Event.listen(this.controller.get("bodyScroller"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Ares.setupSceneAssistant(this);
		Mojo.Event.listen(this.controller.get("bodyScroller"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
	},
	cleanup: function() {
		DashPlayerInstance.cleanup();
		DashPlayerInstance = 0;
		this.stream1.pause();
		this.removeListeners();

		this.stream1 = 0;
		if (this.headsetService) {
			this.headsetService.cancel();
		}
		if (this.bluetoothService) {
			this.bluetoothService.cancel();
		}
		this.controller.document.removeEventListener("keyup", this.keyupHandler.bind(this), true);
		Mojo.Event.stopListening(this.controller.document, Mojo.Event.stageDeactivate, this.onDeactivateHandler.bind(this));
		Mojo.Event.stopListening(this.controller.document, Mojo.Event.stageActivate, this.onActivateHandler.bind(this));
		this.controller.stopListening(this.controller.get("taglist2"), Mojo.Event.listTap, this.handleListTap.bind(this));
		Mojo.Event.stopListening(this.controller.get("overlayMix"), Mojo.Event.tap, this.infoTapped.bind(this));
		Mojo.Event.stopListening(this.controller.get("overlayHeart"), Mojo.Event.tap, this.likeTap.bind(this));
		Mojo.Event.stopListening(this.controller.get("overlayNewMix"), Mojo.Event.tap, this.nextMixtapped.bind(this));
		this.controller.stopListening(this.controller.get("scrollerId2"), Mojo.Event.scrollStarting, this.handleUpdateScroll.bindAsEventListener(this));
		this.controller.stopListening(this.controller.get("userInfo1"), Mojo.Event.tap, this.showUserProfile.bind(this));
		Mojo.Event.stopListening(this.controller.get("bodyScroller"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.stopListening(this.controller.get("addcomment"), Mojo.Event.tap, this.addComment.bind(this));
		Mojo.Event.stopListening(this.controller.get("sendbuttonid"), Mojo.Event.tap, this.postComment.bind(this));

		this.closing = true;
		var self = this;
		setTimeout(function() {
			self.onActivateHandler();
		},
		1500);
		self.closeDashMain();
		Ares.cleanupSceneAssistant(this);
	},
	handleUpdateScroll: function(event) {
		b = event;
	},
	addComment: function(event) {
		$('inputcomment').style.bottom = "100px";
		$('inputcomment').style.left = "25px";
		$('inputcomment').style.height = "120px";
		//inputcomment
		$('sendbuttonid').addClassName("show");
		$('inputcomment').removeClassName("shrink");
		
		this.controller.get("multilineTextField").focus();
		//this.controller.get("multilineTextField").mojo.setValue("");
	},
	list1Fetchitems: function(inSender, inListElement, inOffset, inCount) {
		//if(typeof this.ready !== "undefined"){
		// provide list data by calling noticeUpdatedItems as in this example:inListElement.mojo.noticeUpdatedItems(inOffset, /* array of inCount items */)
		//this.updateListWithNewItems.delay(0.1, inListElement, inOffset, this.commentlist.slice(inOffset, inOffset + inCount), this.commentlist.length);
		this.updateListWithNewItems(inListElement, inOffset, this.commentlist.slice(inOffset, inOffset + inCount), this.commentlist.length);
		//}
	},

	updateListWithNewItems: function(listWidget, offset, items, length) {
		// Give the item models to the list widget, and render them into the DOM.
		//setTimeout(function() {
			listWidget.mojo.noticeUpdatedItems(offset, items);
		//},
		//200);

		// This will do nothing when the list size hasn't actually changed, 
		// but is necessary when initially setting up the list.
		listWidget.mojo.setLength(length);
	},
	list1Listtap: function(InSender, event){
		//var b = event;
		var showUser = function(user){
		var parameters = {
				id: 'com.gmturbo.8tracks',
				params: {
					launchScene: 'UserInfoScene',
					user: user
				}
			};
			return new Mojo.Service.Request('palm://com.palm.applicationManager', {
				method: 'open',
				parameters: parameters
			});
		};
		if (event.originalEvent.target.className.indexOf("otheruserimage") > -1) {
			var getName = function(innerHTML){
				end = innerHTML.indexOf(" says:");
				return innerHTML.substring(0,end);
			};
			//showUser(getName(event.target.innerText));
		}
	},
	keyupHandler:function(event){
	if (this.controller.sceneId === "mojo-scene-realPlayer") {
			if (Mojo.Char.isValidWrittenChar(event.keyCode) || Mojo.Char.isDigit(event.keyCode) || Mojo.Char.isEnterKey(event.keyCode)) {
				this.controller.get("bodyScroller").mojo.setSnapIndex(1, true);
					if (!Mojo.Char.isEnterKey(event.keyCode)) {
						this.addComment();
						this.controller.get('multilineTextField').mojo.focus();
					} else {
						if($('sendbuttonid').className.indexOf("show")>0 && this.controller.get('multilineTextField').mojo.getValue().length > 0){
							this.postComment();
						}
					}
			}
		}
	},
	postComment: function() {
		if(this.loggedin){
		spinner(true);
		//"review[mix_id]=14&review[body]=body" http://8tracks.com/reviews.xml
		$('inputcomment').style.bottom = "-600px";
		$('inputcomment').style.left = "-320px";
		$('inputcomment').style.height = "0px";
		$('inputcomment').addClassName("shrink");
		//$('sendbuttonid').removeClassName("show");
		this.controller.get("multilineTextField").blur();
		var message = this.controller.get("multilineTextField").mojo.getValue();
		var onFailure = function(transport) {
			spinner(false);
			popUp("Error", "Could not post comment\n" + transport.responseText, this.controller);
		};
		var onComplete = function(transport) {
			this.loadComments();
			spinner(false);
			/*$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('sendbuttonid').removeClassName("show");
			this.controller.get("multilineTextField").blur();
			this.controller.get("multilineTextField").mojo.setValue("");*/
		};
		var postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
		var url = "http://8tracks.com/reviews.xml";
		var postbody = "review[mix_id]=" + this.mixInfo.id + "&review[body]=" + message.replace(/ /g, "%20");
		post(url, postdata, onComplete.bind(this), onFailure.bind(this), postbody);
		}else{
			showBanner("login required to comment");
		}
	},
	loadComments: function() {
		spinner(true);
		var onComplete = function(response) {
			f = this.fillCommentList(response.responseJSON.reviews, this.creds.userid);
			this.controller.setWidgetModel("list1", f.getList());
			//this.ready = true;
			//this.$.list1.items = this.commentlist;
		//	this.controller.get("list1").mojo.noticeUpdatedItems(0, this.commentlist); //noticeAddedItems
		//	this.controller.get("list1").mojo.setLength(this.commentlist.length);
			this.controller.setWidgetModel("html2", {
				commentcount: f.getList().items.length === 50 ? f.getList().items.length + "+" : f.getList().items.length
			});
			var self = this;
			this.controller.window.setTimeout(function() {
				self.controller.get("scroller8").mojo.revealBottom();
			},
			300);
			spinner(false);
		};

		var onFailure = function(response) {
			showBanner("error getting mix comments");
			spinner(false);
		};

		var url = "http://8tracks.com/mixes/" + this.mixInfo.id + "/reviews.json?per_page=50";
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	handleUpdate: function(event) {
		switch (event.value) {
		case 0:
			this.controller.get("overlayHeart").removeClassName("move");
			this.controller.get("overlayNewMix").removeClassName("move");
			$('overlayMix').style.top = "55px";
			$('addcomment').style.right = "-55px";
			$('overlayImage').removeClassName("fade");
			$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			//$('inputcomment').addClassName("shrink");
			$('sendbuttonid').removeClassName("show");
			this.controller.get("multilineTextField").mojo.setValue("");
			this.controller.get("multilineTextField").blur();
			this.snapindex = 0;
			break;
		case 1:
			this.controller.get("overlayHeart").addClassName("move");
			this.controller.get("overlayNewMix").addClassName("move");
			$('overlayMix').style.top = "-72px";
			$('addcomment').style.right = "0px";
			$('overlayImage').addClassName("fade");
			//$('inputcomment').removeClassName("shrink");
			/*$('inputcomment').style.bottom = "100px";
			$('inputcomment').style.left = "25px";
			$('inputcomment').style.height = "120px";
			$('sendbuttonid').addClassName("show");*/
			this.snapindex = 1;
			break;
		}
	},
	loading: function(state) {
		state ? $('playpause').addClassName("load") : $('playpause').removeClassName("load");
		//this.loadingInDash(state);
	},
	activate: function(params) {
		this.controller.get('realPlayer').style.top = "0px";
		$('overlayMain3').style.top = "490px";
		$('inputcomment').addClassName("shrink");
		spinner(false);
		this.mixInfo.liked_by_current_user ? $("overlayHeart").addClassName("unlikeIcn") : $("overlayHeart").removeClassName("unlikeIcn");
		this.mixLikeStateChange = false;
		if (!params) {
			$('overlayImage').style.left = "-320px";
			this.loading(true);
			this.controller.get("label1").innerText = this.mixInfo.name;
			this.$.picture1.setSrc(this.mphoto);
			$('overlayImage').style.background = "url(" + this.mphoto.replace("sq100", "max200") + ") no-repeat center";
			songprop = {
				skipped: false,
				duration: 0,
				liked: false,
				set: false
			};
			this.songProps.push(songprop);
			this.populateList();
			this.stream1.audioClass = "media";
			if (!this.stream1.paused) {
				this.stream1.pause();
			}
			this.stream1.src = this.trackinfo.set.track.url;
			this.stream1.load();
			this.loadComments();
			DashPlayerInstance = new DashboardPlayer();
			DashPlayerInstance.setSkipEvent(this.skipTrack.bind(this));
			DashPlayerInstance.setLikeToggleEvent(this.setLikeStateCurrent.bind(this));
			DashPlayerInstance.setLogin(this.loggedin);
			DashPlayerInstance.update(this.stream1, this.mphoto, this.trackinfo);
		}
	},
	
	loginFromMain: function(creds) {
		this.creds = checkForCredentials();
		this.loggedin = this.creds.loggedIn;
		this.userid = this.creds.userid;
		this.appMenuModel.items[1].label = this.loggedin ? "Like Mix" : "Like Mix (Login Required)";
		this.appMenuModel.items[1].disabled = !this.loggedin;
		this.controller.modelChanged(this.appMenuModel, this);
	},
	infoTapped: function(event) {
		$('overlayMix').style.right = "-30px";
		$('mixText1').update(this.mixInfo.description); //mixText
		$('userInfo1').update(this.mixInfo.user.login); //mixText
		$('overlayMain3').style.top = "52px";
	},
	likeTap: function(event) {
		if (this.loggedin) {
			if (this.snapindex === 0) {
				state = $("overlayHeart").className.indexOf("unlike") < 0;
				state ? $("overlayHeart").addClassName("unlikeIcn") : $("overlayHeart").removeClassName("unlikeIcn");
				state ? this.Like() : this.UnLike();
			}
		} else {
			showBanner("login required to like");
		}
	},
	nextMixtapped: function(event) {
		if (this.snapindex === 0) {
			this.loadNextMix();
		}
	},
	handleListTap: function(event) {
		searchTag = event.originalEvent.target.innerText;
		if (searchTag !== "") {
			//$('overlayMain3').style.top = "481px";
			$('overlayMain3').style.top = "490px";
			$('overlayMix').style.right = "0px";
			// send message to main-scene
			this.searchMain(searchTag);
		}
	},
	//// HEADSET AND BLUETOOTH HANDLERS
	handleheadset: function(payload) {
		switch (payload.state) {
		case "double_click":
			this.skipTrack();
			break;
		case "single_click":
			this.toggleSongState();
			break;
		}
	},
	handleBluetooth: function(event) {
		var state = event.state;
		if (state) {
			if (state === "down") {
				var key = event.key;
				switch (key) {
					// this looks strange, but there may be events we need to translate
				case "next":
					this.skipTrack();
					break;
				case "pause":
					this.songState(false);
					break;
				case "play":
					this.songState(true);
					break;
				}
			}
		}
	},
	////////////////////////////////////////////////////////////
	// >>>>>>>>>>>>>>>>>> MAIN COMMUNICATION EVENTS <<<<<<<<<<<<<<<<<<<//
	refreshMain: function() {
		refreshLikedMixes = function() {
			var parameters = {
				id: 'com.gmturbo.8tracks',
				params: {
					launchScene: 'main',
					refresh: true
				}
			};
			return new Mojo.Service.Request('palm://com.palm.applicationManager', {
				method: 'open',
				parameters: parameters
			});
		};
		refreshLikedMixes();
	},

	searchMain: function(criteria) {
		searchMixes = function(criteria) {
			var parameters = {
				id: 'com.gmturbo.8tracks',
				params: {
					launchScene: 'main',
					refresh: false,
					searchterm: criteria
				}
			};
			return new Mojo.Service.Request('palm://com.palm.applicationManager', {
				method: 'open',
				parameters: parameters
			});
		};
		searchMixes(criteria);
	},
	showUserProfile: function(event) {
		showUser = function(user) {
			var parameters = {
				id: 'com.gmturbo.8tracks',
				params: {
					launchScene: 'UserInfoScene',
					user: user
				}
			};
			return new Mojo.Service.Request('palm://com.palm.applicationManager', {
				method: 'open',
				parameters: parameters
			});
		};
		if (event.target.id === "userInfo1" && event.target.innerHTML !== "") {
			showUser(event.target.innerHTML);
			$('overlayMain3').style.top = "490px";
			$('overlayMix').style.right = "0px";
		}
	},
	closeDashMain: function() {
		closeDash = function() {
			var parameters = {
				id: 'com.gmturbo.8tracks',
				params: {
					launchScene: 'main',
					refresh: false,
					closeDash: true
				}
			};
			return new Mojo.Service.Request('palm://com.palm.applicationManager', {
				method: 'open',
				parameters: parameters
			});
		};
		closeDash();
	},
	////////////////////////////////////////////////////////////
	// >>>>>>>>>>>>>>>>>> DASHBOARD EVENTS <<<<<<<<<<<<<<<<<<<//
	updateDash: function(audioObj, pic, trackinfo) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'audio',
				audio: audioObj,
				photo: pic,
				trackinfo: trackinfo
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},
	loadingInDash: function(state) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			dashboardStage.delegateToSceneAssistant("loading", state);
		}
	},
	sendMessageToDash: function(message) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'error',
				text: message
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},
	setDashLikeState: function(state) {
		var dashboardStage = this.controller.stageController.getAppController().getStageProxy("dashboard");
		if (dashboardStage) {
			data = {
				type: 'likeState',
				state: state
			};
			dashboardStage.delegateToSceneAssistant("updateDashboard", data);
		}
	},
	loadDashboard: function(stageController) {
		load = $("playpause").className.indexOf("load") > 0;
		stageController.pushScene("dashboard", DashPlayerInstance, load);
	},
	onActivateHandler: function(event) {
		var dashboardController = Mojo.Controller.getAppController().getStageController("dashboard");
		if (dashboardController) {
			this.appController = Mojo.Controller.getAppController();
			this.appController.closeStage("dashboard");
		}
	},
	onDeactivateHandler: function(event) {
		if (DashPlayerInstance !== 0) {
			if (DashPlayerInstance.audio() !== 0) {
				var dashboardController = Mojo.Controller.getAppController().getStageController("dashboard");
				//this.controller.stageController.getAppController().getStageController("dashboard");
				if (!dashboardController) {
					this.appController = Mojo.Controller.getAppController();
					this.appController.createStageWithCallback({
						name: "dashboard",
						lightweight: true,
						clickableWhenLocked: true
					},
					this.loadDashboard, 'dashboard');
					/*this.controller.stageController.getAppController().createStageWithCallback({
						name: "dashboard",
						lightweight: true,
						clickableWhenLocked: true
					},
					this.loadDashboard, 'dashboard');*/
				}
			}
		}
	},
	////////////////////////////////////////////////////////
	//  AUDIO STREAM EVENT HANDLERS	
	updateScrubber: function(event) {
		if (this.stream1.duration.toString() !== "NaN") {
			this.loading(false);
			var time = (parseFloat(this.stream1.currentTime) / parseFloat(this.stream1.duration));
			this.model.progress = time;
			this.controller.modelChanged(this.model, this);
			if (this.stream1.currentTime + 2 > this.stream1.buffered.end()) {
				if (Math.ceil(this.stream1.buffered.end()) != Math.ceil(this.stream1.duration)) {
					this.songState(0);
				}
			}
		}
	},

	trackEnded: function(event) {
		this.nextTrack();
	},

	trackPaused: function(event) {
		this.songState(0);
	},

	trackStalled: function(event) {
		Mojo.Log.info("track has stalled...");
		this.loading(true);
	},

	trackError: function(event) {
		this.loading(false);
		var title;
		var message;
		//this.sound.pause();
		//this.sound.src = Mojo.appPath + "/sounds/error.mp3";
		//this.sound.load();
		//this.sound.play();
		Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/error.mp3");
		switch (this.stream1.error.code) {
		case 1:
			title = "Denied";
			message = "8tracks denied this song for you to stream!";
			this.sendMessageToDash("denied stream from server");
			//popUp(title, message, this.controller);
			break;
		case 2:
			title = "Network Error";
			message = "problem fetching this song from the servers.. Let's try the next one!";
			this.sendMessageToDash(title);
			//popUp(title, message, this.controller);
			break;
		case 3:
			title = "Decode Error";
			message = "Error decoding the song!";
			this.sendMessageToDash("error decoding song");
			//popUp(title, message, this.controller);
			break;
		case 4:
			title = "Not Supported type!";
			message = "How did this happen?!";
			this.sendMessageToDash(title);
			//popUp(title, message, this.controller);
			break;
		}
		popUp(title, message, this.controller);
		if (!this.lastsong) {
			this.nextTrack();
		} else {
			this.controller.stageController.popScene({
				error: 1
			});
		}
	},
	trackPlay: function(event) {
		this.songState(1);
	},

	trackPlaying: function(event) {
		this.loading(false);
		$('overlayImage').style.left = "0px";
		current = this.controller.get("list2").mojo.getNodeByIndex(0);
		current.addClassName("current");
		current.style.cssText = "-webkit-transition-property:right;-webkit-transition-duration: 2.0s; -webkit-transition-timing-function: ease-out-in";
		current.style.right = "0px";
	},
	trackReady: function(event) {
		this.loading(false);
		//var self = this;
		//this.controller.window.setTimeout(function(){self.stream1.play();},3000);
		this.stream1.play();
	},
	trackRateChange: function(event) {
		//var buffer = this.audio1.buffered;
	},
	trackDurationChanged: function(event) {
		//this.modifyListElementDuration();
	},
	//////////////////////////////////////
	//>>>>>>>>>>>>>>>>>>>>>>>> NEXT AND SKIP TRACKS + NEXTMIX <<<<<<<<<<<<//
	loadNextMix: function() {
		spinner(true);
		$('overlayImage').style.left = "-320px";
		var onComplete = function(transport) {
			if (transport.status == 200) {
				showBanner("New Mix: " + transport.responseJSON.next_mix.name);
				this.mphoto = transport.responseJSON.next_mix.cover_urls.sq100;
				this.$.picture1.setSrc(this.mphoto);
				$('overlayImage').style.background = "url(" + this.mphoto.replace("sq100", "max200") + ") no-repeat center";
				this.model.progress = 0;
				this.controller.modelChanged(this.model, this);
				this.mixInfo = transport.responseJSON.next_mix;
				//this.$.label1.innerText = this.mixInfo.name;
				this.controller.get("label1").innerText = this.mixInfo.name;
				this.liked = this.mixInfo.liked_by_current_user;
				this.liked ? $("overlayHeart").addClassName("unlikeIcn") : $("overlayHeart").removeClassName("unlikeIcn");
				this.appMenuModel.items[1].label = this.mixInfo.liked_by_current_user ? "Unlike Mix" : "Like Mix";
				this.appMenuModel.items[1].command = this.mixInfo.liked_by_current_user ? "unlike" : "like";
				this.controller.modelChanged(this.appMenuModel, this);
				this.setid = this.mixInfo.id;
				var onComplete = function(transport) {
					if (transport.status == 200) {
						spinner(false);
						this.stream1.pause();
						this.stream1.src = transport.responseJSON.set.track.url;
						this.stream1.load();
						response = transport.responseJSON;
						this.tracks = 0;
						this.tracks = [];
						this.tracks.push(response.set.track);
						this.trackinfo = response;
						this.lastsong = false;
						this.songProps = [];
						songprop = {
							skipped: false,
							duration: 0,
							liked: false,
							set: false
						};
						this.songProps.push(songprop);
						this.listindex = 0;
						this.songstate = 1;
						DashPlayerInstance.update(this.stream1, this.mphoto, this.trackinfo);
						this.updateDash(this.stream1, this.mphoto, this.trackinfo);
						//this.showBanner("Now Playing: " + transport.responseJSON.set.track.performer + " - " + transport.responseJSON.set.track.name);
						this.populateList();
						this.loadComments();
						//this.writeDescription();
					}
				};
				var onFailure = function(transport) {
					spinner(false);
					popUp("Failure", "692 realPlayer-assistant.js");
				};
				url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mixInfo.id;
				request(url, onComplete.bind(this), onFailure.bind(this));
			}
		};
		var onFailure = function(transport) {
			this.controller.stageController.popScene(true);
		};
		url = "http://8tracks.com/sets/" + this.token + "/play_next_mix.json?mix_id=" + this.mixInfo.id;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	nextTrack: function() {
		this.loading(true);
		$('playpause').removeClassName("pause");
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.lastsong = transport.responseJSON.set.at_end;
				if (!this.lastsong) {
					this.model.progress = 0;
					this.controller.modelChanged(this.model, this);
					if (typeof this.stream1 !== "undefined") {
						dur = toReadableTime(this.stream1.duration);
					} else {
						dur = 0;
					}
					this.songProps[this.songProps.length - 1].duration = dur;
					props = {
						skipped: false,
						duration: 0,
						liked: false,
						set: false
					};
					this.songProps.push(props);
					this.stream1.pause();
					this.track = transport.response;
					this.stream1.src = transport.responseJSON.set.track.url;
					//showBanner("Now Playing: " + transport.responseJSON.set.track.performer + " - " + transport.responseJSON.set.track.name);
					this.stream1.load();
					this.tracks.push(transport.responseJSON.set.track);
					this.trackinfo = transport.responseJSON;
					DashPlayerInstance.update(this.stream1, this.mphoto, this.trackinfo);
					this.updateDash(this.stream1, this.mphoto, this.trackinfo);
					this.populateList();
					//this.writeDescription();
				} else {
					this.sendMessageToDash("No more skips allowed");
					this.loadNextMix();
				}
			} else if (transport.status === "403 Forbidden") {
				this.loading(false);
				showBanner("Can't skip anymore");
				this.sendMessageToDash("No more skips allowed");
			}
		};
		var onFailure = function(transport) {
			popUp("Oops", "Error getting next track...", this.controller);
		};
		url = "http://8tracks.com/sets/" + this.token + "/next.json?mix_id=" + this.mixInfo.id;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},

	skipTrack: function() {
		this.loading(true);
		$('playpause').removeClassName("pause");
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.lastsong = transport.responseJSON.set.at_end;
				if (!this.lastsong) {
					this.model.progress = 0;
					this.controller.modelChanged(this.model, this);
					if (typeof this.stream1 !== "undefined") {
						dur = toReadableTime(this.stream1.duration);
					} else {
						dur = 0;
					}
					this.songProps[this.songProps.length - 1].skipped = true;
					this.songProps[this.songProps.length - 1].duration = dur;
					props = {
						skipped: false,
						duration: 0,
						liked: false,
						set: false
					};
					this.songProps.push(props);
					this.stream1.pause();
					this.lastsong = transport.responseJSON.set.at_end;
					this.track = transport.response;
					this.stream1.src = transport.responseJSON.set.track.url;
					this.stream1.load();
					this.tracks.push(transport.responseJSON.set.track);
					this.trackinfo = transport.responseJSON;
					DashPlayerInstance.update(this.stream1, this.mphoto, this.trackinfo);
					this.updateDash(this.stream1, this.mphoto, this.trackinfo);
					this.populateList();
				} else {
					this.sendMessageToDash("Loading New Mix");
					this.loadNextMix();
				}
			} else if (transport.status === "403 Forbidden") {
				Mojo.Controller.getAppController().playSoundNotification("defaultapp", "sounds/error.mp3");
				popUp("Oops!", "Can't skip anymore", this.controller);
				this.sendMessageToDash("No more skips allowed");
			}
		};
		var onFailure = function(transport) {
			this.loading(false);
			popUp("Oops", "No more skips allowed...", this.controller);
			this.sendMessageToDash("No more skips allowed");
		};
		url = "http://8tracks.com/sets/" + this.token + "/skip.json?mix_id=" + this.mixInfo.id;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	///////////////////////////////////////////////////
	///////////////// SONG STATE //////////////////////
	toggleSongState: function() {
		if (!this.songstate) {
			this.songstate = 1;
		} else {
			this.songstate = 0;
		}
		this.songState(this.songstate);
	},

	songState: function(state) {
		if (state) {
			this.songstate = state;
			this.loading(true);
			this.stream1.play();
			$('playpause').addClassName("pause");
		} else {
			this.songstate = state;
			this.stream1.pause();
			this.loading(false);
			$('playpause').removeClassName("pause");
		}
	},
	/////////////////////////////////////////////////////////////////////////////
	//>>>>>>>>>>>>>>>>>>>>>>>>>>> TAP EVENTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	html1Tap: function(inSender, event) {
		var id = event.target.id;
		if (id === 'playpause') {
			//if (event.id.className.indexOf("load") < 0) {
			this.toggleSongState();
			//}
		} else if (id === 'next') {
			this.loading(true);
			//this.nextTrack();
			this.skipTrack();
		} else if (id === 'likeunlike') {
			if (this.loggedIn) {
				this.toggleLike();
			}
		} else {
			event.stop();
		}
	},
	list2Listtap: function(inSender, event) {
		var selected = this.tracks[this.tracks.length - event.index - 1];
		classname = event.originalEvent.target.className;
		if (classname === "likeimg") {
			if (this.loggedin) {
				event.item.liked = !event.item.liked;
				this.songProps[this.tracks.length - event.index - 1].liked = event.item.liked;
				this.setLikeState(selected, !event.item.liked);
			} else {
				showBanner("login required to like songs");
			}
		} else if (classname === "buyimg") {
			this.Buy(selected.buy_link, selected.performer, selected.name);
		} else {
			this.controller.popupSubmenu({
				onChoose: this.popupHandler,
				placeNear: event.originalEvent.target,
				items: [{
					label: 'Write it down',
					command: 'save'
				}]
			});
		}
	},
	Buy: function(link, artist, song) {
		var onFailure = function(transport) {
			popUp("Oops", "Where is your Amazon Store App?!", this.controller);
		};
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'launch',
			parameters: {
				id: 'com.palm.app.amazonstore',
				params: {
					artist: artist,
					song: song
				}
			},
			onFailure: onFailure.bind(this)
		});
	},
	writeDown: function(artist, track, src) {
		var onSuccess = function(transport) {

		};
		var onFailure = function(transport) {
			popUp("Error", "couldn't launch notes", this.controller);
		};
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'launch',
			parameters: {
				id: 'com.palm.app.notes',
				params: {
					text: artist + ": " + track + "\n" + src
				}
			},
			onFailure: onFailure.bind(this),
			onSuccess: onSuccess.bind(this)
		});
	},

	// >>>>>>>>>>>>>>>>>>>>>> SONG AND MIX LIKING <<<<<<<<<<<<<<<<<<<<<	
	setLikeStateCurrent: function(state) {
		song = this.tracks[this.tracks.length - 1];
		this.songProps[this.songProps.length - 1].liked = state;
		this.setLikeState(song, !state);
	},
	setLikeState: function(song, state) {
		this.song = song;
		onFailure = function(transport) {
			popUp("Error", "Could not Like this song! Try to login again...", this.controller);
		};
		var postdata = "login=" + this.username + "&password=" + this.password;
		if (!state) {
			url = "http://8tracks.com/tracks/" + song.id + "/fav.json";
			post(url, postdata, this.songLiked.bind(this), onFailure.bind(this));
		} else {
			url = "http://8tracks.com/tracks/" + song.id + "/unfav.json";
			post(url, postdata, this.songUnliked.bind(this), onFailure.bind(this));
		}
	},
	songLiked: function(transport) {
		DashPlayerInstance.updateLike(true);
		this.setDashLikeState(true);
		showBanner("You like " + this.song.name);
		this.populateList(false);
	},
	songUnliked: function(transport) {
		DashPlayerInstance.updateLike(false);
		this.setDashLikeState(false);
		showBanner("You don't like " + this.song.name + " anymore");
		this.populateList(false);
	},
	Like: function() {
		onFailure = function(transport) {
			showBanner("Could not add mix to your liked mix. Try to login again");
		};
		postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
		url = "http://8tracks.com/mixes/" + this.mixInfo.id + "/like.json";
		post(url, postdata, this.LikedComplete.bind(this), onFailure.bind(this));
	},
	LikedComplete: function(response) {
		if (response.responseJSON.status === "200 OK") {
			showBanner("Mixed added to your Liked list");
			this.liked = true;
			this.appMenuModel.items[1].command = "unlike";
			this.appMenuModel.items[1].label = "Unlike Mix";
			this.controller.modelChanged(this.appMenuModel, this);
			this.refreshMain();
		} else {
			popUp(response.responseJSON.status, response.responseJSON.notices, this.controller);
		}
	},
	UnLike: function() {
		onFailure = function(transport) {
			showBanner("Could not remove mix to your liked mix. Try to login again");
		};
		postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
		url = "http://8tracks.com/mixes/" + this.mixInfo.id + "/unlike.json";
		post(url, postdata, this.UnLikedComplete.bind(this), onFailure.bind(this));
	},
	UnLikedComplete: function(response) {
		showBanner("Mixed removed from your Liked list");
		this.liked = false;
		this.appMenuModel.items[1].command = "like";
		this.appMenuModel.items[1].label = "Like Mix";
		this.controller.modelChanged(this.appMenuModel, this);
		this.refreshMain();
	},
	// >>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<	
	picture1Tap: function(inSender, event) {
		//push to fullscreen
		this.controller.stageController.pushScene("picViewer", this.mixInfo.cover_urls);
	}
};

RealPlayerAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'share':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "Checkout this 8tracks mix",
						//text: "<b><br><a href=\"www.8tracks.com"+this.mixInfo.path+"\">"+this.mixInfo.name+"</a>" + "</b><br><br><i>" + this.mixInfo.description +"</i>"
						text: "<b><img src=\"" + this.mphoto + "\"><br>" + this.mixInfo.name + "</b><br><br><i>" + this.mixInfo.description + "</i><br><br><a href=\"www.8tracks.com" + this.mixInfo.path + "\">" + "Check it out here" + "</a>"
					}
				}
			});
			break;
		case 'like':
			this.Like();
			break;
		case 'unlike':
			this.UnLike();
			break;
		case 'refcom':
			this.loadComments();
			break;
		}
	} else if (event.type === Mojo.Event.back) {
		if ($('overlayMain3').style.top !== "490px") {
			$('overlayMain3').style.top = "490px";
			$('overlayMix').style.right = "0px";
			event.stop();
		} else if ($('inputcomment').style.bottom !== "-600px") {
			$('inputcomment').style.bottom = "-600px";
			$('inputcomment').style.left = "-320px";
			$('inputcomment').style.height = "0px";
			$('sendbuttonid').removeClassName("show");
			//$('inputcomment').addClassName("shrink");
			this.controller.get("multilineTextField").mojo.setValue("");
			this.controller.get("multilineTextField").blur();
			event.stop();
		}else if(this.snapindex === 1){
			this.controller.get("bodyScroller").mojo.setSnapIndex(0,true);
			event.stop();
		}
		/*else{
			ret = { 
				mixLikeChange: this.mixLikeStateChange
			};
			data = {
				scene: "realPlayer",
				info: ret
			};
			this.controller.stageController.popScene(data);
		}*/
	}
};

RealPlayerAssistant.prototype.popupHandler = function(command) {
	this.controller = Mojo.Controller.stageController.activeScene();
	var selected = this.tracks[this.tracks.length - this.listindex - 1];
	switch (command) {
	case "save":
		if (this.creds.username.toLowerCase() === "gmturbo") {
			this.writeDown(selected.performer, selected.name, selected.url);
		} else {
			this.writeDown(selected.performer, selected.name, "");
		}
		break;
	}
};
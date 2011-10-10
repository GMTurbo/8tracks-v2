function UserInfoSceneAssistant(argFromPusher) {
	this.userInfo = argFromPusher;
	this.creds = checkForCredentials();
	this.loggedin = this.creds.loggedIn;
	this.followchanged = false;
	this.pageCounts = {
		liked: {
			current: 1,
			total: 1,
			max: 100
		},
		created: {
			current: 1,
			total: 1,
			max: 100
		}
	};
	this.userLists = {
		created: [],
		liked: []
	};
	this.fillList = function(tracks) {
		maxlength = 40;
		var list = [];
		for (i = 0; i < tracks.length; i++) {
			list[i] = {
				title: tracks[i].name,
				leftImage: tracks[i].cover_urls.sq56.toString() === "/images/mix_covers/sq56.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[i].cover_urls.sq56,
				tag: tracks[i].tag_list_cache,
				mixInfo: tracks[i],
				set_id: this.setid,
				type: "mix",
				timeSince: new Date(tracks[i].first_published_at).toRelativeTime() === "NaN years ago" ? "by " + tracks[i].user.login : new Date(tracks[i].first_published_at).toRelativeTime() + " by " + tracks[i].user.login
			};
		}
		listModel = {
			items: list
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
}

UserInfoSceneAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		Mojo.Event.listen(this.controller.get("scroller3"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
	},

	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
		Mojo.Event.stopListening(this.controller.get("scroller3"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
	},
	activate: function(params) {
		if (!params) {
			spinner(true);
			this.getUserInfo();
		} else if (params.user) {
			this.user = {
				login: params.user
			};
			spinner(true);
			this.getUserInfo();
		}
	},
	loadProfileFromPlayer: function(user) {
		//clearLists();
		if (this.userInfo.login !== user) {
			this.controller.get('scroller3').mojo.setSnapIndex(0, true);
			this.userInfo = {
				login: user
			};
			spinner(true);
			this.controller.get("label1").innerText = "Profile";
			this.controller.get("likedcount").addClassName("notready");
			this.controller.get("createdcount").addClassName("notready");
			this.getUserInfo();
			var self = this;
			this.controller.window.setTimeout(function() {
				self.controller.get("InfoSlider").mojo.scrollTo(0, 0, true, true);
			},
			50);
			this.controller.window.setTimeout(function() {
				self.controller.get("CreatedSlider").mojo.scrollTo(0, 0, true, true);
			},
			100);
			this.controller.window.setTimeout(function() {
				self.controller.get("LikedSlider").mojo.scrollTo(0, 0, true, true);
			},
			150);
		}
	},
	handleUpdate: function(event) {
		switch (event.value) {
		case 0:
			this.controller.get("likedid").removeClassName("showliked");
			this.controller.get("createdid").removeClassName("showliked");
			break;
		case 1:
			this.controller.get("likedid").removeClassName("showliked");
			this.controller.get("createdid").addClassName("showliked");
			break;
		case 2:
			this.controller.get("likedid").addClassName("showliked");
			this.controller.get("createdid").removeClassName("showliked");
			break;
		}
	},
	html2Tap: function(inSender, event) {
		switch (event.target.id) {
		case "createdid":
			this.controller.get('scroller3').mojo.setSnapIndex(1, true);
			break;
		case "likedid":
			this.controller.get('scroller3').mojo.setSnapIndex(2, true);
			break;
		}
	},
	likedTapped: function(event) {
		this.controller.get('scroller3').mojo.setSnapIndex(2, true);
	},
	createdTapped: function(event) {
		this.controller.get('scroller3').mojo.setSnapIndex(1, true);
	},
	getUserInfo: function() {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				var user = transport.responseJSON.user;
				var image = transport.responseJSON.user.avatar_urls.sq100.toString() === "/images/avatars/sq100.jpg" ? Mojo.appPath + "/images/unknownUser.jpg" : transport.responseJSON.user.avatar_urls.sq100;
				var descrip = "No Bio Available";
				if (user.bio_html != null) {
					des = user.bio_html.replace(/<p>/g, "");
					descrip = des.replace(/<\/p>/g, "");
				}
				this.controller.setWidgetModel("html1", {
					userimage: image,
					name: user.login,
					location: user.location,
					description: descrip
				});
				if (!user.followed_by_current_user) {
					this.controller.get("userinfoimage").removeClassName("unfollow");
				} else {
					this.controller.get("userinfoimage").addClassName("unfollow");
				}
				this.fillUserLists();
			}
		};
		var onFailure = function(transport) {
			popUp("Oops", "Error retrieving user data!");
		};
		var url = "http://8tracks.com/users/" + this.userInfo.login + ".json";
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	list1Listtap: function(inSender, event) {
		this.mix = event.item.mixInfo;
		this.loadPlaylist();
	},
	loadPlaylist: function() {
		spinner(true);
		var onComplete = function(transport) {
			if (transport.status == 200) {
				this.token = transport.responseJSON.play_token;
				this.playMix();
			} else {
				popUp("Error", "Didn't Get 200 from json response", this.controller);
			}
		};
		var onFailure = function() {
			spinner(false);
			popUp("Oops", "failed to get play_token", this.controller);
		};
		var url = "http://8tracks.com/sets/new.json";
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	playMix: function() {
		var onComplete = function(transport) {
			if (transport.status == 200) {
				launch8tracksPlayer = function(mixInfo, token, transport, setid, creds, liked) {
					var parameters = {
						id: 'com.gmturbo.8tracks',
						params: {
							launchScene: 'realPlayer',
							mixInfo: mixInfo,
							token: token,
							response: transport.responseJSON,
							creds: creds,
							liked: liked
						}
					};
					return new Mojo.Service.Request('palm://com.palm.applicationManager', {
						method: 'open',
						parameters: parameters
					});
				};
				spinner(false);
				launch8tracksPlayer(this.mix, this.token, transport, -1, checkForCredentials(), this.mix.liked_by_current_user);
			}
		};
		var onFailure = function(transport) {
			spinner(false);
			popUp(transport.responseJSON.status, transport.responseJSON.notices[0], this.controller);
		};
		var url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mix.id;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	list2Fetchitems: function(inSender, inListElement, inOffset, inCount) {
		// provide list data by calling noticeUpdatedItems as in this example:
		// inListElement.mojo.noticeUpdatedItems(inOffset, /* array of inCount items */)
		//this.updateListWithNewItems.delay(0.2, inListElement, inOffset, this.userLists.liked.slice(inOffset, inOffset + inCount));
		this.updateListWithNewItems(inListElement, inOffset,this.userLists.liked.slice(inOffset, inOffset + inCount), this.userLists.liked.length);
	},
	list1Fetchitems: function(inSender, inListElement, inOffset, inCount) {
		// provide list data by calling noticeUpdatedItems as in this example:inListElement.mojo.noticeUpdatedItems(inOffset, /* array of inCount items */)
		//this.updateListWithNewItems.delay(0.2, inListElement, inOffset, this.userLists.created.slice(inOffset, inOffset + inCount));
		this.updateListWithNewItems(inListElement, inOffset,this.userLists.created.slice(inOffset, inOffset + inCount), this.userLists.created.length);
	},

	updateListWithNewItems: function(listWidget, offset, items, length) {
		// Give the item models to the list widget, and render them into the DOM.
		//setTimeout(function() {
			listWidget.mojo.noticeUpdatedItems(offset, items);
		//},
		//500);

		// This will do nothing when the list size hasn't actually changed, 
		// but is necessary when initially setting up the list.
		listWidget.mojo.setLength(length);
	},
	fillUserLists: function() {
		this.fillCreatedMixes(); // fillLikedMixes is called onCompleted
	},
	fillCreatedMixes: function() {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				this.pageCounts.created.current = 1;
				var mixes = transport.responseJSON.mixes;
				this.pageCounts.created.total = Math.round(parseInt(transport.responseJSON.total_entries, 0) / 12);
				var f = this.fillList(mixes);
				this.userLists.created = f.getList().items;
				this.$.list1.items = f.getList().items;
				this.controller.get("list1").mojo.noticeUpdatedItems(0, this.userLists.created); //noticeAddedItems
				this.controller.get("list1").mojo.setLength(this.userLists.created.length);
				this.fillLikedMixes();
			}
		};
		var onFailure = function(transport) {
			showBanner("Failed to retrieve Created mixes");
			this.fillLikedMixes();
		};
		var url = "http://8tracks.com/users/" + this.userInfo.login + "/mixes.json?per_page=300";
		request(url, onComplete.bind(this), onFailure.bind(this));
	},

	fillLikedMixes: function() {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				this.pageCounts.liked.current = 1;
				this.pageCounts.liked.total = Math.round(parseInt(transport.responseJSON.total_entries, 0) / 12);
				var f = this.fillList(transport.responseJSON.mixes);
				this.userLists.liked = f.getList().items;
				this.$.list2.items = f.getList().items;
				this.controller.get("list2").mojo.noticeUpdatedItems(0, this.userLists.liked); //noticeAddedItems
				this.controller.get("list2").mojo.setLength(this.userLists.liked.length);
				this.controller.setWidgetModel("html2", {
					likedcount: this.userLists.liked.length === 0 ? "0" : this.userLists.liked.length,
					createdcount: this.userLists.created.length === 0 ? "0" : this.userLists.created.length
				});
				this.userLists.created.length === 0 ? this.controller.get("createdcount").addClassName("notready") : this.controller.get("createdcount").removeClassName("notready");
				this.userLists.liked.length === 0 ? this.controller.get("likedcount").addClassName("notready") : this.controller.get("likedcount").removeClassName("notready");
				spinner(false);
			}
		};
		var onFailure = function(transport) {
			spinner(false);
			showBanner("Failed to retrieve liked mixes");
		};
		var url = "http://8tracks.com/users/" + this.userInfo.login + "/mixes.json?view=liked&per_page=250";
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	html1Tap: function(inSender, event) {
		if (event.target.id == "userinfoimage") {
			if (this.loggedin) {
				spinner(true);
				if (this.controller.get("userinfoimage").className.indexOf("unfollow") > 0) { // following user
					this.unFollowUser();
				}else{
					this.followUser();
				}
			} else {
				showBanner("login required to follow");
			}
		}
	},
	followUser: function() {
		var postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
		var url = "http://8tracks.com/users/" + this.userInfo.id + "/follow.json";
		var onFailure = function(transport) {
			popUp("Error", "Could not follow user. Try to login again");
			spinner(false);
		};
		post(url, postdata, this.followedComplete.bind(this), onFailure.bind(this));
	},
	unFollowUser: function() {
		var postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
		var url = "http://8tracks.com/users/" + this.userInfo.id + "/unfollow.json";
		var onFailure = function(transport) {
			popUp("Error", "Could not unfollow user. Try to login again");
			spinner(false);
		};
		post(url, postdata, this.unFollowedComplete.bind(this), onFailure.bind(this));
	},
	followedComplete: function(transport) {
		if (transport.responseJSON.status == "200 OK") {
			showBanner("You are now following " + this.userInfo.login);
			this.followchanged = true;
			this.controller.get("userinfoimage").addClassName("unfollow");
			spinner(false);
		} else {
			popUp(transport.responseJSON.status, transport.responseJSON.notices);
			spinner(false);
		}
	},
	unFollowedComplete: function(transport) {
		if (transport.responseJSON.status == "200 OK") {
			showBanner("You are no longer following " + this.userInfo.login);
			this.followchanged = true;
			this.controller.get("userinfoimage").removeClassName("unfollow");
			spinner(false);
		} else {
			popUp(transport.responseJSON.status, transport.responseJSON.notices);
			spinner(false);
		}
	},
	closeDash: function() {
		var close = function() {
			var dashboardController = Mojo.Controller.getAppController().getStageController("dashboard");
			if (dashboardController) {
				this.appController = Mojo.Controller.getAppController();
				this.appController.closeStage("dashboard");
			}
		};
		this.controller.window.setTimeout(function() {
			close();
		},
		1500);
	}
};

UserInfoSceneAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {} else if (event.type === Mojo.Event.back) {
		ret = {
			mixfeedChanged: this.followchanged
		};
		data = {
			scene: "UserInfoScene",
			info: ret
		};
		this.controller.stageController.popScene(data);
	}
};
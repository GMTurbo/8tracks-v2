function MainAssistant(argFromPusher) {
	this.creds = checkForCredentials();
	this.loggedin = this.creds.loggedIn;
	this.userid = this.creds.userid;
	this.textFieldFocused = true;
	this.snapIndex = 1;
	this.itemLists = {
		latest: [],
		pop: [],
		hot: [],
		random: [],
		featured: [],
		liked: [],
		mine: [],
		mixfeed: []
	};
	this.fillSearchList = function(tracks) {
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
	this.fillGrid = function(tracks) {
		maxlength = 40;
		var list = [];
		count = Math.floor(tracks.length / 2);
		remainder = tracks.length % 2;
		for (i = 0; i < count; i++) {
			name1 = shrinkText(tracks[2 * i].name, maxlength);
			name2 = shrinkText(tracks[2 * i + 1].name, maxlength);
			list[i] = {
				mixName1: name1,
				mixName2: name2,
				leftImage: tracks[2 * i].cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[2 * i].cover_urls.sq100,
				rightImage: tracks[2 * i + 1].cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[2 * i + 1].cover_urls.sq100,
				mixInfo1: tracks[2 * i],
				mixInfo2: tracks[2 * i + 1]
			};
		}
		if (remainder == 1) {
			list.push({
				mixName1: shrinkText(tracks[tracks.length - 1].name, maxlength),
				mixName2: "empty",
				rightImage: Mojo.appPath + "/images/no_image.png",
				leftImage: tracks[tracks.length - 1].cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[tracks.length - 1].cover_urls.sq100,
				mixInfo1: tracks[tracks.length - 1],
				mixInfo2: null,
				empty: "empty"
			});
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
	this.pageCounts = {
		recent: {
			current: 1,
			total: 1,
			max: 4
		},
		popular: {
			current: 1,
			total: 1,
			max: 4
		},
		hot: {
			current: 1,
			total: 1,
			max: 4
		},
		liked: {
			current: 1,
			total: 1,
			max: 100
		},
		featured: {
			current: 1,
			total: 1,
			max: 4
		},
		random: {
			current: 1,
			total: 1,
			max: 4
		},
		mine: {
			current: 1,
			total: 1,
			max: 100
		},
		search: {
			current: 1,
			total: 1,
			max: 100
		},
		mixfeed: {
			current: 1,
			total: 1,
			max: 100
		}
	};
}

MainAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		Mojo.Event.listen(this.controller.get("scroller8"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.listen(this.controller.get("scroller13"), Mojo.Event.propertyChange, this.handleUpdate2.bind(this));
		Mojo.Event.listen(this.controller.get("SearchtextField"), Mojo.Event.propertyChange, this.textFieldPC.bind(this));
		Mojo.Event.listen(this.controller.get('userInfo'), Mojo.Event.tap, this.userTap.bind(this));
		Mojo.Event.listen(this.controller.get('play'), Mojo.Event.tap, this.loadPlaylist.bind(this));
		Mojo.Event.listen(this.controller.get('like'), Mojo.Event.tap, this.likeTap.bind(this));
		Mojo.Event.listen(this.controller.get('likefilter'), Mojo.Event.tap, this.likeFilter.bind(this));
		Mojo.Event.listen(this.controller.get('likefilterclear'), Mojo.Event.tap, this.likeFilterClear.bind(this));
		attributes = {
			itemTemplate: "templates/tagTemplate",
			swipeToDelete: false,
			reorderable: false
		};
		model = {
			items: [{
				tag1: "rock",
				tag2: "synth",
				tag3: "rap"
			}]
		};
		this.controller.setupWidget("taglist", attributes, model);
		this.controller.setupWidget("scrollerId", {
			mode: 'vertical'
		},
		{
			snapIndex: 0
		});
		this.controller.listen(this.controller.get("taglist"), Mojo.Event.listTap, this.handleListTap.bind(this));
		this.controller.listen(this.controller.get("scrollerId"), Mojo.Event.propertyChange, this.handleUpdateScroll.bindAsEventListener(this));
		this.controller.listen(this.controller.get("scrollerId"), Mojo.Event.scrollStarting, this.handleUpdateScroll.bindAsEventListener(this));

		defmix = getDefaultMix();
		this.appMenuModel = {
			items: [
				{
				label: this.loggedin ? "Logout " + this.creds.username : "Login",
				command: this.loggedin ? 'logout' : 'login',
				shortcut: 'l'
			},
				{
				label: "Support",
				command: 'support'
			}/*
				{
				label: $L("Default Mix"),
				items: [
					{
					label: "Featured",
					command: 4,
					iconPath: defmix == 4 ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Latest",
					command: 0,
					iconPath: defmix === 0 ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Popular",
					command: 1,
					iconPath: defmix == 1 ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Hot",
					command: 2,
					iconPath: defmix == 2 ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Random",
					command: 3,
					iconPath: defmix == 3 ? Mojo.appPath + "/images/check_mark.png" : "none"
				},
					{
					label: "Liked",
					command: 5,
					iconPath: defmix == 5 ? Mojo.appPath + "/images/check_mark.png" : "none",
					disabled: !this.loggedin
				},
					{
					label: "My Mixes",
					command: 6,
					iconPath: defmix == 6 ? Mojo.appPath + "/images/check_mark.png" : "none",
					disabled: !this.loggedin
				}
					]
			}*/
				]
		};

		this.typelabel = "Latest";
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);
		this.cmdMenuModel = {
			visible: true,
			items: [{
				
			},{items: [{
					label: "Refresh",
					icon: 'refresh',
					command: 'cmd-refresh'
				}]},{
				items: [{
					label: this.typelabel,
					command: 'type'
				}]
			}]
		};
		this.controller.setupWidget(Mojo.Menu.commandMenu, {
			spacerHeight: 0,
			menuClass: 'no-fade'
		},
		this.cmdMenuModel);
		toggle = false;
		if (!this.loggedin && toggle) {
			newElements = [];
			for (i = 0; i < 5; i++) {
				newElements.push(this.$.scroller8.model.snapElements.x[i]);
			}
			this.$.scroller8.snapElements = "slider1,slider2,slider3,slider4,grid";
			this.$.scroller8.model.snapElements = {
				x: newElements
			};
			this.controller.modelChanged(this.$.scroller8.model, this);
		}
		
		attributes = {
			hintText: $L('8tracks Search'),
			modelProperty: 'original',
			multiline: false,
			label: $L('To:'),
			focus: false,
			textFieldMode: 'sentence-case',
			limitResize: false,
			enterSubmits: false,
			holdToEnable: true
		};
		model = {
			'original ': $L(''),
			disabled: false
		};
		this.controller.setupWidget('SearchtextField', attributes, model);
		
		attributes = {
			hintText: $L('Search Liked Mixes'),
			modelProperty: 'original',
			multiline: false,
			label: $L('To:'),
			focus: true,
			textFieldMode: 'sentence-case',
			limitResize: false,
			enterSubmits: true,
			holdToEnable: true
		};
		model = {
			'original ': $L(''),
			disabled: false
		};
		this.controller.setupWidget('LikedFilter', attributes, model);
		
		data = {
			selected1: "",
			selected2: "selected",
			selected3: ""
		};
		renderedInfo = Mojo.View.render({
			object: data,
			template: 'templates/selectionTemplate'
		});
		// Insert the HTML into the DOM, replacing the existing content.
		this.controller.get('searchHtml').update(renderedInfo);
		this.controller.get('all').addClassName("selected");
		this.searchCriteria = "q";
		this.controller.document.addEventListener("keyup", this.keyupHandler.bind(this), true);
		//	this.setupMenus({
		//		header: 'Filter Field Widget'
		//	});
	},
	cleanup: function() {
		Mojo.Event.stopListening(this.controller.get("scroller8"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.stopListening(this.controller.get("scroller13"), Mojo.Event.propertyChange, this.handleUpdate2.bind(this));
		Mojo.Event.stopListening(this.controller.get("SearchtextField"), Mojo.Event.propertyChange, this.textFieldPC.bind(this));
		Mojo.Event.stopListening(this.controller.get('userInfo'), Mojo.Event.tap, this.userTap.bind(this));
		Mojo.Event.stopListening(this.controller.get('play'), Mojo.Event.tap, this.loadPlaylist.bind(this));
		Mojo.Event.stopListening(this.controller.get('like'), Mojo.Event.tap, this.likeTap.bind(this));
		Mojo.Event.stopListening(this.controller.get('likefilter'), Mojo.Event.tap, this.likeFilter.bind(this));
		Mojo.Event.stopListening(this.controller.get('likefilterclear'), Mojo.Event.tap, this.likeFilterClear.bind(this));
		this.controller.document.removeEventListener("keyup", this.keyupHandler.bind(this), true);
		this.controller.stopListening(this.controller.get('scrollerId'), Mojo.Event.propertyChange, this.handleUpdateScroll.bindAsEventListener(this));
		this.controller.stopListening(this.controller.get('scrollerId'), Mojo.Event.scrollStarting, this.handleUpdateScroll.bindAsEventListener(this));
		this.controller.stopListening(this.controller.get('taglist'), Mojo.Event.listTap, this.handleListTap.bindAsEventListener(this));
		Ares.cleanupSceneAssistant(this);
	},
	activate: function(params) {
		if (!params) {
			this.controller.get("SearchtextField").mojo.focus();
			this.textFieldFocused = false;
			this.controller.get('scroller8').mojo.setSnapIndex(1, false);
			this.snapIndex = 1;
			this.refresh();
		}else if(params.scene === "UserInfoScene"){
			if(params.info.mixfeedChanged){
				spinner(true);
				this.filler("list8", "mixfeed", true, false, true);
			}
		}
	},
	restartPageCount: function(type) {
		if (typeof type !== "undefined") {
			switch (type) {
			case "recent":
				this.pageCounts.recent = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "latest":
				this.pageCounts.recent = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "featured":
				this.pageCounts.featured = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "hot":
				this.pageCounts.hot = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "popular":
				this.pageCounts.popular = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "liked":
				this.pageCounts.liked = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "random":
				this.pageCounts.random = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "mine":
				this.pageCounts.mine = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "mixfeed":
				this.pageCounts.mixfeed = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			case "search":
				this.pageCounts.recent = {
					current: 1,
					total: 1,
					max: 4
				};
				break;
			}
		} else {
			this.pageCounts = {
				recent: {
					current: 1,
					total: 1,
					max: 4
				},
				popular: {
					current: 1,
					total: 1,
					max: 4
				},
				hot: {
					current: 1,
					total: 1,
					max: 4
				},
				liked: {
					current: 1,
					total: 1,
					max: 100
				},
				featured: {
					current: 1,
					total: 1,
					max: 4
				},
				random: {
					current: 1,
					total: 1,
					max: 4
				},
				mine: {
					current: 1,
					total: 1,
					max: 100
				},
				search: {
					current: 1,
					total: 1,
					max: 1
				},
				mixfeed: {
					current: 1,
					total: 1,
					max: 100
				}
			};
		}
	},
	refresh: function() {
		spinner(true);
		var self = this;
		this.restartPageCount();
		this.filler("list1", "recent", true, false);
		this.controller.window.setTimeout(function() {
			self.filler("list2", "popular", true, false);
		},
		1000);
		this.controller.window.setTimeout(function() {
			self.filler("list3", "hot", true, false);
		},
		1500);
		this.controller.window.setTimeout(function() {
			self.filler("list4", "random", true, false);
		},
		2000);
		this.controller.window.setTimeout(function() {
			self.filler("list5", "featured", true, false, true);
		},
		2500);
		if (this.loggedin) {
			this.controller.window.setTimeout(function() {
				self.filler("list6", "liked", true, false);
			},
			3000);
			this.controller.window.setTimeout(function() {
				self.filler("list7", "mine", true, false);
			},
			3500);
			this.controller.window.setTimeout(function() {
				self.filler("list8", "mixfeed", true, false);
			},
			4000);
		}
	},
	refreshLiked: function() {
		if (this.loggedin) {
			var self = this;
			spinner(true);
			this.pageCounts.liked.current = 1;
			this.pageCounts.liked.total = 1;
			//this.filler("list6", "liked", true, false);
			this.controller.window.setTimeout(function() {
				self.filler("list6", "liked", true, false, true);
			},
			1000);
		}
	},
	refreshCurrent: function() {
		var self = this;
		spinner(true);
		switch (this.snapIndex) {
		case 0:
			// search
			//this.controller.window.setTimeout(function() {
			//	self.filler("list2", "popular", true, false);
			//	},
			//	1000);
			break;
		case 1:
			// latest
			this.restartPageCount("recent");
			this.controller.window.setTimeout(function() {
				self.filler("list1", "recent", true, false, true);
			},
			1000);
			break;
		case 2:
			// pop
			this.restartPageCount("popular");
			this.controller.window.setTimeout(function() {
				self.filler("list2", "popular", true, false, true);
			},
			1000);
			break;
		case 3:
			// hot
			this.restartPageCount("hot");
			this.controller.window.setTimeout(function() {
				self.filler("list3", "hot", true, false, true);
			},
			1000);
			break;
		case 4:
			// ran
			this.restartPageCount("random");
			this.controller.window.setTimeout(function() {
				self.filler("list4", "random", true, false, true);
			},
			1000);
			break;
		case 5:
			// feat
			this.restartPageCount("featured");
			this.controller.window.setTimeout(function() {
				self.filler("list5", "featured", true, false, true);
			},
			1000);
			break;
		case 6:
			// liked
			if(this.loggedin){
			this.restartPageCount("liked");
			this.controller.window.setTimeout(function() {
				self.filler("list6", "liked", true, false, true);
			},
			1000);
			}else{spinner(false);}
			break;
		case 7:
			// mf
			if(this.loggedin){
			this.restartPageCount("mixfeed");
			this.controller.window.setTimeout(function() {
				self.filler("list8", "mixfeed", true, false, true);
			},
			1000);
			}else{spinner(false);}
			break;
		case 8:
			// mf
			if(this.loggedin){
			this.restartPageCount("mine");
			this.controller.window.setTimeout(function() {
				self.filler("list7", "mine", true, false, true);
			},
			1000);
			}else{spinner(false);}
			break;
		}
	},
	beginSearch: function() {
		this.controller.get('SearchtextField').mojo.blur();
		this.textFieldFocused = false;
		this.search(1);
	},
	keyupHandler: function(event) {
		if (this.controller.sceneId === "main" && event.target.id.indexOf("username") < 0 && event.target.id.indexOf("password") < 0 && event.target.id.indexOf("Filter") < 0) {
			if (Mojo.Char.isValidWrittenChar(event.keyCode) || Mojo.Char.isDigit(event.keyCode) || Mojo.Char.isEnterKey(event.keyCode)) {
				this.controller.get("scroller8").mojo.setSnapIndex(0, true);
				if (!this.textFieldFocused) {
					if (!Mojo.Char.isEnterKey(event.keyCode)) {
						this.controller.get('SearchtextField').mojo.focus();
						this.controller.get('slider1').mojo.revealTop();
						this.textFieldFocused = true;
					} else {
						this.controller.get('SearchtextField').mojo.focus();
						this.controller.get('slider1').mojo.revealTop();
						this.textFieldFocused = true;
					}
				} else if (this.textFieldFocused && Mojo.Char.isEnterKey(event.keyCode)) {
					this.beginSearch();
				}
			}
		} /*else if (event.target.id.indexOf("LikedFilter") > 0 && Mojo.Char.escape !== event.keyCode) {
			//filter liked list items
			filterterm = this.controller.get('LikedFilter').mojo.getValue();
			if (filterterm === "" && Mojo.Char.isEnterKey(event.keyCode)) {
				this.likeFilterClear();
			} else if (Mojo.Char.isEnterKey(event.keyCode)) {
			//	this.controller.get('LikedFilter').mojo.focus();
				this.likeFilter();
			}
			event.stop();
		}*/
	},
	likeFilter: function() {
		spinner(true);
		this.controller.get('LikedFilter').mojo.focus();
		filterterm = this.controller.get('LikedFilter').mojo.getValue().toLowerCase();
		if (filterterm === "") {
			this.likeFilterClear();
		} else {
			this.listState("liked", "full");
			this.controller.get('LikedFilter').mojo.focus();
			//found = filter(this.controller.get('LikedFilter').mojo.getValue(), this.itemLists.liked);
			splitter = filterterm.split(" ");
			onComplete = function(transport) {
				if (transport.status === 200) {
					f = this.fillGrid(transport.responseJSON.mixes);
					found = filter(filterterm, f.getList().items);
					self = this;
					this.controller.window.setTimeout(function() {
						self.controller.get("list6").mojo.noticeUpdatedItems(0, found);
						self.controller.get("list6").mojo.setLength(found.length);
					},
					500);
					this.controller.window.setTimeout(function() {
						spinner(false);
					},
					500);
				} else {
					showBanner("didn't get 200 from json response");
				}
			};
			onFailure = function(transport) {
				showBanner("search failed");
			};
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&q=" + splitter.join("+") + "&per_page="+this.pageCounts.liked.total*12;
			request(url, onComplete.bind(this), onFailure.bind(this));
		}
	},
	likeFilterClear: function() {
		spinner(true);
		this.listState("liked", "goodtogo");
		this.controller.get('LikedFilter').mojo.setValue("");
		this.controller.get('LikedFilter').mojo.focus();
		//this.controller.get('LikedFilter').mojo.blur();
		self = this;
		this.controller.window.setTimeout(function() {
			self.controller.get("list6").mojo.noticeUpdatedItems(0, self.itemLists.liked);
			self.controller.get("list6").mojo.setLength(self.itemLists.liked.length);
		},
		500);
		this.controller.window.setTimeout(function() {
						spinner(false);
					},
					500);
		this.handleUpdate(
		{
			target:{
			id:"view1-main-slider7"
			},
			value:1
		});
	},
	handleUpdateScroll: function(event) {
		b = event;
	},
	listState: function(list, state) {
		state !== "full" ? this.controller.get(list).removeClassName("done") : this.controller.get(list).addClassName("done");
	},
	search: function(pagecount) {
		spinner(true);
		this.controller.get("scroller8").mojo.setSnapIndex(0, true);
		var onComplete = function(transport) {
			tracks = transport.responseJSON.mixes;
			if (tracks.length === 0) {
				showBanner("no mixes found with that criteria");
				spinner(false);
			}
			f = this.fillSearchList(tracks);
			items = f.getList();
			this.controller.setWidgetModel("list0", items);
			//this.controller.get("list0").mojo.noticeUpdatedItems(0, items);
			//this.controller.get("list0").mojo.setLength(items.length);
			if (tracks.length < 12) {
				this.listState("search", "full");
			} else {
				this.listState("search", "goodtogo");
			}
			spinner(false);
			var self = this;
			this.controller.window.setTimeout(function() {
				self.controller.get("slider1").mojo.scrollTo(0, 0, true, true);
			},
			100);
		};
		var onFailure = function(transport) {
			spinner(false);
			popUp("Oops!", "Search Error", this.controller);
		};
		url = "http://8tracks.com/mixes.json?" + this.searchCriteria + "=" + this.controller.get('SearchtextField').mojo.getValue() + "&page=" + pagecount;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	popupChoose: function(event) {
		if (typeof event !== "undefined") {
			index = -1;
			allow = this.loggedin; //allow span to user lists if logged in
			abort = false;
			this.type = event;
			labelName = "";
			switch (event) {
			case 'featured':
				index = 5;
				labelName = "Featured";
				break;
			case 'l_mixes':
				index = 1;
				labelName = "Latest";
				break;
			case 'p_mixes':
				index = 2;
				labelName = "Popular";
				// popular
				break;
			case 'h_mixes':
				// hot
				index = 3;
				labelName = "Hot";
				break;
			case 'r_mixes':
				// random
				index = 4;
				labelName = "Random";
				break;
			case 'liked':
				index = 6;
				labelName = "Liked";
				break;
			case 'mixfeed':
				index = 7;
				labelName = "Mix Feed";
				break;
			case 'mine':
				index = 8;
				labelName = "My Mixes";
				break;
			}
			if ((event === "liked" && !allow) || (event === "mine" && !allow) || (event === "mixfeed" && !allow)) {
				abort = true;
			}
			if (!abort) {
				if (labelName !== "") {
					this.cmdMenuModel.items[2].items[0].label = labelName;
					this.controller.modelChanged(this.cmdMenuModel, this);
				}
				this.handleUpdate({
					value: index
				});
			} else if (event === "search") {
				this.cmdMenuModel.items[2].items[0].label = labelName;
				this.controller.modelChanged(this.cmdMenuModel, this);
			}
		}
	},
	refreshChoose: function(choice) {
		switch (choice) {
		case 'all':
			this.refresh();
			break;
		case 'current':
			this.refreshCurrent();
			break;
		}
	},
	handleUpdate: function(event) {
		if (typeof event.target === "undefined" || event.target.id === "view1-main-scroller8") {
			this.snapIndex = event.value;
			selected = {
				textColor: "white",
				fontFamily: "Prelude",
				fontSize: "32px",
				opacity: "1"
			};
			unselected = {
				textColor: "grey",
				fontFamily: "Arial",
				fontSize: "30px",
				opacity: "0"
			};
			this.controller.get('scroller13').mojo.setSnapIndex(event.value, true);
			switch (event.value) {
			case 0:
				this.$.searchLabel.style.addStyles(selected);
				this.$.latestLabel.style.addStyles(unselected);
				//this.$.list1.disabled = true;
				this.cmdMenuModel.items[2].items[0].label = "Search";
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 1:
				this.$.searchLabel.style.addStyles(unselected);
				this.$.latestLabel.style.addStyles(selected);
				this.$.popLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Latest"; //Latest
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 2:
				this.$.latestLabel.style.addStyles(unselected);
				this.$.popLabel.style.addStyles(selected);
				this.$.hotLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Popular"; //Popular
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 3:
				this.$.popLabel.style.addStyles(unselected);
				this.$.hotLabel.style.addStyles(selected);
				this.$.randLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Hot"; //Hot
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 4:
				this.$.hotLabel.style.addStyles(unselected);
				this.$.randLabel.style.addStyles(selected);
				this.$.featLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Random"; //Random
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 5:
				this.$.randLabel.style.addStyles(unselected);
				this.$.featLabel.style.addStyles(selected);
				this.$.likedLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Featured"; //Featured
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 6:
				this.$.featLabel.style.addStyles(unselected);
				this.$.likedLabel.style.addStyles(selected);
				this.$.featLabel.style.addStyles(unselected);
				/*this.$.slider7.setScrollPosition({
					top: -120,
					left: 0
				});*/
				this.cmdMenuModel.items[2].items[0].label = "Liked"; //Liked
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 7:
				this.$.likedLabel.style.addStyles(unselected);
				this.$.mixFeedLabel.style.addStyles(selected);
				this.$.myLabel.style.addStyles(unselected);
				this.cmdMenuModel.items[2].items[0].label = "Mix Feed"; //My Mixes
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			case 8:
				this.$.mixFeedLabel.style.addStyles(unselected);
				this.$.myLabel.style.addStyles(selected);
				this.cmdMenuModel.items[2].items[0].label = "My Mixes"; //My Mixes
				this.controller.modelChanged(this.cmdMenuModel, this);
				break;
			}
		} else if (event.target.id === "view1-main-slider7") {
			this.controller.get('LikedFilter').mojo.focus();
			if (event.value === 1) {
				this.controller.get('LikedFilter').mojo.blur();
				this.$.slider7.setScrollPosition({
					top: -120,
					left: 0
				});
				//this.controller.get('SearchtextField').mojo.focus();
			} else if (event.value === 0) {
				this.controller.get('LikedFilter').mojo.focus();
				this.controller.get('SearchtextField').mojo.blur();
			}
		}
	},
	handleUpdate2: function(event) {
		this.controller.get('scroller8').mojo.setSnapIndex(event.value, true);
		//event.stop();
	},
	textFieldPC: function(event) { // on focus lost, property changed event fires
		this.textFieldFocused = false;
	},
	populateUserLists: function(cookie) {
		this.filler("list6", "liked", true, false);
		this.controller.window.setTimeout(this.filler("list7", "mine", true, false), 500);
		this.controller.window.setTimeout(this.filler("list8", "mixfeed", true, false, true), 500);
		//spinner(false);
	},
	filler: function(list, type, grid, append, stopload) {
		var onComplete = function(transport) {
			if (transport.status === 200) {
				if (transport.responseJSON.mixes.length < 12) {
					this.listState(type, "full");
				}else{
					this.listState(type, "goodtogo");
				}
				f = this.fillGrid(transport.responseJSON.mixes);
				if (append) {
					ITEMS = 0;
					newdata = {
						items: 0
					};
					var offset;
					//var top = 0;
					switch (list) {
					case "list1":
						ITEMS = this.$.list1.items;
						offset = this.pageCounts.recent.current;
						break;
					case "list2":
						ITEMS = this.$.list2.items;
						offset = this.pageCounts.popular.current;
						break;
					case "list3":
						ITEMS = this.$.list3.items;
						offset = this.pageCounts.hot.current;
						break;
					case "list4":
						ITEMS = this.$.list4.items;
						offset = this.pageCounts.random.current;
						break;
					case "list5":
						ITEMS = this.$.list5.items;
						offset = this.pageCounts.featured.current;
						break;
					case "list6":
						ITEMS = this.$.list6.items;
						offset = this.pageCounts.liked.current;
						//top=60;
						break;
					case "list7":
						ITEMS = this.$.list7.items;
						offset = this.pageCounts.Mine.current;
						//top=60;
						break;
					case "list8":
						ITEMS = this.$.list8.items;
						offset = this.pageCounts.mixfeed.current;
						//	top=60;
						break;
					}
					for (i = 0; i < 6; i++) {
						if (typeof f.getList().items[i] !== "undefined") {
							ITEMS.push(f.getList().items[i]);
						}
					}
					newdata.items = ITEMS;
					listWidget = this.controller.get(list);
					listWidget.mojo.noticeUpdatedItems((offset - 1) * 6, f.getList().items); // noticeAddedItems
					listWidget.mojo.setLength(newdata.items.length);
					/*index = parseInt(list.substring(list.length-1, list.length),0)+1;
					var slider = "slider" + index;
					var self = this;
					self.controller.get(slider).mojo.scrollTo(0, 0, true, true);*/
					spinner(false);
				} else {
					var showlist;
					getTotalPages = function(total_entries, per_page) {
						if (parseInt(total_entries, 0) < per_page) {
							return 1;
						}
						total = Math.ceil(parseInt(total_entries, 0) / per_page);
						return total;
					};
					var top = 0;
					var slider;
					switch (list) {
					case "list1":
						this.$.list1.items = f.getList().items;
						this.itemLists.latest = f.getList().items;
						showlist = this.itemLists.latest;
						this.pageCounts.recent.total = getTotalPages(transport.responseJSON.total_entries, 12);
						break;
					case "list2":
						this.$.list2.items = f.getList().items;
						this.itemLists.pop = f.getList().items;
						showlist = this.itemLists.pop;
						this.pageCounts.popular.total = getTotalPages(transport.responseJSON.total_entries, 12);
						break;
					case "list3":
						this.$.list3.items = f.getList().items;
						this.itemLists.hot = f.getList().items;
						showlist = this.itemLists.hot;
						this.pageCounts.hot.total = getTotalPages(transport.responseJSON.total_entries, 12);
						break;
					case "list4":
						this.$.list4.items = f.getList().items;
						this.itemLists.random = f.getList().items;
						showlist = this.itemLists.random;
						this.pageCounts.random.total = getTotalPages(transport.responseJSON.total_entries, 12);
						break;
					case "list5":
						this.$.list5.items = f.getList().items;
						this.itemLists.featured = f.getList().items;
						showlist = this.itemLists.featured;
						this.pageCounts.featured.total = getTotalPages(transport.responseJSON.total_entries, 12);
						break;
					case "list6":
						this.$.list6.items = f.getList().items;
						this.itemLists.liked = f.getList().items;
						showlist = this.itemLists.liked;
						this.pageCounts.liked.total = getTotalPages(transport.responseJSON.total_entries, 12);
						slider = this.$.slider7;
						top = -120;
						break;
					case "list7":
						this.$.list7.items = f.getList().items;
						this.itemLists.mine = f.getList().items;
						showlist = this.itemLists.mine;
						this.pageCounts.mine.total = getTotalPages(transport.responseJSON.total_entries, 12);
						slider = this.$.slider8;
						top = 0;
						break;
					case "list8":
						this.$.list8.items = f.getList().items;
						this.itemLists.mixfeed = f.getList().items;
						showlist = this.itemLists.mixfeed;
						this.pageCounts.mixfeed.total = getTotalPages(transport.responseJSON.total_entries, 12);
						slider = this.$.slider9;
						top = 0;
						break;
					}
					this.controller.get(list).mojo.noticeUpdatedItems(0, showlist); //noticeAddedItems
					this.controller.get(list).mojo.setLength(showlist.length);
					index = parseInt(list.substring(list.length - 1, list.length), 0) + 1;
					if (top === 0) {
						slider = "slider" + index;
						this.controller.get(slider).mojo.scrollTo(top, 0, false, true);
					} else {
						slider.setScrollPosition({
							top: top,
							left: 0
						});
						//this.controller.get(slider).mojo.setScrollPosition({top:-60,left:0});
					}
				}
				if (typeof stopload !== "undefined") {
					spinner(false);
				}
			}
		};

		var onFailure = function(transport) {
			showBanner("Error!");
			spinner(false);
		};

		getPageCount = function(Type, pageCounts) {
			switch (Type) {
			case "recent":
				return pageCounts.recent.current;
			case "hot":
				return pageCounts.hot.current;
			case "popular":
				return pageCounts.popular.current;
			case "random":
				return pageCounts.random.current;
			case "featured":
				return pageCounts.featured.current;
			case "liked":
				return pageCounts.liked.current;
			case "mine":
				return pageCounts.mine.current;
			case "mixfeed":
				return pageCounts.mixfeed.current;
			}
		};
		url = "http://8tracks.com/mixes.json?page=" + getPageCount(type, this.pageCounts) + "&sort=" + type + "&per_page=12";
		if (type === "liked") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=liked&page=" + getPageCount(type, this.pageCounts) + "&per_page=12";
		} else if (type === "mine") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?page=" + getPageCount(type, this.pageCounts) + "&per_page=12";
		} else if (type === "featured") {
			url = "http://8tracks.com/mix_sets/featured.json?page=" + getPageCount(type, this.pageCounts) + "&per_page=12";
		} else if (type === "mixfeed") {
			url = "http://8tracks.com/users/" + this.userid + "/mixes.json?view=mix_feed&page=" + getPageCount(type, this.pageCounts) + "&per_page=12";
		}
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	/*								LIST METHODS									*/
	getList: function(list) {
		switch (list.id) {
		case "view1-main-list1-list":
			return this.itemLists.latest;
		case "view1-main-list2-list":
			return this.itemLists.pop;
		case "view1-main-list3-list":
			return this.itemLists.hot;
		case "view1-main-list4-list":
			return this.itemLists.random;
		case "view1-main-list5-list":
			return this.itemLists.featured;
		case "view1-main-list6-list":
			return this.itemLists.liked;
		case "view1-main-list7-list":
			return this.itemLists.mine;
		case "view1-main-list8-list":
			return this.itemLists.mixfeed;
		}
	},
	
	list1Fetchitems: function(inSender, inListElement, inOffset, inCount) {
		// provide list data by calling noticeUpdatedItems as in this example:inListElement.mojo.noticeUpdatedItems(inOffset, /* array of inCount items */)
		this.updateListWithNewItems.delay(0.2, inListElement, inOffset, this.getList(inListElement).slice(inOffset, inOffset + inCount), this.getList(listWidget).length);
		//this.updateListWithNewItems(inListElement, inOffset, this.getList(inListElement).slice(inOffset, inOffset + inCount),this.getList(listWidget).length);
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

	///....................LIKE/UNLIKE...............///
	/*
		TODO: add the ds to remember like state of mixes (something more elegant than
		this.liked!)
	*/
	Like: function() {
		if (this.creds.loggedIn) {
			var onFailure = function(transport) {
				popUp("Error", "Could not add mix to your liked mix. Try to login again", this.controller);
			};

			var postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
			var url = "http://8tracks.com/mixes/" + this.mix.id + "/like.json";
			post(url, postdata, this.LikedComplete.bind(this), onFailure.bind(this));
		} else {
			showBanner("login required to like mixes");
		}
	},
	LikedComplete: function(response) {
		if (response.responseJSON.status === "200 OK") {
			if (typeof response.responseJSON.bypass === "undefined") {
				showBanner("Mixed added to your Liked list");
				this.refreshLiked();
			}
		} else {
			popUp(response.responseJSON.status, response.responseJSON.notices, this.controller);
		}
	},
	UnLike: function() {
		if (this.creds.loggedIn) {
			var onFailure = function(transport) {
				popUp("Error", "Could not remove mix to your liked mix. Try to login again", this.controller);
			};
			var postdata = "login=" + this.creds.username + "&password=" + this.creds.password;
			url = "http://8tracks.com/mixes/" + this.mix.id + "/unlike.json";
			post(url, postdata, this.UnLikedComplete.bind(this), onFailure.bind(this));
		}
	},
	UnLikedComplete: function(response) {
		if (response.responseJSON.status === "200 OK") {
			if (typeof response.responseJSON.bypass === "undefined") {
				showBanner("Mixed removed from your Liked list");
				this.refreshLiked();
			}
		} else {
			popUp(response.responseJSON.status, response.responseJSON.notices, this.controller);
		}
	},
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
	///>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>EVENTS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<///
	userTap: function(event) {
		this.controller.stageController.pushScene("UserInfoScene", this.mix.user);
	},
	userTapFromPlayer: function(user){
		this.controller.stageController.pushScene("UserInfoScene", {login:user});
	},
	latestLabelTap: function(inSender, event) {
	//	this.controller.stageController.pushScene('user', this.mix.user);
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
			this.showSpinner(false);
			popUp("Oops", "failed to get play_token", this.controller);
		};
		url = "http://8tracks.com/sets/new.json";
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
				this.cmdMenuModel.visible = true;
				this.controller.modelChanged(this.cmdMenuModel, this);
				launch8tracksPlayer(this.mix, this.token, transport, this.setid, this.creds, this.liked);
				}
		};
		var onFailure = function(transport) {
			spinner(false);
			popUp(transport.responseJSON.status, transport.responseJSON.notices[0], this.controller);
		};
		$('overlayMain2').style.top = "481px";
		//$('overlayMain2').style.bottom= "0px";
		url = "http://8tracks.com/sets/" + this.token + "/play.json?mix_id=" + this.mix.id;
		request(url, onComplete.bind(this), onFailure.bind(this));
	},
	likeTap: function(event) {
		$("like").className.indexOf("unlike") < 0 ? $("like").addClassName("unlikeIcon") : $("like").removeClassName("unlikeIcon");
		if(this.loggedin){
			$("like").className.indexOf("unlike") < 0 ? this.UnLike() : this.Like();
		}
	},
	searchFromPlayer: function(searchtag) {
		this.pageCounts.search.current = 1;
		this.searchCriteria = "tag";
		this.controller.get("SearchtextField").mojo.setValue(searchtag);
		this.setupSearchCriteria();
		this.cmdMenuModel.visible = true;
		this.controller.modelChanged(this.cmdMenuModel, this);
		var self = this;
		this.controller.window.setTimeout(function() {
			self.beginSearch();
		},
		1000);
		//this.beginSearch();
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
	},
	handleListTap: function(event) {
		searchTag = event.originalEvent.target.innerText;
		if (searchTag !== "") {
			$('overlayMain2').style.top = "481px";
			//$('overlayMain2').style.bottom= "0px";
			this.searchCriteria = "tag";
			this.pageCounts.search.current = 1;
			//this.controller.get("SearchtextField").mojo.focus();
			if (!this.textFieldFocused) {
				//this.controller.get("SearchtextField").mojo.focus();
				this.textFieldFocused = true;
			}
			this.controller.get("SearchtextField").mojo.setValue(searchTag);
			if (this.snapIndex === 0) {
				this.controller.get('slider1').mojo.revealTop();
				this.controller.get('scroller8').mojo.revealTop();
			}
			this.setupSearchCriteria();
			this.cmdMenuModel.visible = true;
			this.controller.modelChanged(this.cmdMenuModel, this);
			this.beginSearch();
		}
	},
	Listtap: function(inSender, event) {
		var mix;
		this.textFieldFocused = false;
		this.controller.get("scroller8").mojo.setSnapIndex(this.snapIndex, true);
		if (event.originalEvent.target.id === "mix1") {
			mix = event.item.mixInfo1;
			tags = mix.tag_list_cache;
			this.mix = mix;
			showMixDetails(mix);
			this.cmdMenuModel.visible = false;
			this.controller.modelChanged(this.cmdMenuModel, this);
			this.controller.setWidgetModel('taglist', this.fillTagGrid(tags.split(",")).getList());
		} else if (event.originalEvent.target.id === "mix2") {
			mix = event.item.mixInfo2;
			if (typeof mix !== "undefined") {
				this.mix = mix;
				showMixDetails(mix);
				tags = mix.tag_list_cache;
				this.cmdMenuModel.visible = false;
				this.controller.modelChanged(this.cmdMenuModel, this);
				this.controller.setWidgetModel('taglist', this.fillTagGrid(tags.split(",")).getList());
			}
		}
	},
	searchListTap: function(inSender, event) {
		tags = event.item.mixInfo.tag_list_cache;
		this.controller.setWidgetModel('taglist', this.fillTagGrid(tags.split(",")).getList());
		showMixDetails(event.item.mixInfo);
		this.mix = event.item.mixInfo;
		this.cmdMenuModel.visible = false;
		this.controller.modelChanged(this.cmdMenuModel, this);
	},
	moreLatestHtmlTap: function(inSender, event) {
		if (event.target.className.indexOf("done") < 0) {
			spinner(true);
			var pc;
			var fill = function(list, type, current, max) {
				if (current < max) {
					this.filler(list, type, true, true);
				} else if (current === max) {
					this.filler(list, type, true, true);
					this.listState(lookup(list).name, "full");
				}
			}.bind(this);
			switch (event.target.id) {
			case "recent":
				this.pageCounts.recent.current += 1;
				pc = this.pageCounts.recent;
				fill("list1", "recent", pc.current, pc.max);
				break;
			case "hot":
				this.pageCounts.hot.current += 1;
				pc = this.pageCounts.hot;
				fill("list3", "hot", pc.current, pc.max);
				break;
			case "popular":
				this.pageCounts.popular.current += 1;
				pc = this.pageCounts.popular;
				fill("list2", "popular", pc.current, pc.max);
				break;
			case "random":
				this.pageCounts.random.current += 1;
				pc = this.pageCounts.random;
				fill("list4", "random", pc.current, pc.max);
				break;
			case "featured":
				this.pageCounts.featured.current += 1;
				pc = this.pageCounts.featured;
				fill("list5", "featured", pc.current, pc.max);
				break;
			case "liked":
				this.pageCounts.liked.current += 1;
				pc = this.pageCounts.liked;
				fill("list6", "liked", pc.current, pc.max);
				break;
			case "mine":
				this.pageCounts.mine.current += 1;
				pc = this.pageCounts.mine;
				fill("list7", "mine", pc.current, pc.max);
				break;
			case "mixfeed":
				this.pageCounts.mixfeed.current += 1;
				pc = this.pageCounts.mixfeed;
				fill("list8", "mixfeed", pc.current, pc.max);
				break;
			case "search":
				this.pageCounts.search.current += 1;
				this.search(this.pageCounts.search.current);
				break;
			default:
				spinner(false);
				break;
			}
		}
	},
	tellPlayer: function(){
					tell = function() {
					var parameters = {
						id: 'com.gmturbo.8tracks',
						params: {
							launchScene: 'realPlayer',
							refresh: true
						}
					};
					return new Mojo.Service.Request('palm://com.palm.applicationManager', {
						method: 'open',
						parameters: parameters
					});
				};
				tell();
	},
	login: function(username, password) {
		spinner(true);
		var onComplete = function(transport) {
			if (transport.responseJSON.status === "200 OK") {
				cookie = new Mojo.Model.Cookie("credentials");
				cookie.put({
					username: username,
					password: password,
					token: transport.responseJSON.auth_token,
					userid: transport.responseJSON.current_user.id,
					avatar: transport.responseJSON.current_user.avatar_urls.sq56
				});
				this.userid = transport.responseJSON.current_user.id;
				this.loggedin = true;
				showBanner("You are now logged in as " + username);
				this.appMenuModel.items[0].label = "Logout " + username;
				this.appMenuModel.items[0].command = "logout";
				this.controller.modelChanged(this.appMenuModel, this);
				this.populateUserLists(cookie);
				this.creds = checkForCredentials();
				this.tellPlayer();
				spinner(false);
			} else {
				popUp(tranport.responseJSON.status, transport.responseJSON.statusText, this.controller);
			}
		};
		var onFailure = function(transport) {
			popUp(tranport.responseJSON.status, transport.responseJSON.statusText, this.controller);
		};
		loginTo8tracks(username, password, onComplete.bind(this), onFailure.bind(this));
	},
	setupSearchCriteria: function() {
		switch (this.searchCriteria) {
		case 'q':
			//all
			this.searchSelectionTap(null, {
				target: {
					id: "all"
				}
			});
			break;
		case 'user':
			this.searchSelectionTap(null, {
				target: {
					id: "user"
				}
			});
			break;
		case 'tag':
			//type
			this.searchSelectionTap(null, {
				target: {
					id: "genre"
				}
			});
			break;
		}
	},
	searchSelectionTap: function(inSender, event) {
		this.controller.get("scroller8").mojo.setSnapIndex(this.snapIndex, true);
		if (typeof event.target.id !== "undefined") {
			switch (event.target.id) {
			case "genre":
				$('genre').addClassName("selected");
				$('user').removeClassName("selected");
				$('all').removeClassName("selected");
				this.searchCriteria = "tag";
				break;
			case "user":
				$('genre').removeClassName("selected");
				$('user').addClassName("selected");
				$('all').removeClassName("selected");
				this.searchCriteria = "user";
				break;
			case "all":
				$('genre').removeClassName("selected");
				$('user').removeClassName("selected");
				$('all').addClassName("selected");
				this.searchCriteria = "q";
				break;
			case "search":
				this.moreLatestHtmlTap("yo", event);
				break;
			}
		}
	}
};

MainAssistant.prototype.handleCommand = function(event) {
	this.controller = Mojo.Controller.stageController.activeScene();
	var resetCheck = function(command) {
		for (i = 0; i < this.appMenuModel.items[2].items.length; i++) {
			if (this.appMenuModel.items[2].items[i].command == command) {
				this.appMenuModel.items[2].items[i].iconPath = Mojo.appPath + "/images/check_mark.png";
			} else {
				this.appMenuModel.items[2].items[i].iconPath = "none";
			}
		}
	}.bind(this);

	var resetDefaultMix = function(command) {
		for (i = 0; i < this.appMenuModel.items[2].items.length; i++) {
			if (this.appMenuModel.items[2].items[i].command == command) {
				this.appMenuModel.items[2].items[i].iconPath = Mojo.appPath + "/images/check_mark.png";
			} else {
				this.appMenuModel.items[2].items[i].iconPath = "none";
			}
		}
	}.bind(this);

	if (is_int(event.command)) {
		switch (event.command.toString()) {
		case "0":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "1":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "2":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "3":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "4":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "5":
			cookie3 = new Mojo.Model.Cookie("defaultMix");
			cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case "6":
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		case 'defmix:fol':
			this.cookie3 = new Mojo.Model.Cookie("defaultMix");
			this.cookie3.put({
				defaultMix: event.command
			});
			resetDefaultMix(event.command);
			break;
		}
	} else if (event.type == Mojo.Event.command) {
		switch (event.command) {
		case 'search':
			//this.controller.stageController.pushScene('searchScrene');
			break;
		case 'login':
			this.controller.showDialog({
				template: 'dialogs/username-password-dialog',
				assistant: new SampleDialogAssistant(this, this.login.bind(this))
			});
			break;
		case 'logout':
			showBanner("You have logged out");
			logout();
			this.loggedin = false;
			this.appMenuModel.items[0].command = "login";
			this.appMenuModel.items[0].label = "Login";
			this.controller.modelChanged(this.appMenuModel, this);
			listModel = {
				items: []
			};
		//this.controller.get("list6").mojo.invalidateItems();
			this.controller.setWidgetModel("list6", listModel);
			//this.controller.get("list7").mojo.invalidateItems();
			this.controller.setWidgetModel("list8", listModel);
			//this.controller.get("list8").mojo.invalidateItems();
			this.controller.setWidgetModel("list8", listModel);
			this.itemLists.liked = [];
			this.itemLists.mixfeed = [];
			this.itemLists.mine = [];
			this.pageCounts.liked = {
				current: 1,
				total: 1,
				max: 4
			};
			this.pageCounts.mixfeed = {
				current: 1,
				total: 1,
				max: 4
			};
			this.pageCounts.mine = {
				current: 1,
				total: 1,
				max: 4
			};
			//cookie3 = new Mojo.Model.Cookie("defaultMix");
			//cookie3.put({
			//	defaultMix: 0
			//});
			//resetDefaultMix(0);
			this.tellPlayer();
			break;
		case 'support':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "8tracks V2 Support Request: v" + Mojo.Controller.appInfo.version,
						recipients: [{
							type: "email",
							role: 1,
							value: "GTestaSoftware@gmail.com",
							contactDisplay: "8tracks Support"
						}]
					}
				}
			});
			break;
		case 'type':
			this.controller.popupSubmenu({
				onChoose: this.popupChoose,
				placeNear: event.originalEvent.target,
				items: [
					{
					label: 'Featured',
					command: 'featured'
				},
					{
					label: 'Latest',
					command: 'l_mixes'
				},
					{
					label: 'Popular',
					command: 'p_mixes'
				},
					{
					label: 'Hot',
					command: 'h_mixes'
				},
					{
					label: 'Random',
					command: 'r_mixes'
				},
					{
					label: 'Liked',
					command: 'liked',
					disabled: !this.loggedin
				},
					{
					label: 'Mix Feed',
					command: 'mixfeed',
					disabled: !this.loggedin
				},
					{
					label: 'My Mixes',
					command: 'mine',
					disabled: !this.loggedin
				}]
			});
			break;
		case 'cmd-refresh':
			//this.refresh();
			this.controller.popupSubmenu({
				onChoose: this.refreshChoose,
				placeNear: event.originalEvent.target,
				items: [
					{
					label: 'Current Mix Set',
					command: 'current'
				},
					{
					label: 'All Mixes',
					command: 'all'
				}]
			});
			break;
		}
	} else if (event.type === Mojo.Event.back) {
		event.stop();
		$('overlayMain2').style.top = "481px";
		//$('overlayMain2').style.bottom= "0px";
		this.cmdMenuModel.visible = true;
		this.controller.modelChanged(this.cmdMenuModel, this);
	} else if (event.type === Mojo.Event.forward) {
		event.stop();
		//this.MixChange(1);
	}
};
var SampleDialogAssistant = Class.create({

	initialize: function(sceneAssistant, loginFunc) {
		this.sceneAssistant = sceneAssistant;
		this.handler = loginFunc;
		this.controller = sceneAssistant.controller;
		this.controller.setupWidget('username', this.usernameAttributes, "");
		this.controller.setupWidget('password', this.passwordAttributes, "");
	},

	setup: function(widget) {
		this.widget = widget;
		this.controller.get('thanksButton').addEventListener(Mojo.Event.tap, this.handleThanks.bindAsEventListener(this));
		this.controller.get('cancel_button').addEventListener(Mojo.Event.tap, this.handleCancel.bindAsEventListener(this));
	},
	usernameAttributes: {
		textReplacement: false,
		maxLength: 64,
		focus: true,
		acceptBack: true,
		hintText: 'enter username...',
		changeOnKeyPress: true
	},
	passwordAttributes: {
		textReplacement: false,
		maxLength: 64,
		focus: false,
		acceptBack: true,
		hintText: 'enter password...',
		changeOnKeyPress: true
	},
	handleThanks: function() {
		this.handler(this.controller.get("username").mojo.getValue(), this.controller.get("password").mojo.getValue());
		this.widget.mojo.close();
		//	this.handler(this.controller.get('			username ').getValue(),this.controller.get('			password ').getValue());
	},
	handleCancel: function() {
		this.widget.mojo.close();
	}
});
function popUp(title, message, controller) {
	controller.showAlertDialog({
		title: title,
		message: message,
		choices: [
			{
			label: "OK",
			value: "",
			type: 'dismiss'
		}
			]
	});
}

function filter(search, items) {
	/*	list[i] = {
				mixName1: name1,
				mixName2: name2,
				leftImage: tracks[2 * i].cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[2 * i].cover_urls.sq100,
				rightImage: tracks[2 * i + 1].cover_urls.sq100.toString() === "/images/mix_covers/sq100.gif" ? Mojo.appPath + "/images/no_image.png" : tracks[2 * i + 1].cover_urls.sq100,
				mixInfo1: tracks[2 * i],
				mixInfo2: tracks[2 * i + 1]
			};
	*/
	term = search.toLowerCase();
	mixes = [];
	filteredlist = [];
	for (i = 0; i < items.length; i++) {
		tags1 = items[i].mixInfo1.tag_list_cache;
		if (items[i].mixName1.toLowerCase().indexOf(term) !== -1 || tags1.toLowerCase().indexOf(term) !== -1 || items[i].mixInfo1.description.toLowerCase().indexOf(term) !== -1) {
			mixes.push({
				mixname: items[i].mixName1,
				image: items[i].leftImage,
				mixInfo: items[i].mixInfo1
			});
		}
		if (items[i].mixInfo2 != null) {
			tags2 = items[i].mixInfo2.tag_list_cache;
			if (items[i].mixName2.toLowerCase().indexOf(term) !== -1 || tags2.toLowerCase().indexOf(term) !== -1 || items[i].mixInfo2.description.toLowerCase().indexOf(term) !== -1) {
				mixes.push({
					mixname: items[i].mixName2,
					image: items[i].rightImage,
					mixInfo: items[i].mixInfo2
				});
			}
		}
	}

	count = Math.floor(mixes.length / 2);
	residual = mixes.length % 2;

	for (i = 0; i < count; i++) {
		filteredlist.push({
			mixName1: mixes[2 * i].mixname,
			mixName2: mixes[2 * i + 1].mixname,
			leftImage: mixes[2 * i].image,
			rightImage: mixes[2 * i + 1].image,
			mixInfo1: mixes[2 * i].mixInfo,
			mixInfo2: mixes[2 * i + 1].mixInfo
		});
	}
	if (residual === 1) {
		filteredlist.push({
			mixName1: mixes[mixes.length - 1].mixname,
			mixName2: "empty",
			leftImage: mixes[mixes.length - 1].image,
			rightImage: Mojo.appPath + "/images/no_image.png",
			mixInfo1: mixes[mixes.length - 1].mixInfo,
			mixInfo2: null
		});
	}
	return filteredlist;
}

function lookup(query) {
	SLIDERS = {
		"0": {
			name: "search",
			list: "list0",
			index: 0
		},
		"1": {
			name: "recent",
			list: "list1",
			index: 1
		},
		"2": {
			name: "hot",
			list: "list3",
			index: 3
		},
		"3": {
			name: "random",
			list: "list4",
			index: 4
		},
		"4": {
			name: "popular",
			list: "list2",
			index: 2
		},
		"5": {
			name: "featured",
			list: "list5",
			index: 5
		},
		"6": {
			name: "liked",
			list: "list6",
			index: 6
		},
		"7": {
			name: "mixfeed",
			list: "list8",
			index: 7
		},
		"8": {
			name: "mine",
			list: "list7",
			index: 8
		},
		length: 9
	};
	for (i = 0; i < SLIDERS.length; i++) {
		if (SLIDERS[i].name === query || SLIDERS[i].list === query) {
			return SLIDERS[i];
		}
	}
	return "NOT FOUND";
}

function spinner(state) {
	if (state) {
		$('overlayImg').addClassName("loading");
		$('overlayMain').style.top = "225px"; //105 for circular loader
	} else {
		$('overlayMain').style.top = "481px";
	}
}

function showMixDetails(mix) {
	mix.liked_by_current_user ? $("like").addClassName("unlikeIcon") : $("like").removeClassName("unlikeIcon");
	$('mixText').update(mix.description); //mixText
	$('userInfo').update(mix.user.login); //mixText
	$('overlayMain2').style.top = "52px";
	//$('overlayMain2').style.bottom= "150px";
}

function showBanner(message) {
	Mojo.Controller.getAppController().showBanner(message, {
		source: 'notification'
	});
}

function loginTo8tracks(username, password, onComplete, onFailure) {
	url = "http://8tracks.com/sessions.json";
	var postdata = "login=" + username + "&password=" + password;

	var myAjax = new Ajax.Request(url, {
		method: "post",
		parameters: postdata,
		onComplete: onComplete,
		onFailure: onFailure
	});
}

function checkForCredentials() {
	cookie = new Mojo.Model.Cookie("credentials");
	login = "";
	pw = "";
	id = 0;
	avatar = null;
	uf = false;
	pf = false;
	idf = false;
	if (cookie.get()) {
		if (typeof cookie.get().username !== "undefined") {
			login = cookie.get().username;
			uf = true;
		}
		if (typeof cookie.get().password !== "undefined") {
			pw = cookie.get().password;
			pf = true;
		}
		if (typeof cookie.get().userid !== "undefined") {
			id = cookie.get().userid;
			idf = true;
		}
		if (typeof cookie.get().avatar !== "undefined") {
			avatar = cookie.get().avatar;
		}
	}
	return {
		loggedIn: uf & pf & idf,
		username: login,
		password: pw,
		userid: id,
		avatar: avatar
	};
}

function logout() {
	cookie = new Mojo.Model.Cookie("credentials");
	cookie.put({
		username: undefined,
		password: undefined,
		id: undefined
	});
}
function request(url, onComplete, onFailure) {
	var myAjax = new Ajax.Request(url, {
		method: "get",
		evalJSON: 'force',
		contentType: 'application/x-www-form-urlencoded',
		requestHeaders: {
			"USER_AGENT": navigator.userAgent
		},
		onComplete: onComplete,
		onFailure: onFailure
	});
}

function post(url, postdata, onComplete, onFailure, postbody) {
	if(typeof postbody==="undefined"){
	var myAjax = new Ajax.Request(url, {
		method: "post",
		requestHeader: postdata,
		onComplete: onComplete,
		onFailure: onFailure
	});
	}else{
	var myAjax = new Ajax.Request(url, {
		method: "post",
		requestHeader: postdata,
		postBody: postbody,
		onComplete: onComplete,
		onFailure: onFailure
	});
	}
}



function getDefaultMix() {
	cookie = new Mojo.Model.Cookie("defaultMix"); //index of scroller
	defmix = 0;
	if (cookie.get()) {
		if (typeof cookie.get().defaultMix !== "undefined") {
			defmix = cookie.get().defaultMix;
		}
	}
	return defmix;
}

///CHECK FOR INTEGER

function is_int(value) {
	if ((parseFloat(value) == parseInt(value, 0)) && !isNaN(value)) {
		return true;
	} else {
		return false;
	}
}

////// SHRINK TEXT 
shrinkText = function(text, length) {
	return text;
	if (length === -1) return text;
	if (text.length > length) {
		text = text.substring(0, length);
		text += "...";
	}
	return text;
};
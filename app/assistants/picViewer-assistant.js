function PicViewerAssistant(argFromPusher) {
	this.pic = argFromPusher.original;
}

PicViewerAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		this.controller.get("photoviewer").mojo.centerUrlProvided(this.pic);
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
	},
	download: function(forward) {
		downloadImage = function(url, onSuccess, onFailure) {
			if (typeof this.downloaded === "undefined") {
				split = url.split("/");
				name = split[split.length - 1];
				name = name.split(".")[0] + "." + name.split(".")[2];
				this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
					method: 'download',
					parameters: {
						target: url,
						targetDir: "/media/internal/files/8tracks",
						targetFilename: name,
						keepFilenameOnRedirect: false,
						subscribe: false
					},
					onComplete: onSuccess,
					onFailure: onFailure
				});
				this.downloaded = true;
			}
		}.bind(this);
		var onSuccess;
		if (forward) {
			onSuccess = forward.bind(this);
		} else {
			onSuccess = function(event) {
				this.url = event.target;
			};
			showBanner("Image saved to device");
		}
		onFailure = function() {
			showBanner("Download Failed");
		};
		downloadImage(this.pic, onSuccess.bind(this), onFailure.bind(this));
	},
	email: function(response) {
		this.url = response.target;
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
				id: 'com.palm.app.email',
				params: {
					summary: 'Checkout this image',
					text: 'checkout this image I found on 8tracks',
					attachments: [{
						fullPath: response.target
					}]
				}
			}
		});
	},
	wallpaper: function(response) {
		this.url = response.target;
		var onSuccess = function(resp) {
			func = function(response){
			var onFailure = function(reason){
				showBanner(reason);
			}.bind(this);
			this.controller.serviceRequest('palm://com.palm.systemservice', {
				method: "setPreferences",
				parameters: {
					"wallpaper": response.wallpaper
				},
				onComplete: showBanner("successfully set"),
				onFailure: onFailure
			});
			}.bind(this);
			
			showBanner("Formatting image...");
			func.delay(5.0,resp);
			
		}.bind(this);
		
		this.controller.serviceRequest('palm://com.palm.systemservice/wallpaper', {
			method: "importWallpaper",
			parameters: {
				"target": response.target
			},
			onSuccess: onSuccess.bind(this)
			//onFailure: showBanner("Error setting wallpaper")
		});
	},
	text: function(response) {
		this.url = response.target;
		var sendText = function(pic, onSuccess, onFailure) {
			this.controller.serviceRequest('palm://com.palm.applicationManager', {
				method: 'launch',
				parameters: {
					id: 'com.palm.app.messaging',
					params: {
						//messageText: 'Text of the message.',
						attachment: pic
					}
				},
				onComplete: onSuccess,
				onFailure: onFailure
			});
		}.bind(this);
		onSuccess = function() {
			Mojo.Log.info("text set successfully");
		};
		onFailure = function() {
			showBanner("Text Failed");
		};
		split = response.target.split("/");
		name = split[split.length - 1];
		if(name.split(".")[1] === "jpg" || name.split(".")[1] === "jpeg"){
			sendText(response.target, onSuccess.bind(this), onFailure.bind(this));
		}else{
			showBanner("only jpegs can be texted (this is a " + name.split(".")[1] + ")");
		}
	},
	popupChoose: function(selection) {
		switch (selection) {
		case 'wallpaper':
			if (typeof this.url === "undefined") {
				this.download(this.wallpaper);
			} else {
				this.wallpaper({
					target: this.url
				});
			}
			break;
		case 'email':
			if (typeof this.url === "undefined") {
				this.download(this.email);
			} else {
				this.email({
					target: this.url
				});
			}
			break;
		case 'text':
			if (typeof this.url === "undefined") {
				this.download(this.text);
			} else {
				this.text({
					target: this.url
				});
			}
			break;
		case 'save':
			this.download(null);
			break;
		}
	},
	picture1Tap: function(inSender, event) {
		this.controller.popupSubmenu({
			onChoose: this.popupChoose,
			placeNear: event.target,
			items: [
				{
				label: 'Share',
				items: [
					{
					label: "via Email",
					command: 'email'
				},
					{
					label: "via Text",
					command: 'text'
				}
					]
			},
				{
				label: 'Set as Wallpaper',
				command: 'wallpaper'
			},
				{
				label: "Save",
				command: 'save'
			}]
		});
	}
};

PicViewerAssistant.prototype.handleCommand = function(event) {
	if (event.type === Mojo.Event.back) {
		info = {
			scene: picViewer
		};
		this.controller.stageController.popScene(info);
		event.stop();
	}
};
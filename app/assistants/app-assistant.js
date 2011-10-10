function AppAssistant() {}

AppAssistant.prototype.setup = function() {
	this.loadFirstSceneHandler = this.loadFirstScene.bind(this);
	this.loadDashboardHandler = this.loadDashboard.bind(this);
	this.loadPlayerHandler = this.loadPlayer.bind(this);
};

AppAssistant.prototype.cleanup = function() {};

AppAssistant.prototype.onDeactivateHandler = function(event) {
	if (DashPlayerInstance !== 0) {
		if (DashPlayerInstance.audio() !== 0) {
			var dashboardController = this.controller.getStageController("dashboard");
			if (!dashboardController) {
				this.controller.createStageWithCallback({
					name: "dashboard",
					lightweight: true,
					clickableWhenLocked: true
				},
				this.loadDashboardHandler, 'dashboard');
			}
		}
	}
};

AppAssistant.prototype.onActivateHandler = function(event) {
	var dashboardController = this.controller.getStageController("dashboard");
	if (dashboardController) {
		this.appController = Mojo.Controller.getAppController();
		this.appController.closeStage("dashboard");
	}
};

AppAssistant.prototype.loadFirstScene = function(stageController) {
	stageController.pushScene("main");
};

AppAssistant.prototype.loadDashboard = function(stageController) {
	stageController.pushScene("dashboard", DashPlayerInstance);
};
AppAssistant.prototype.loadPlayer = function(stageController) {
	params = this.params;
	stageController.pushScene("realPlayer", params.mixInfo, params.token, params.response, params.creds, params.liked);
};

AppAssistant.prototype.handleLaunch = function(launchParams) {
	if (launchParams.query) {
		justTypeInstance = new justType();
		justTypeInstance.setup("query", launchParams.query.split("%20"));
	} else if (launchParams.Play) {
		justTypeInstance = new justType();
		justTypeInstance.setup("play", launchParams.Play.split("%20"));
	} else if (launchParams.focus) {
		playerController = this.controller.getStageController("realPlayer");
		if (playerController) {
			playerController.activate();
		}
	} else if (typeof launchParams.launchScene !== "undefined") {
		if (launchParams.launchScene === 'realPlayer') {
			playerController = this.controller.getStageController("realPlayer");
			if (playerController) { // realplayer open?
				if (typeof launchParams.refresh === "undefined") {
					this.appController = Mojo.Controller.getAppController();
					this.appController.closeStage("realPlayer");
					dashController = this.controller.getStageController("dashboard");
					if (dashController) {
						this.appController = Mojo.Controller.getAppController();
						this.appController.closeStage("dashboard");
					}
					this.params = launchParams;
					this.controller.createStageWithCallback({
						name: "realPlayer"
					},
					this.loadPlayerHandler, 'card');
				} else if (launchParams.refresh) {
					playerController.delegateToSceneAssistant("loginFromMain");
				}
			} else if(typeof launchParams.refresh === "undefined") {
				this.params = launchParams;
				this.controller.createStageWithCallback({
					name: "realPlayer"
				},
				this.loadPlayerHandler, 'card');
			}
		} else if (launchParams.launchScene === 'main') {
			mainStage = this.controller.getStageController("");
			if (mainStage && launchParams.refresh) {
				mainStage.delegateToSceneAssistant("refreshLiked");
			} else if (mainStage && !launchParams.refresh && typeof launchParams.searchterm !== "undefined") {
				mainStage.activate();
				mainStage.delegateToSceneAssistant("searchFromPlayer", launchParams.searchterm);
			} else if (mainStage && !launchParams.refresh && typeof launchParams.closeDash !== "undefined") {
				mainStage.delegateToSceneAssistant("closeDash");
			}
		} else if(launchParams.launchScene === 'UserInfoScene'){
			mainStage = this.controller.getStageController("");
			if(mainStage){
				mainStage.activate();
				mainStage.delegateToSceneAssistant("userTapFromPlayer", launchParams.user);
				mainStage.delegateToSceneAssistant("loadProfileFromPlayer", launchParams.user);
			}
		}
	}
};


AppAssistant.prototype.onFocusHandler = function() {
	this.lostFocus = false;
};

AppAssistant.prototype.onBlurHandler = function() {
	this.lostFocus = true;
};
opus.Gizmo({
	name: "picViewer",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2
	},
	chrome: [
		{
			name: "photoviewer",
			onhold: "picture1Tap",
			type: "Palm.Mojo.ImageView",
			l: 0,
			t: 0,
			styles: {
				bgColor: "rgb(0,0,0)"
			}
		}
	]
});
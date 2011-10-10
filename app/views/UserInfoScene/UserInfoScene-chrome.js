opus.Gizmo({
	name: "UserInfoScene",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: ""
	},
	chrome: [
		{
			name: "headerScroller",
			layoutKind: "hbox",
			mode: "horizontal",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 0,
			h: "50",
			styles: {
				cursor: "move",
				overflow: "hidden",
				bgImage: "images/8tracks_blue1.jpg"
			},
			controls: [
				{
					name: "label1",
					label: "Profile",
					type: "Palm.Mojo.Label",
					l: 0,
					t: "20",
					h: "100%",
					styles: {
						italic: true,
						textAlign: "left",
						textColor: "white",
						fontSize: "26px",
						fontFamily: "prelude"
					}
				}
			]
		},
		{
			name: "scroller3",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "InfoSlider,CreatedSlider,LikedSlider",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 0,
			h: "100%",
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "InfoSlider",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 319,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgImage: "images/white.png",
						bgColor: ""
					},
					controls: [
						{
							name: "html1",
							ontap: "html1Tap",
							templateFile: "templates/UserInfo/UserInfoDetails",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 0,
							h: "100%"
						}
					]
				},
				{
					name: "CreatedSlider",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgColor: "",
						bgImage: "images/white.png"
					},
					controls: [
						{
							name: "list1",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "<div class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"delayed\" style=\"padding:1pt;\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <creator=\"creator\">\n    <timeSince=\"timeSince\">\n    <table style=\"padding:1pt;\" class=\"falling\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\"></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\" style=\"font-family:Tahoma;font-size:13pt;\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag}&nbsp;<i>#{creator}</i></dt>\n        <dt id=\"time\"> #{timeSince} </dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
							onlisttap: "list1Listtap",
							onfetchitems: "list1Fetchitems",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						}
					]
				},
				{
					name: "LikedSlider",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 0,
					w: "320",
					t: 0,
					h: "100%",
					styles: {
						cursor: "move",
						overflow: "hidden",
						bgColor: "green",
						bgImage: "images/white.png"
					},
					controls: [
						{
							name: "list2",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "<div class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"delayed\" style=\"padding:1pt;\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <creator=\"creator\">\n    <timeSince=\"timeSince\">\n    <table style=\"padding:1pt;\" class=\"falling\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\"></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\" style=\"font-family:Tahoma;font-size:13pt;\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag}&nbsp;<i>#{creator}</i></dt>\n        <dt id=\"time\"> #{timeSince} </dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
							onlisttap: "list1Listtap",
							onfetchitems: "list2Fetchitems",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						}
					]
				}
			]
		},
		{
			name: "html2",
			ontap: "html2Tap",
			templateFile: "templates/UserInfo/UserInfoBottomBar",
			type: "Palm.Mojo.Html",
			l: 0,
			t: 0,
			h: "75",
			styles: {
				bgImage: "images/8tracks_blue1.jpg"
			}
		}
	]
});
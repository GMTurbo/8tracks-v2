opus.Gizmo({
	name: "realPlayer",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	t: "0",
	h: "100%",
	styles: {
		zIndex: 2,
		bgImage: "images/grad4pt5.png"
	},
	components: [
		{
			name: "stream1",
			type: "Palm.Mojo.Audio"
		}
	],
	chrome: [
		{
			name: "scroller1",
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
					name: "html1",
					ontap: "html1Tap",
					templateFile: "templates/playerTemplate",
					type: "Palm.Mojo.Html",
					l: 0,
					r: 0,
					w: "320",
					t: 49,
					b: 403,
					h: "0"
				},
				{
					name: "scroller2",
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
							type: "Palm.Mojo.Label",
							l: 0,
							t: 0,
							styles: {
								textColor: "white",
								fontSize: "26px",
								fontFamily: "Prelude",
								oneLine: true
							}
						}
					]
				},
				{
					name: "bodyScroller",
					layoutKind: "hbox",
					mode: "horizontal-snap",
					snapElements: "scroller3,scroller7",
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
						overflow: "hidden",
						bgImage: "images/white.png"
					},
					controls: [
						{
							name: "scroller3",
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
								bgImage: ""
							},
							controls: [
								{
									name: "picture1",
									plane: "100",
									ontap: "picture1Tap",
									className: "testImage",
									type: "Palm.Picture",
									l: 0,
									w: "100",
									t: 0,
									h: "100",
									styles: {
										opacity: "1"
									}
								},
								{
									name: "label2",
									label: "",
									type: "Palm.Mojo.Label",
									l: 0,
									t: 100,
									h: "10"
								},
								{
									name: "scroller4",
									scrollPosition: {
										left: 0,
										top: 0
									},
									type: "Palm.Mojo.Scroller",
									l: 0,
									t: 110,
									h: "73%",
									styles: {
										cursor: "move",
										overflow: "hidden"
									},
									controls: [
										{
											name: "list2",
											plane: "10",
											dropTarget: true,
											items: [
												{
													item: 0,
													label: "Zero",
													value: "0"
												},
												{
													item: 1,
													label: "One",
													value: "1"
												},
												{
													item: 2,
													label: "Two",
													value: "2"
												},
												{
													item: 3,
													label: "Three",
													value: "3"
												}
											],
											useSampleData: false,
											title: undefined,
											itemHtml: "<!--class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"delayed\"--> \n<div class=\"entryclass\" id=\"entry\" style=\"padding:1pt\"> \n<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/list.css\">\n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <duration=\"duration\">\n    <currentsong=\"song\">\n    <oldsong=\"song\">\n    <skipped=\"skipped\">\n    <currentartist=\"tag\">\n    <!--<div class=\"itemOverlay\" id=\"itemoverlay\">\n       <div>\n       <img id=\"itemoverlaylike\" class=\"iol\" src=\"../images/blank.png\"/>\n       <img id=\"itemoverlaybuy\" class=\"iob\" src=\"../images/blank.png\"/>    \n       <img id=\"itemoverlaywrite\" class=\"iow\" src=\"../images/blank.png\"/>\n      </div>    \n    </div>-->\n    <table style=\"width:100%; z-index:4; background:rgba(255,255,255,0.75); -webkit-border-radius:10px;\">\n      <tr>\n         <th>\n          <div class=\"grid-cell\" x-mojo-touch-feedback=\"delayed\" style=\"height:100%;border-top:0px;\">\n            <id=\"like\">\n              <img src=\"#{likeImage}\" class=\"likeimg\">\n          </div>  \n        </th>\n        <th id=\"col2\" style=\"width:70%\">\n          <dt> \n              <div id=\"currentSong\" style=\"font-style:italic\"> #{currentsong}</div> \n              <div id=\"oldSong\" style=\"font-family:Georgia\"> #{oldsong} </div>\n              <div id=\"skippedSong\" style=\"font-family:Georgia\"> #{skipped} </div>\n          </dt>\n          <dt id=\"artistText\"> #{currentartist} </dt>\n          <dt id=\"length\"> #{duration}</dt>\n        </th>\n        <th>\n          <div class=\"grid-cell\" x-mojo-touch-feedback=\"delayed\" style=\"height:100%;border-top:0px; \">\n            <id=\"buy\">\n              <img src=\"#{buyImage}\" class=\"buyimg\">\n           </div>\n        </th>\n      </tr>\n    </table>\n  </div>  \n</link>\n</div>  \n",
											onlisttap: "list2Listtap",
											swipeToDelete: false,
											reorderable: false,
											type: "Palm.Mojo.List",
											l: 0,
											t: 100,
											h: 100
										}
									]
								}
							]
						},
						{
							name: "scroller7",
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
								bgImage: "images/white.png"
							},
							controls: [
								{
									name: "html2",
									content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <h3 class=\"header\" id=\"commentsheader\"><i>Comments (#{commentcount})</i></h3>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
									type: "Palm.Mojo.Html",
									l: 0,
									t: 0,
									h: "8",
									styles: {
										textAlign: "left"
									}
								},
								{
									name: "scroller8",
									scrollPosition: {
										left: 0,
										top: 0
									},
									type: "Palm.Mojo.Scroller",
									l: 0,
									t: 22,
									h: "87%",
									styles: {
										cursor: "move",
										overflow: "hidden"
									},
									controls: [
										{
											name: "list1",
											dropTarget: true,
											items: [],
											useSampleData: false,
											title: undefined,
											itemTemplateFile: "templates/comments/CommentItemTemplate",
											itemHtml: "\n",
											listTemplateFile: "templates/comments/CommentContainer",
											onlisttap: "list1Listtap",
											onfetchitems: "list1Fetchitems",
											renderLimit: "50",
											swipeToDelete: false,
											reorderable: false,
											rowTapHighlight: false,
											rowFocusHighlight: false,
											type: "Palm.Mojo.List",
											l: 0,
											t: 0,
											h: 100
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			name: "html4",
			showing: false,
			content: "<!--<style>\n#inputcomment{\n    /*background-color:rgba(0,0,0,0.75);*/\n    background:rgba(186,160,255,0.75);\n    /*background-size: 30%;*/\n    position: fixed;\n    width:290px;\n    height:0px;\n    bottom: -600px;\n    left:-320px;\n    /*display:block;*/\n    z-index:20;\n    -webkit-transition-property: bottom, left;\n    -webkit-transition-duration: 0.5s;\n    -webkit-transition-timing-function: ease-in-out;\n}\n</style>\n<span id=\"inputcomment\">\n    <div id=\"multilineTextField\" x-mojo-element=\"TextField\" style=\"overflow: hidden; max-height:120px;\"></div>\n</span>-->",
			type: "Palm.Mojo.Html",
			l: 0,
			t: 0,
			h: "0"
		}
	]
});
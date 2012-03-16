opus.Gizmo({
	name: "main",
	dropTarget: true,
	type: "Palm.Mojo.Panel",
	h: "100%",
	styles: {
		zIndex: 2
	},
	chrome: [
		{
			name: "scroller13",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "searchLabel,latestLabel,popLabel,hotLabel,randLabel,featLabel,likedLabel,mixFeedLabel,myLabel",
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
				bgColor: "",
				bgImage: "images/8tracks_blue2.png"
			},
			controls: [
				{
					name: "searchLabel",
					label: "Search",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "latestLabel",
					ontap: "latestLabelTap",
					label: "Latest",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "popLabel",
					label: "Popular",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "hotLabel",
					label: "Hot",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "randLabel",
					label: "Random",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "featLabel",
					label: "Featured",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "likedLabel",
					label: "Liked",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "mixFeedLabel",
					label: "Mix Feed",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				},
				{
					name: "myLabel",
					label: "Mine",
					type: "Palm.Mojo.Label",
					l: 0,
					w: "250",
					t: "10",
					styles: {
						italic: true,
						bgColor: "",
						textColor: "white",
						fontFamily: "Prelude",
						fontSize: "32px",
						bgImage: "",
						textAlign: "right"
					}
				}
			]
		},
		{
			name: "scroller8",
			plane: "-1",
			layoutKind: "hbox",
			mode: "horizontal-snap",
			snapElements: "slider1, slider2,slider3,slider4,slider5,slider6,slider7,slider8,slider9",
			snapIndex: "0",
			scrollPosition: {
				left: 0,
				top: 0
			},
			type: "Palm.Mojo.Scroller",
			l: 0,
			t: 452,
			h: "100%",
			styles: {
				cursor: "move",
				overflow: "hidden"
			},
			controls: [
				{
					name: "slider1",
					plane: "0",
					onchange: "slider1Change",
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
							name: "html1",
							content: "<div class='palm-row'style=\"heigth:60px\">\n    <div class=\"palm-row-wrapper\" style=\"heigth:60px\">\n        <div class=\"textfield-group\" x-mojo-focus-highlight=\"true\" style=\"heigth:60px\">\n            <div class=\"title\">        \n                <div class=\"label1\"></div>\n                <div id=\"SearchtextField\" x-mojo-element=\"TextField\" style=\"heigth:60px\"></div>\n            </div> \n        </div>\n    </div>\n</div>\n",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 0,
							h: "60px"
						},
						{
							name: "searchHtml",
							content: "\n",
							ontap: "searchSelectionTap",
							templateFile: "templates/selectionTemplate",
							type: "Palm.Mojo.Html",
							l: 2,
							r: "",
							w: 318,
							t: 60,
							b: 312,
							h: 30,
							styles: {
								textAlign: "left"
							}
						},
						{
							name: "list0",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "<div class=\"palm-row grid-cell\" x-mojo-tap-highlight=\"delayed\" style=\"padding:1pt;\"> \n  <div class=\"title\">\n    <mixInfo=\"mixInfo\">\n    <set_id=\"set_id\">\n    <tag=\"tag\">\n    <creator=\"creator\">\n    <timeSince=\"timeSince\">\n    <table style=\"padding:1pt;\" class=\"falling\">\n    <tr>\n      <th id=\"col1\"><img src=\"#{leftImage}\" class=\"floatleft\" /></th>\n      <th id=\"col2\">\n        <dt id=\"titleText\" style=\"font-family:Tahoma;font-size:13pt;\"> #{title} </dt>\n        <dt id=\"tagText\"> #{tag}&nbsp;<i>#{creator}</i></dt>\n        <dt id=\"time\"> #{timeSince} </dt>\n      </th>\n    </tr>\n    </table>\n  </div>  \n</div>  ",
							onlisttap: "searchListTap",
							onfetchitems: "",
							swipeToDelete: false,
							reorderable: false,
							rowTapHighlight: false,
							rowFocusHighlight: false,
							type: "Palm.Mojo.List",
							l: 0,
							w: "320",
							t: 60,
							h: 100
						},
						{
							name: "search",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"search\"> more results..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "170",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider2",
					onchange: "slider1Change",
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
							itemHtml: "<div x-mojo-tap-highlight=\"delayed\">\n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\" class=\"falling\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg #{empty}\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</div>",
							onlisttap: "Listtap",
							onitemrendered: "",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "latest",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"recent\"> more latest..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "170",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider3",
					onchange: "slider1Change",
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
							name: "list2",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onitemrendered: "",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html5",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"popular\"> more popular..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider4",
					onchange: "slider1Change",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 959,
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
							name: "list3",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html6",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"hot\"> more hotness..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "170",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider5",
					onchange: "slider1Change",
					scrollPosition: {
						left: 0,
						top: 0
					},
					type: "Palm.Mojo.Scroller",
					l: 1279,
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
							name: "list4",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html7",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"random\"> more randomness..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider6",
					onchange: "slider1Change",
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
							name: "list5",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html8",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"featured\"> more featured mixes..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider7",
					snapElements: "html3,list6",
					onchange: "slider1Change",
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
							name: "html4",
							content: "<div class='palm-row'style=\"heigth:60px\">\n    <div class=\"palm-row-wrapper\" style=\"heigth:60px\">\n        <div class=\"textfield-group\" x-mojo-focus-highlight=\"true\" style=\"heigth:60px\">\n            <div class=\"title\">        \n                <div class=\"label\"></div>\n                <div id=\"LikedFilter\" x-mojo-element=\"TextField\" style=\"heigth:60px\"></div>\n            </div> \n        </div>\n    </div>\n</div>",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 0
						},
						{
							name: "html3",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut #{done}\" id=\"likefilter\" style=\"position:relative;left:10px\"> filter</span>\n     <span class=\"moreBut #{done}\" id=\"likefilterclear\" style=\"position:relative;left:200px\"> clear</span>\n  </div>\n  </tr>\n  </table>\n</link>",
							type: "Palm.Mojo.Html",
							l: 0,
							t: 59
						},
						{
							name: "list6",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\" class=\"falling\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html9",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"liked\"> more liked goodness..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider8",
					onchange: "slider1Change",
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
							name: "list8",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html10",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"mixfeed\"> more of my mix feed..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				},
				{
					name: "slider9",
					onchange: "slider1Change",
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
							name: "list7",
							dropTarget: true,
							items: [],
							useSampleData: false,
							title: undefined,
							itemHtml: "\n<div x-mojo-tap-highlight=\"delayed\">\n<link rel=\"stylesheet\" type=\"text/css\"href=\"stylesheets/grid.css\"> \n  <div class=\"title\">  \n    <table style=\"padding:1pt;vertical-align:top; width:100%; height:50px\"> \n    <tr>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column1\" style=\"background-image:url(#{leftImage})\"> <class=\"leftImg\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix1\"><span id=\"mix1\">#{mixName1}</h2>\n          <mixInfo1=#{mixInfo1)>\n        </th> \n      </div>\n      <div x-mojo-tap-feedback=\"delayed\">\n        <th id=\"column2\" style=\"background-image:url(#{rightImage})\"> <class=\"rightImg #{empty}\" x-mojo-tap-highlight=\"delayed\">\n          <h2 id=\"mix2\"><span id=\"mix2\">#{mixName2}</h2>\n          <mixInfo2=#{mixInfo2)>\n        </th>\n      </div>\n    </tr> \n    </table> \n  </div>  \n</link> \n</div>",
							onlisttap: "Listtap",
							onfetchitems: "list1Fetchitems",
							renderLimit: "100",
							lookAhead: "12",
							swipeToDelete: false,
							reorderable: false,
							type: "Palm.Mojo.List",
							l: 0,
							t: 0,
							h: 100
						},
						{
							name: "html2",
							content: "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/more.css\"> \n  <table>\n  <tr>\n  <div x-mojo-tap-feedback=\"delayed\">\n    <span class=\"moreBut done\" id=\"mine\"> more of my stuff..</span>\n  </div>\n  </tr>\n  </table>\n</link>\n ",
							ontap: "moreLatestHtmlTap",
							type: "Palm.Mojo.Html",
							l: 0,
							r: "",
							w: "250",
							t: 0,
							b: "10",
							h: "50",
							styles: {
								textAlign: "left"
							}
						}
					]
				}
			]
		}
	]
});
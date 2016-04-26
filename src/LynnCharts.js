
	var $ = require('jquery');
	var LynnLayout = require('./plugin/LynnLayout');
	var LynnSpinner = require('./plugin/lynnSpinner.js');
	var LynnDropDown = require('./plugin/lynnDropDown.js');
	require('./plugin/colorpicker/spectrum.js')
	var ChartBox = require('./ChartBox');

	
	/**
	 * 总chart,把其他的结合起来而来
	 * @param {obj} opts {
	 *      container: element	//该插件跟据哪个元素生成
	 *      width:1500,
	 *      height:600,
	 *      toolbar: {
	 *      	period:{}		//显示什么时间周期
	 *      	type: {} 		//选择类型
	 *       	MAS: {}			//平均线
	 *       	layout: {}		//展现形式
	 *      },
	 *      chart: {	//ChartBox里面的配置
	 *      },
	 *      onError:function(){},	//错误处理函数
	 *      onAdd:function(){},
	 *      onRemove: function(){}
	 * }
	 */
	var newGmail =  [["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]];
	

	

	function LynnCharts(opts){
		var defaults = {
			dpWrap:document.body,
			toolbar: {
				applyAll:false,
				period: {
					labelWidth: 85,
					label: function(activeEle){
						if(activeEle){
							var v = activeEle.item;
							return v.label;
						} else {
							return '选择周期'
						}
					},
					listCls:'chart-period',
					items: [
						{label: '1 Minute', value:1, active:true},
						{label: '5 Minute', value:5},
						{label: '15 Minute', value:15},
						{label: '1 Hour', value:60},
						{label: '1 Day', value:100},
						{label: '1 Week', value:200},
						{label: '1 Month', value:300}
					],
					formatItemTpl: function(item) {
						var cls = item.active ? 'active':''
						return '<a class="clearfix '+ cls +'">'+ item.label + '<i class="icon icon-shoucang"></i></a>';
					},
					itemClick: function(data,obj) {
						obj.c.changePeriod(data.value);
					}
				},
				type: {
					label: function(activeEle){
						if(activeEle){
							var v = activeEle.item;
							return v.label;
						} else {
							return '切换类型'
						}
					},
					listCls:'chart-type',
					labelWidth: 70,
					width:100,
					items: [
						{label:'折线图', value:'polyline' },
						{label: 'k线图', value:'candlestick',active:true},
					],
					formatItemTpl: function(item) {
						var cls = item.active ? 'active':''
						return '<a class="clearfix '+ cls +'">'+ item.label + '<i class="icon icon-shoucang"></i></a>';
					},
					itemClick: function(data,obj){
						var chart = obj.c;
						chart.changeType(data.value);
					}
				},
				MAS: {
					label:'MAs',
					labelWidth:60,
					width: 152,
					multiple:true,
					listCls:'MAList',
					maxCount:8,
					items: [
						{label:'MA5',value:5,active:true},
						{label:'MA10',value:10,active:true},
						{label:'MA20',value:20,active:true},
						{label:'MA60',value:60,active:true}
					],
					onError: function(status,msg) {
						this.c.onError(status,msg);
					},
					footer: [
						{
							plugin: LynnSpinner,
							name:'spinner',
							tpl:'<input type="text"></input>',
							options: {min:1,step:1,max:250}
						},
						{
							name:'colorpicker',
							tpl:'<input type="text"></input>',
							init: function(opts,fatherObj){
								var appendTo = fatherObj.dpListWrap;
								var opts = {
									color:'yellow',
									showPaletteOnly: true,
								    togglePaletteOnly: true,
								    hideAfterPaletteSelect:true,
								    togglePaletteMoreText: '自定义',
								    togglePaletteLessText: '返回',
								    palette:newGmail,
								    appendTo:appendTo
								}
								return this.spectrum(opts);
							}
						},
						{
							tpl:'<button class="btn btn-add btn-dark">添加</button>',
							onClick: function(dpObj){
								var value = dpObj.plugins['spinner'].getVal();
								var color = dpObj.plugins['colorpicker'].spectrum('get').toHexString();
								var item = {label:'MA'+value, value:value, active:true, canDel:true, group:'add'};
								var add = dpObj.addItem(item);
								if(add) {
									var chart = dpObj.c;
									chart.changeMas({label:item.label,type:'MA',color: color,daysCount: value,sort:value},true);
									dpObj.plugins['spinner'].setVal(1);
								}
							}
						}
					],
					itemClick: function(data,dpObj){
						var chart = dpObj.c;
						chart.changeMas(data);
					}
				},
				jumpLastestBtn:'<i class="icon icon-justify-r"></i>',
				fullscreen: {
					big:'全屏',
					small:'返回'
				},
				layoutCtrl: {
					label: function(activeEle){
						if(activeEle){
							var v = activeEle.item;
							return v.label;
						} else {
							return '布局'
						}
					},
					labelWidth:110,
					width: 150,
					listCls:'layoutCtrl',
					maxCount:6,
					items: [
						{label:'单窗口多标签',value:0,active: true},
						{label:'多窗口1列',value:1},
						{label:'多窗口2列',value:2},
						{label:'多窗口3列',value:3}
					],
					itemClick: function(data,dpObj){
						var chart = dpObj.c;
						chart.changeLayout(data.value);
					}
				},
				lock:false,
			},
			layout: {
			},
			chartbox: {
				events: {
					drag: {
						onBeforeDrag: function(){
							var chart = this.c;
							chart.operateChart(function(chartBox) {
								if(chartBox!==this) {
									var crossLineEvents = chartBox.eventList['crossLine'];
									if(crossLineEvents) {
										crossLineEvents.mouseout.call(crossLineEvents);
									}
									chartBox.tempOldRanges = chartBox.dataRanges;
								}
							})
						},
						onDrag:function(oldRanges){
							var chart = this.c;
							chart.synchronizeDrag(this,oldRanges);
						},
						onAfterDrag: function(){
							var chart = this.c;
							chart.operateChart(function(chartBox) {
								if(chartBox!==this) {
									delete chartBox.tempOldRanges;
								}
							})
						}
					},
					wheel: {
						step:6,
						onBeforeWheel: function(){
							console.log('onBeforeWheel');
						},
						onWheel: function(oldRanges){
							var chart = this.c;
							chart.synchronizeWheel(this,oldRanges)
						}
					},
					crossLine: {
						onCross: function(info){
							var chart = this.c;
							chart.synchronizeCross(this,info)
						},
						onAfterCross: function(){
							var chart = this.c;
							chart.synchronizeAfterCross(this);
						}
					},
					rightClick:{}
				}
			},
			polyline: {
				lineColor:'yellow',
			},
			formatTabTpl: function(item) {
				var tpl = '<span class="title">'+item.title+'</span>';
				if(item.ask != void 0) tpl += '<span class="number-plus price ask">卖价:'+item.ask+'</span>';
				if(item.bid != void 0) tpl += '<span class="number-fall price bid">买价:'+item.bid+'</span>';
				return tpl
			},
			items: [],
			onError: function(status,msg){alert(msg)}
		};
		
		$.extend(true,this,defaults,opts);
		var container = this.container||document.body
		this.container = $(container).addClass('lynn-chart');
		if(!/^p|r|f/.test(this.container.css('position'))) {
			this.container.css('position','relative');
		}
		this.chartList = [];
		this.init();
	}
	LynnCharts.prototype = {
		constructor: LynnCharts,
		init: function(){
			this.initToolBar();
			this.initLayout();
		},
		initSize: function(){
			if(!this.width) {
				this.width = this.container.width();
			}
			if(!this.height) {
				this.height = this.container.height();
			}
		},
		initToolBar: function(){
			var toolbarOpts = this.toolbar;
			if(!toolbarOpts) {
				return false;
			}
			var me = this;
			this.toolbarEle = $('<div class="lynn-chart-toolbar"></div>').appendTo(this.container);
			for(var tool in toolbarOpts) {
				var opts = toolbarOpts[tool];
				switch(tool) {
					case 'period':
					case 'type':
					case 'MAS':
					case 'layoutCtrl':
						var div = $('<div class="'+tool+'-dp"></div>').appendTo(this.toolbarEle);
						opts.dpListWrap = this.dpListWrap;
						var dpObj = new LynnDropDown(div,opts);
						dpObj.c = this;
						this[tool+"DpObj"] = dpObj
						break;
					case 'applyAll':
						var check = opts ? 'checked=checked':'';
						var applyAllDiv = $('<span class="lynn-chart-apply-all"><input id="apply-all" type="checkbox" '+check+' /><label for="apply-all">应用到全部</label></span>').appendTo(this.toolbarEle);
						this.applyAllEle = applyAllDiv;
						this.applyAll = opts;
						var me = this;
						applyAllDiv.find('#apply-all').on('click',function(e){
							me.applyAll = !me.applyAll;
							var checked = $(this).prop('checked');
						})
						break;
					case 'jumpLastestBtn':
						var btn = $('<div class="lynn-chart-jumpLastestbtn"><a href="javascript:void(0)" >'+opts+'</a></div>').appendTo(this.toolbarEle);
						btn.find('a').on('click',function(){
							me.jumpLastest();
						})
						break;
					case 'fullscreen':
						var ele = $('<div class="lynn-chart-fullscreen"><a href="javascript:void(0)">'+opts.big+'</a></div>').appendTo(this.toolbarEle);
						this.fullscreenOpts = opts;
						this.fullscreenEle = ele;
						ele.find('a').on('click',function(e){
							me.changeFullscreenStatus(this,e);
						})
						break;
					case 'lock':
						var lockDiv = $('<div class="lynn-chart-lock"><span class="lock-label"></span><a href="javascript:void(0)" class="lock-btn"><i></i></a></div>').appendTo(this.toolbarEle);
						this.lockEle = lockDiv;
						if(this.layoutCtrlDpObj) {
							var value;
							try {
								value = this.layoutCtrlDpObj.activedEle.item.value
							}catch(e){}
							if(value==0) {
								lockDiv.hide();
							}
						}
						lockDiv.find('.lock-btn').on('click',function(e){
							me.changeLockedStatus(!me.locked);
						})
						this.changeLockedStatus(opts);
					break;
				}

			}
		},
		initLayout: function(){
			var me = this;
			var layoutOpts = this.layout;
			var col = this.layoutCtrlDpObj.activedEle.item.value;
			var opts = $.extend(this.layout,{col:col,items:this.items,formatTabTpl: this.formatTabTpl});
			var onAdd = opts.onAdd,onRemove = opts.onRemove;
			opts.onAdd = function(item){
				var wrap = this;
				me.addChart.call(me,wrap,item);
				onAdd&&onAdd.call(this,item);
			}
			opts.onRemove = function(index) {
				me.removeChart.call(me,index);
			}
			opts.onZoomIn = function(index){
				var chartBox = me.chartList[index];
				chartBox.resize();
			}
			opts.onZoomOut = function(index) {
				var chartBox = me.chartList[index];
				chartBox.resize();
			}
			opts.onChangeActive = function(index) {
				me.synchronizeToolBar.call(me,index)
			}
			var toolbarHeight = this.toolbarEle.outerHeight();
			this.toolbarHeight = toolbarHeight;
			var layoutWrapHeight = this.container.height() - toolbarHeight;
			var layoutWrap = $('<div style="position:relative;height:'+layoutWrapHeight+'px"></div>').appendTo(this.container);
			opts.container = layoutWrap;
			this.layoutEle = layoutWrap;
			this.layoutObj = new LynnLayout(opts);
			this.layoutObj.c = this;
		},
		synchronizeToolBar: function(index){
			var chartBox = this.chartList[index];
			if(!chartBox) {
				return false;
			}
			var toolbar = ['period','type','MAS'];
			for(var i=0,cur;cur=toolbar[i++];) {
				var item = chartBox[cur+"DpItem"];
				if(item) {
					this[cur+'DpObj'].setActiveByItem(item);
				}
			}
		},
		changeLockedStatus: function(status){
			if(this.layoutObj) {
				if(this.layoutObj.col==0) {
					status = false;
				}
			}
			
			if(this.locked == status) {
				return false;
			}
			var text = status ? '解锁':'锁定';
			this.lockEle.find('.lock-label').html(text);
			var clsFn = status ? 'addClass' : 'removeClass';
			this.lockEle.find('.lock-btn')[clsFn]('locked');
			this.locked  = status;

			if(status==true) {
				this.synchronizeFn();
			}
		},
		addChart: function(wrap,item){
			var me = this;
			var chartOpts = this.chartbox;
			if(item.opts) {
				chartOpts = $.extend(true,chartOpts,item.opts);
			}
			chartOpts.formatTitleTpl = this.formatTabTpl;
			chartOpts.title = item;
			chartOpts.container = wrap;

			var chartObj = new ChartBox(chartOpts);
			chartObj.c = this;
			chartObj.ajaxTime = +new Date();
			this.initChartObjDpItem(chartObj)
			this.chartList.push(chartObj);
			if(this.locked && this.chartList.length > 1) {
				var oldActiveBox = null;
				if(this.oldActiveIndex!==void 0) {
					oldActiveBox = this.chartList[this.oldActiveIndex];
					delete this.oldActiveIndex ;
				}
				chartObj.readyList.push(function(){
					me.synchronizeFn(oldActiveBox,null,chartObj);
				})
			}
			if(item.active) {
				//同步toolbar
				chartObj.readyList.push(function(){
					me.synchronizeToolBar(me.chartList.length-1);
				})
				
			}
			this.onAdd&&this.onAdd.call(null,item);
		},
		removeChart: function(index) {
			var chartBox = this.chartList[index];
			this.chartList.splice(index,1);
			this.resize();
			this.onRemove&&this.onRemove.call(null,index,chartBox.title);
		},
		initChartObjDpItem:function(chartObj) {
			var chartOpts = chartObj.chartOpts;
			var period = chartOpts.period;
			var chartType = chartOpts.mainArea.type;
			var subCharts = chartOpts.mainArea.subCharts;
			chartObj.periodDpItem = {value:period};
			chartObj.typeDpItem = {value:chartType};
			var items = [];
			for(var c in subCharts) {
				var cur = subCharts[c];
				var active = (cur.show!==false);
				items.push({value: cur.daysCount,label: c, active:active});
			}
			chartObj.MASDpItem = items;
		},
		operateChart: function(){
			var args = arguments, activeChartBox, callback, isApplyAll;
			var type = $.type(args[0]);
			if(type=='function') {
				var activeIndex = this.layoutObj.getActiveIndex();
				activeChartBox = this.chartList[activeIndex];
				callback = args[0];
				isApplyAll = args[1];
			}else if(type=='object') {
				activeChartBox = args[0]
				callback = args[1];
				isApplyAll = args[2];
			}
			var status;
			if(isApplyAll) {
				status = this.applyAll;
			}else {	
				status = this.locked;
			}

			if(status) {
				for(var i=0,cur;cur = this.chartList[i++];) {
					callback(cur);
				}
			}else {
				callback(activeChartBox);
			}
		},
		changePeriod: function(period){
			var me = this;
			this.operateChart(function(chartBox){
				var p = chartBox.chartOpts.period;
				if(p!=period) {
					chartBox.chartOpts.period = period;
					chartBox.dataRanges = null;
					chartBox.ajaxData(null,null,function(datas){
						chartBox.datas = datas;
						chartBox.painter();
					})

					chartBox.periodDpItem = me.periodDpObj.activedEle.item;
				}
			},true);
		},
		changeType: function(type) {
			var obj = {type:type};
			var typeOpts = this[type];
			if(typeOpts) {
				obj.opts = typeOpts;
			}
			var me = this;
			this.operateChart(function(chartBox){
				chartBox.changeAreaChart('mainArea',obj);
				chartBox.typeDpItem = me.typeDpObj.activedEle.item;
			},true);
		},
		changeMas: function(data,add) {
			var del = data.delete, show = data.show, me = this;
			if(add) {
				this.operateChart(function(chartBox){
					var chartObj = chartBox.chartOpts.mainArea.subCharts;
					var key = data.label;
					delete data.label;
					chartObj[key] = data;
					chartBox.changeAreaChart('mainArea');
					chartBox.MASDpItem = me.MASDpObj.items;
				},true)
			}else {
				this.operateChart(function(chartBox){
					var chartObj = chartBox.chartOpts.mainArea.subCharts;
					if(del) {	//表示删除
						delete chartObj[data.label]
					}else {
						chartObj[data.label].show = show;
					}
					chartBox.changeAreaChart('mainArea');
					chartBox.MASDpItem = me.MASDpObj.items;
				},true)
				
			}
		},
		changeLayout: function(col){
			if(col==0) {
				this.lockEle.hide();
				this.changeLockedStatus(false);
			}else {
				this.lockEle.show();
			}
			this.layoutObj.changeCol(col);
			for(var i=0,cur;cur=this.chartList[i++];) {
				cur.resize();
			}
		},
		synchronizeDrag: function(chartbox,oldRanges){
			var dataRanges = chartbox.dataRanges;
			var count = dataRanges.to - oldRanges.to;
			var time;
			if(count >0) {
				if(dataRanges.start > 0) {
					time = chartbox.datas[dataRanges.start].quoteTime;
				}else {
					time = count;
				}
			}else if(count<0) {
				if(dataRanges.to < chartbox.datas.length-1) {
					time = chartbox.datas[dataRanges.to].quoteTime;
				}else {
					time = count;
				}
			}else {
				return false;
			}
			var dir = count > 0 ? 0: 1;

			this.operateChart(chartbox,function(chartBox){
				if(chartBox!==chartbox) {
					if(Math.abs(time)<1000) {
						var tempOldRanges = chartBox.tempOldRanges;
						var start = tempOldRanges.start + time, to = tempOldRanges.to + time;
						var ranges = {start:start,to:to};
						chartBox.synchronizeX(ranges,dir);
					}else {
						chartBox.synchronizeX(time,dir);
					}
					
				}
			})
		},
		synchronizeCross: function(chartbox,crossInfo) {
			this.operateChart(chartbox,function(chartBox){
				if(chartBox!==chartbox) {
					var crossLineEvents = chartBox.eventList['crossLine'];
					if(crossLineEvents) {
						crossLineEvents.drawByValue.call(crossLineEvents,crossInfo);
					}
					
				}
			})
		},
		synchronizeAfterCross: function(chartbox) {
			this.operateChart(chartbox,function(chartBox){
				if(chartBox!==chartbox) {
					var crossLineEvents = chartBox.eventList['crossLine'];
					if(crossLineEvents) {
						crossLineEvents.mouseout.apply(crossLineEvents);
					}
					
				}
			})
		},
		synchronizeWheel: function(chartbox,oldRanges){
			var dataRanges = chartbox.dataRanges;
			if(dataRanges.to==oldRanges.to&&dataRanges.start==oldRanges.start) {
				return false;
			}
			var time;
			if(dataRanges.to > chartbox.datas.length-1) {
				time = dataRanges.to - oldRanges.to;
			}else {
				time = chartbox.datas[dataRanges.to].quoteTime;
			}
			this.synchronizeFn(chartbox,time);
		},
		jumpLastest: function(){
			this.operateChart(function(chartBox){
				var dataRanges = chartBox.dataRanges;
				var count = dataRanges.to - dataRanges.start;
				var to = chartBox.datas.length-1, start = to - count;
				chartBox.painter({start:start,to:to});
			},true)
		},

		//同步x轴
		synchronizeFn: function(activebox,time,changeChartBox){
			if(!activebox) {
				var activeIndex  = this.layoutObj.getActiveIndex();
				var activebox = this.chartList[activeIndex];
			}
			var changeTime;
			if(time) {
				changeTime = time;
			}else {
				if( activebox.dataRanges.to > activebox.datas.length-1) {
					changeTime = activebox.dataRanges.to - activebox.datas.length -1;
				}else {
					changeTime = activebox.datas[activebox.dataRanges.to].quoteTime;
				}
			}
			var barWidth = activebox.chartOpts.theme.barWidth,spaceWidth = activebox.chartOpts.theme.spaceWidth;
			if(changeChartBox) {
				change(changeChartBox,changeTime,barWidth,spaceWidth);
			}else {
				this.operateChart(activebox,function(chartBox) {
					if(chartBox!=activebox) {
						change(chartBox,changeTime,barWidth,spaceWidth);
					}
				})
			}

			function change(chartBox,time,barWidth,spaceWidth){
				if(Math.abs(time) < 1000) {
					var dataRanges = chartBox.dataRanges;
					var obj = {start:dataRanges.start+time,to:dataRanges.to+time};
					chartBox.synchronizeX(obj,1,barWidth,spaceWidth);
				}else {
					chartBox.synchronizeX(time,1,barWidth,spaceWidth);
				}
			}
		},
		setActive: function(v) {
			if(!v) {
				return false;
			}
			var ret = this.layoutObj.setActive(v);
		},
		add: function(item){
			var chartboxes = [];
			for(var i=0,cur;cur=this.chartList[i++];) {
				chartboxes.push(cur);
			}
			this.oldActiveIndex  = this.layoutObj.getActiveIndex();
			var ret = this.layoutObj.addItem(item);
			if(ret!==false) {
				for(var i=0,box;box=chartboxes[i++];) {
					box.resize();
				}
			}
			return ret;
		},
		updateLatestDatas: function(datas){
			var now = +new Date();
			for(var i=0,cur;cur = this.chartList[i++];) {
				if(now - cur.ajaxTime < 1000) {
					continue;
				}
				cur.ajaxTime  = now;

				//如果没有数据，就用ajax
				if(!datas) {
					cur.ajaxData(null,null,function(datas){
						updateDatas(this,datas);
					},false,false)
				}else {
					var symbol = cur.title.title;
					var curDatas = (datas[symbol]||[]).reverse();
					updateDatas(cur,curDatas)
				}
			}

			//更新数据
			function updateDatas(chartBox,datas){
				if(!datas||!datas.length) return false;
				var to = chartBox.dataRanges.to,start = chartBox.dataRanges.start;
				var oldDatasLength = chartBox.datas.length;

				var appendDatas = compareDatas(chartBox,datas);
				if(!appendDatas) {
					return false;
				}
				appendDatas = chartBox.formatDatas(appendDatas);
				chartBox.datas.pop();
				chartBox.appendDatas(appendDatas,1);

				//如果当前显示的是最新的数据，那么需要更新图
				if(to >= oldDatasLength -1) {
					var max = to - oldDatasLength -1;
					if(appendDatas.length-1 <= max) {
						to = to + appendDatas.length-1
					}else {
						var count = to - start;
						to = chartBox.datas.length-1;
						start = to - count;
					}

					chartBox.dataRanges = {start: start,to:to};
					chartBox.painter();
				}
			}


			//比较数据
			function compareDatas(chartBox,newDatas) {
				var oldDatas = chartBox.datas, oldLatestTime = oldDatas[oldDatas.length-1].quoteTime;
				var spliceIndex,appendDatas;
				for(var i=newDatas.length-1; i>=0; i--) {
					var curTime = newDatas[i][0];
					if(curTime==oldLatestTime) {
						spliceIndex = i;
						break;
					}
				}
				if(spliceIndex !== void 0) {
					appendDatas = newDatas.slice(spliceIndex,newDatas.length);
					if(!appendDatas.length) {
						appendDatas = null;
					}
				}
				return appendDatas;
			}
		},

		updateTitles: function(titles){
			for(var i=0,cur;cur = this.chartList[i++];) {
				var index = i -1;
				var symbol = cur.title.title;
				var title = titles[symbol];
				cur.setTitle(title);
				this.layoutObj.setTitle(title,index);
			}
		},
		changeFullscreenStatus: function(target,e){
			if(!this.fullscreenStatus) {
				this.fullscreenStatus = true;
				var zIndex = 999999;
				this.normalSize = {width:this.container.outerWidth(),height:this.container.outerHeight()};
				this.container.css({position:'fixed','z-index':zIndex++, top:0, left:0});

				var container = this.container[0];
				this.oldParentNode = container.parentNode;
				document.body.appendChild(container);
				if(this.dpListWrap == document.body) {
					this.oldzIndex = $(".lynn-dplist").css('z-index');
					$('.lynn-dplist,.sp-container').css('z-index',zIndex);
				}else {
					var dpListWrap = $(this.dpListWrap);
					this.oldzIndex = dpListWrap.css('z-index');
					dpListWrap.css('z-index',zIndex);
				}
				
				this.resize(true);
				$(target).html(this.fullscreenOpts.small);
			}else {
				var container = this.container[0];
				this.oldParentNode.appendChild(container);
				this.container.css({position:'relative','z-index':'',top:'',left:''});

				this.fullscreenStatus = false;
				var width = this.normalSize.width,height = this.normalSize.height;
				delete this.normalSize;

				if(this.dpListWrap == document.body) {
					$('.lynn-dplist,.sp-container').css('z-index',this.oldzIndex);
				}else {
					$(this.dpListWrap).css('z-index',this.oldzIndex);
				}
				delete this.oldzIndex;

				this.resize({width:width,height:height});
				$(target).html(this.fullscreenOpts.big);
				
			}

		},
		resize: function(sizeObj){
			var isChangeTabs = false,width,height;
			if(this.fullscreenStatus) {
				width = $(window).width();
				height = $(window).height();
			}
			var type = $.type(sizeObj);
			if(type=='object'){
				if(sizeObj.width) {
					if(this.fullscreenStatus) {
						this.normalSize.width = sizeObj.width;
					}else {
						width = sizeObj.width;
					}
					
				}
				if(sizeObj.height) {
					if(this.fullscreenStatus) {
						this.normalSize.height = sizeObj.height;
					}else {
						height = sizeObj.height;
					}
					
				}
				isChangeTabs = true;

			}else if(type=='boolean') {
				isChangeTabs = true;
			}
			width&&(this.container.outerWidth(width));
			height&&(this.container.outerHeight(height));

			if(isChangeTabs) {
				var layoutWrapHeight = this.container.outerHeight() - this.toolbarHeight;
				this.layoutEle.css({'height':layoutWrapHeight, width:this.container.width()});
				this.layoutObj.resize.call(this.layoutObj);
			}
			for(var i=0,cur; cur=this.chartList[i++];) {
				cur.resize.call(cur);
			}
		}
	}

	module.exports = LynnCharts;






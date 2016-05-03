(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["lynnCharts"] = factory(require("jquery"));
	else
		root["lynnCharts"] = factory(root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
		var $ = __webpack_require__(1);
		var LynnLayout = __webpack_require__(2);
		var LynnSpinner = __webpack_require__(5);
		var LynnDropDown = __webpack_require__(6);
		__webpack_require__(7)
		var ChartBox = __webpack_require__(8);
	
		
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
					me.synchronizeToolBar.call(me,index);
					me.onChange&&me.onChange.call(me,index);
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
					chartOpts = $.extend(true,{},chartOpts,item.opts);
					delete item.opts;
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
				if(v=='undefined') {
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
					var dataLength = appendDatas.length - 1;
	
					//如果当前显示的是最新的数据，那么需要更新图
					if(to >= oldDatasLength -1) {
						var max = to - (oldDatasLength -1);
						if(dataLength <= max) {
							to = to + dataLength;
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
	
	
	
	
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	var LynnTabs = __webpack_require__(3);
	var LynnScrollbar = __webpack_require__(4);
	
	/**
	 * 页面如何显示
	 * @param {object} opts {
	 *     container: 哪个元素生成,
	 *     onError: function('action',status){}	//操作错误时的回调函数
	 *     formatTabTpl: function(item){}		//设置tab的html
	 *     onAdd: function(){}					//添加的回调函数
	 *     onRemove: function(){}				//删除回调函数
	 *     onClick: function(){}				//选中后的回调函数
	 *     onZoomIn: function(){}				//放大后的回调函数
	 *     onZoomOut: function(){}				//缩小后的回调函数
	 *     col:0								//以几列显示，如果为0的话，就多tab显示
	 *     margin:8								//每个子项目的间隔
	 *     items: []							//初始化数据
	 * }
	 */
	
	function LynnLayout(opts){
		this.container = opts.element||document.body;
		delete opts.element;
		var defaults = {
			onError: function(){},
			margin:8,
			col:0,
			items:[],
			minHeight:240
		};
		$.extend(this,defaults,opts);
		this.count = 0;
	
		this.init();
	}
	
	LynnLayout.prototype = {
		constructor: LynnLayout,
		init: function(){
			this.width = this.container.width();
			this.height = this.container.height();
			this.activeIndex = 0;
			this.initTabs();
			this.initItems();
			this.initEvents();
	
		},
		initTabs: function(){
			var me = this;
			this.container.css({padding:this.margin}).addClass('lynn-layout');
			var display=''
			if(this.col!=0) {
				display = 'display:none;';
			}
			var tabControl = $('<div class="lynn-layout-tabbar" style="'+display+'top:'+this.margin+'px;left:'+this.margin+'px;right:'+this.margin+'px;"></div>').appendTo(this.container);
	
			var opts = {
				container: tabControl,
				onRemoveError: function(error){
					me.onError.call(this,'remove',error);
				},
				onAddError: function(error){
					me.onError.call(this,'add',error);
				},
				onRemove: function(index){
					me.removeItem.call(me,index)
				},
				onClick: function(index){
					me.clickItem.call(me,index,true);
				}
			};
			this.tabControlEle = tabControl;
			if(this.formatTabTpl) {
				opts.formatItemTpl = this.formatTabTpl;
			}
			if(this.items) {
				opts.items = this.items;
			}
			this.tabObj = new LynnTabs(opts);
		},
		initItems: function(){
			this.itemsWrap = $('<div class="lynn-layout-items lynn-scrollbar-content"></div>').appendTo(this.container);
			var items = this.items;
			for(var i=0,len = items.length; i < len; i++) {
				this.addItem(items[i],true);
			}
			this.changeCol();
		},
		initEvents: function(){
			var me = this;
			this.container.on('click','.lynn-layout-item',function(e){
				var target = $(e.target), index = $(this).index();
				if(me.placeholder) {
					index -=1;
				}
				if(target.is('.win-close')) {
					me.tabObj.remove(index);
					me.removeItem(index);
					e.stopPropagation();
					return ;
				}else if(target.is('.win-big')) {
					me.zoomIn.call(me,target,index);
					e.stopPropagation();
					return ;
				}else if(target.is('.win-small')) {
					me.zoomOut.call(me,target,index);
					e.stopPropagation();
					return ;
				}
				me.clickItem.call(me,index);
			})
		},
		addItem: function(item,init){
			var tabAdd;
			if(!init) {
				tabAdd = this.tabObj.add(item);
			}
			if(tabAdd!==false) {
				var itemCtrls = '<div class="lynn-layout-item-ctrl">'+
					'<span class="win-small icon" style="display:none;">&#xe644;</span>'+
					'<span class="win-big icon">&#xe645;</span>'+
					'<span class="win-close icon">&#xe636;</span>'+
				'</div>';
				this.count +=1;
				var marginTop = this.col==0 ? 0 : ((this.count<=this.col) ? 0 : this.margin);
				var marginLeft = this.col<=1 ? 0 :((this.count%this.col==1) ? 0 : this.margin);
				var itemWrap = $('<div class="lynn-layout-item" style="margin-top:'+marginTop+'px;margin-left:'+marginLeft+'px">'+itemCtrls+'</div>').appendTo(this.itemsWrap);
				this.setLayoutActive();
				this.changeCol();
				this.onAdd&&this.onAdd.call(itemWrap,item);
			}
			return tabAdd;
		},
		getActiveIndex: function(){
			return this.activeIndex;
		},
		setLayoutActive: function(index){
			if(index==void 0) {
				index = this.tabObj.activeIndex;
			}else {
				if(index==this.activeIndex) return false;
			}
			var itemCls = '.lynn-layout-item';
			var item = this.container.find(itemCls+':eq('+index+')');
			item.addClass('active').siblings(itemCls).removeClass('active');
			if(this.col==0) {
				item.show().siblings(itemCls).hide();
			}
			this.activeIndex = index;
			this.onChangeActive&&this.onChangeActive.call(null,index);
			return index;
		},
		setActive: function(){
			var arg = arguments[0];
			var ret = this.tabObj.setActive(arg);
			if(ret!==false) {
				this.setLayoutActive();
			}
			return ret;
		},
		removeItem: function(index){
			var item = this.container.find('.lynn-layout-item:eq('+index+')').remove();
			this.count-=1;
			this.setLayoutActive();
			this.calcSize();
			this.checkIsOnlyOne();
			this.onRemove&&this.onRemove.call(null,index)
		},
		clickItem: function(index){
			this.setLayoutActive(index);
		},
		//放大
		zoomIn: function(target,index){
			if(this.placeholder) return ;
			var curItem = this.container.find('.lynn-layout-item:eq('+index+')');
			this.zoomItem = curItem;
	
			var style = 'float:left;'+curItem.attr('style');
			var div = '<div style="'+style+'"></div>';
	
			this.placeholder = $(div).insertBefore(curItem);
			
			curItem.css({
				'position':'absolute',
			 	'z-index':10, 
			 	'width': this.width, 
			 	'height': this.height,
			 	'margin-left':0,
			 	'margin-top' :0
			 });
			target.hide().prev().show();
			this.placeholder.data('target',target.prev());
			this.placeholder.data('index',index);
	
			//滚动条处理
			var scrollbars = this.scrollbarObj.getScrollbarDoms();
			var scrollStatus = {};
			for(var sb in scrollbars) {
				scrollStatus[sb] = scrollbars[sb].css('display');
				scrollbars[sb].hide();
			}
	
			this.scrollStatus = scrollStatus;
	
			this.onZoomIn && this.onZoomIn.call(target[0],index);
		},
		//缩小
		zoomOut: function(target,index){
			var marginLeft = this.placeholder.css('margin-left');
			var marginTop = this.placeholder.css('margin-top');
			var styles = {
				'position': '',
				'z-index': '',
				'width': this.itemWidth,
				'height': this.itemHeight,
				'margin-left': marginLeft,
				'margin-top' : marginTop
			}
			this.placeholder.remove();
			this.placeholder = null;
			this.zoomItem.css(styles);
			target.hide().next().show();
	
			var scrollbars = this.scrollbarObj.getScrollbarDoms();
			var scrollStatus = this.scrollStatus;
			for(var sb in scrollbars) {
				var status = scrollStatus[sb]||'none';
				scrollbars[sb].css('display',status);
			}
			var isAuto = arguments[2];
			if(isAuto == false) return false;
			this.onZoomOut && this.onZoomOut.call(target[0],index);
		},
		calcSize: function(count,col){
			var count = count||this.count, col = col||this.col;
			this.width = this.container.width()-1;
			this.height  = this.container.height();
			
			var col = col||1;
			this.itemWidth = Math.floor((this.width-this.margin*(col-1))/col);
			
			var row = Math.ceil(count/col),height;
			if(this.col !==0) {
				 height= Math.floor((this.height-this.margin*(row-1))/row);
			}else {
				height= this.height;
			}
	
			this.itemHeight = Math.max(height,this.minHeight);
			
	
	
			this.container.find('.lynn-layout-item').css({
				width: this.itemWidth,
				height: this.itemHeight
			})
		},
		resize: function(){
			this.tabObj.resize();
			this.calcSize();
			this.scrollbarResize();
		},
		changeCol: function(col){
			var me = this;
			var oldCol = this.col;
			if(typeof col=='number') {
				if(col==this.col) {
					return false;
				}
				this.col = col;
			}
			this.itemsWrap.removeClass('col_'+oldCol).addClass('col_'+this.col);
	
			//如果处于放大状态，要取消放大状态
			if(this.placeholder) {
				var target = this.placeholder.data('target');
				console.log(target);
				var index = this.placeholder.data('index');
				this.zoomOut(target,index,false)
			}
	
			this.calcSize();
			var items = this.container.find('.lynn-layout-item');
			if(this.col==0) {
				var activeIndex = this.activeIndex;
				items.each(function(i){
					$(this).css({'margin-top':0,'margin-left':0});
					if(i==activeIndex) {
						$(this).show();
					}else {
						$(this).hide();
					}
					$(this).find('.lynn-layout-item-ctrl').hide();
				})
				this.tabControlEle.show();
			}else {
				items.each(function(i){
					var index = i+1;
					var marginTop = index <=me.col ? 0 : me.margin;
					var marginLeft = (index % me.col ==1||me.col==1) ? 0 : me.margin;
					$(this).css({'margin-left': marginLeft,'margin-top':marginTop}).show();
					$(this).find('.lynn-layout-item-ctrl').show();
				})
				this.tabControlEle.hide();
			}
			this.scrollbarResize();
		},
		checkIsOnlyOne: function(){
			if(this.count==1) {
				this.container.find('.lynn-layout-item-ctrl').hide();
			}else {
				this.container.find('.lynn-layout-item-ctrl').show();
			}
		},
		scrollbarResize: function(){
			if(this.scrollbarObj) {
				this.scrollbarObj.setSize.call(this.scrollbarObj);
			}else {
				this.scrollbarObj = new LynnScrollbar({element:this.container})
			}
		},
		setTitle: function(title,index) {
			this.tabObj.setTitle.call(this.tabObj,title,index);
		}
	}
	
	
	module.exports = LynnLayout;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	(function(factory){
		if(typeof define==='function' && define.amd){
			define(['jquery'],factory);
		}else if(typeof exports=='object'&& typeof module =='object') {
			module.exports = factory(require('jquery'));
		}else {
			factory(jQuery);
		}
	})(function($,undefined){*/
	
		var $ = __webpack_require__(1);
		/**
		 * Tab切换
		 * @param {object} opts [配置信息]
		 * {
		 *  	
		 *  	container: 被包含的element,
		 *  	minItemWidth: 200,
		 *  	items: [	//这里面的格式可以自己定义，与formatItemTpl结合，最少要有一个title,每个tab所需要数据
		 *  		{title:xxx,
		 *  		sellPrice:buyPrice,
		 *  		}	
		 *  	]
		 *  	showRemove: true				//是否显示删除图标
		 *
		 * 		formatItemTpl: function(item){}    	//每个tab的展示形式
		 *  	onRemove:function(item,parent){}		//点击删除后的回调函数
		 *  	onRemoveError: function(){}
		 *  	onClick: function(index){}		//点击item时的回调函数
		 *  	onAdd: function(item)			//添加item完成后的回调函数  
		 *  	onAddError: function(){}  
		 * }
		 */
		
		function LynnTabs(opts){
			var defaults = {
				container: document.body,
				items: [],
				showRemove: true,
				formatItemTpl: function(item) {
					return '<span>'+item.title+'</span>';
				},
				minItemWidth:200,
				minTabCount:1,
				maxTabCount: 8,
			}
			$.extend(this,defaults,opts);
			this.init();
	
		}
	
		LynnTabs.prototype = {
			constructor: LynnTabs,
			init: function(){
				var me = this;
				this.container = $(this.container);
				this.container.addClass(LynnTabs.opts.containerCls);
				this.wrap = $('<div class="lynn-tab-wrap"></div>').appendTo(this.container);
				this.formatItems();
				this.computedWidth();
				var tabCls = LynnTabs.opts.tabCls;
				this.container.on('click','.'+tabCls, function(e){
					var itemData = this.item;
					var target = e.target;
					var index = $(this).index();
					if(target.className == LynnTabs.opts.removeIcon) {
						var removed = me.remove(index);
						removed&&me.onRemove && me.onRemove.call(target,index)
						return false;
					} else {
						var ret = me.setActive(index,this);
						if(ret!==false) {
							me.onClick && me.onClick.call(target,index);
						}
						
					}
				})
			},
			formatItems: function(){
				var items = this.items;
				if(!items.length) return false;
	 			var frag  = document.createDocumentFragment();
				for(var i=0,len = items.length;i<len; i++) {
					var item = items[i];
					var ele = this.formatItem(item);
					if(item.active&&this.activeIndex==void 0) {
						this.activeIndex = i;
						$(ele).addClass('active');
					}
					items[i].ele = ele;
					frag.appendChild(ele);
				}
				if(this.activeIndex==void 0) {
					this.activeIndex = 0;
					$(this.items[0].ele).addClass('active');
				}
				this.wrap.append(frag);
				this.checkIsOnlyOne();
			},
			formatItem: function(item){
				var itemTpl = this.formatItemTpl(item)||'';
				itemTpl = '<div class="lynn-item">'+itemTpl+'</div>';
				if(this.showRemove) {
					itemTpl += '<i class="'+LynnTabs.opts.removeIcon+'"></i>';
				}
				var tpl = '<a href="javascript:void(0)" class="'+LynnTabs.opts.tabCls+'">'+itemTpl+'</a>';
				var ele = $(tpl)[0];
				return ele;
			},
			indexOf: function(title){
				var items = this.items,exist = -1;
				var len = items.length;
				for(var i=0; i<len; i++) {
					var currTitle = items[i].title;
					if(currTitle==title) {
						exist = i;
						break;
					}
					if(i<len-1) {
						len = len-1;
						var lastTitle = items[len].title;
						if(lastTitle==title) {
							exist = len;
							break;
						}
					}
				}
				return exist;
			},
			add: function(item){
				if(!item.title) {
					return false
				}
				var len = this.items.length;
				if(len == this.maxTabCount) {
					this.onAddError&&this.onAddError.call(this);
					return false;
				}
				var indexOf = this.indexOf(item.title);
				if(indexOf==-1) {
					var ele = this.formatItem(item);
					if(item.active) {
						if(this.activeIndex!==void 0) {
							var activeEle = this.items[this.activeIndex].ele;
							$(activeEle).removeClass('active');
						}
						$(ele).addClass('active');
						this.activeIndex = len;
					}
					item.ele = ele;
					this.items.push(item);
					this.wrap.append(ele);
					this.computedWidth();
					this.checkIsOnlyOne();
					this.onAdd&&this.onAdd.call(this,item);
				}else {
					return false;
				}
			},
			remove: function(){
				if(this.items.length==this.minTabCount) {
					this.onRemoveError&&this.onRemoveError.call(this);
					return false;
				}
				var arg = arguments[0];
				var type = typeof arg,indexOf;
				switch(type) {
					case 'number':
						indexOf = arg;
					break;
					case 'string':
						indexOf = this.indexOf(arg);
					break;
					case 'object':
						var v = arg.title;
						indexOf = this.indexOf(v);
					break;
				}
				if(indexOf==void 0||indexOf==-1) {return false;}
				
				var item = this.items[indexOf];
				$(item.ele).remove();
				this.items.splice(indexOf,1);
				if(indexOf==this.activeIndex) {
					var maxIndex = this.items.length;
					if(indexOf==maxIndex) {
						this.activeIndex = maxIndex -1;
					}
					var activeEle = this.items[this.activeIndex].ele;
					$(activeEle).addClass('active');
				}
	
				this.checkIsOnlyOne();
				this.computedWidth();
				return true;
			},
			computedWidth: function(){
				var me = this;
				var maxWidth  = this.container.width();
				var tabs = this.wrap.find('.'+LynnTabs.opts.tabCls);
				var totalW = 0,activeWidth=0,count=0;
				tabs.each(function(i){
					count+=1;
					var width = $(this).data('w');
					if(!width) {
						width = $(this).outerWidth();
						$(this).data('w',width);
					}
					if(i==me.activeIndex) {
						activeWidth = width;
						count-=1;
					}
					totalW +=width;
					
				})
				if(totalW > maxWidth) {
					var avgWidth = Math.floor((maxWidth - activeWidth)/count);
					var activeWidth = maxWidth - avgWidth*count;
					tabs.each(function(i){
						var width = i!==me.activeIndex ? avgWidth: activeWidth;
						this.style.width = width+"px";
					})
					this.zoom = true;
				}else {
					if(this.zoom!==true) {return false;}
					tabs.each(function(){
						this.style.width = "";
					})
					this.zoom = false;
				}
			},
			setActive: function(index,target){
				var args = arguments,index;
				if(typeof args[0] =='number') {
					index = args[0];
					if(index<0||index>this.items.length) {
						return false;
					}
				}else if(typeof args[0]=='string') {
					index = this.indexOf(args[0]);
				}else {
					return false;
				}
				var cbFn = args[1]&&$.type(args[1])=='function' ? args[1] : null;
				if(index !== void 0 && index!==-1) {
					var item = this.items[index];
					ele = item.ele;
					if(index==this.activeIndex) {
						return false;
					}else {
						var activeEle = this.items[this.activeIndex].ele;
						$(activeEle).removeClass('active');
						this.activeIndex = index;
						$(ele).addClass('active');
						this.computedWidth();
					}
				}
			},
			setTitle: function(title,index) {
				var itemTpl = this.formatItemTpl(title) ||'';
				var item = $.extend(this.items[index],title);
				var tabEle = this.wrap.find('.'+LynnTabs.opts.tabCls+":eq("+index+")");
				tabEle.find('.lynn-item').html(itemTpl);
				tabEle[0].item = item;
			},
			checkIsOnlyOne: function(){
				var len = this.items.length;
				var ele = this.items[0].ele;
				if(len==1) {
					$(ele).find('.icon-close').hide();
				}else {
					$(ele).find('.icon-close').show();
				}
			},
			resize: function(){
				this.computedWidth();
			}
		}
	
		LynnTabs.opts = {
			containerCls: 'lynn-tabs',
			tabCls:'lynn-tab',
			removeIcon:'icon icon-close',
		}
	
		module.exports = LynnTabs;
	/*})*/


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	
	/**
	 * [LynnScrollbar description]
	 * @param {[object]} opts {
	 *   element:��Ҫscrollbar��Ԫ��
	 * }
	 */
	var noop = function(){};
	var defaults = {
		onScroll:noop,
		onUpdate:noop,
		duration:200,
		dir:'y',
	}
	var namespace = {index:0,name:'scrollbar'};
	function LynnScrollbar(opts){
		if(!opts.element) return false;
		$.extend(this,defaults,opts);
		this.element = $(this.element);
		this.element.addClass(LynnScrollbar.defaults.pluginCls);
		this.contentWrap = this.element.find('.'+LynnScrollbar.defaults.contentWrapCls) || this.element.find(':first-child').addClass(LynnScrollbar.defaults.contentWrapCls);
		this.namespace = '.' + namespace.name + "_" + namespace.index++;
		this.init();
	
	}
	
	LynnScrollbar.prototype = {
		init: function(){
			this.initScrollX();
			this.initScrollY();
			this.setSize();
		},
		initScrollX: function(){
			if(this.dir.indexOf('x')==-1) return false;
			var me = this;
			var position = this.contentWrap.position();
			var tpl = [
				'<div class="lynn-scrollbar-element scroll-x" style="bottom:0;left:'+position.left+'px;display:none">',
				'<div class="lynn-scrollbar-track"></div>',
				'<a href="javascript:void(0)" class="lynn-scrollbar-thumb"></a>',
				'</div>'
			].join('');
			this.scrollxWrap = $(tpl).appendTo(this.element);
	
			this.scrollxWrap.find('.lynn-scrollbar-thumb').on('mousedown'+me.namespace,function(e){
				var thumb = $(this);
				var x= e.pageX;
				var left = thumb.position().left, maxTop = me.clientWidth - $(this).height();
				var mouseMoveFn = throttle(function(e){
					var diff = e.pageX - x;
					var changeLeft = left+diff;
					changeLeft = Math.max(changeLeft,0);
					changeLeft = Math.min(changeLeft,maxLeft);
					if(changeLeft!=Left) {
						var scrollLeft = Math.ceil(changeLeft*me.scrollWidth/me.clientWidth);
						thumb.css('left',changeLeft);
						me.contentWrap.scrollLeft(scrollLeft);
					}
				})
				$(document).on('mousemove' + me.namespace, mouseMoveFn);
				return me.handleMouseDown(null,e);
				
			})
		},
		initScrollY: function(){
			if(this.dir.indexOf('y')==-1) return false;
			var me = this;
			var position = this.contentWrap.position();
			var tpl = [
				'<div class="lynn-scrollbar-element scroll-y" style="top:'+position.top+'px;right:0;display:none">',
				'<div class="lynn-scrollbar-track"></div>',
				'<a  href="javascript:void(0)" class="lynn-scrollbar-thumb"></a>',
				'</div>'
			].join('');
			this.scrollyWrap = $(tpl).appendTo(this.element);
	
			this.scrollyWrap.find('.lynn-scrollbar-thumb').on('mousedown'+me.namespace,function(e){
				var thumb = $(this);
				var y = e.pageY;
				var top = thumb.position().top, maxTop = me.clientHeight - $(this).height();
				var i=0;
				var mouseMoveFn = throttle(function(e){
					var diff = e.pageY - y;
					var changeTop = top+diff;
					changeTop = Math.max(changeTop,0);
					changeTop = Math.min(changeTop,maxTop);
					var scrollTop;
					if(changeTop==maxTop) {
						scrollTop = me.scrollHeight - me.clientHeight;
					}else {
						scrollTop = Math.ceil(changeTop*me.scrollHeight/me.clientHeight);
					}
					thumb.css('top',changeTop);
					me.contentWrap.scrollTop(scrollTop);
				},20)
				$(document).on('mousemove' + me.namespace, mouseMoveFn)
				
				return me.handleMouseDown(null,e);
				
			})
		},
		getScrollbarDoms: function(){
			var eles = {};
			if(this.scrollyWrap) {
				eles.y = this.scrollyWrap
			}
			if(this.scrollxWrap) {
				eles.x = this.scrollxWrap
			}
			return eles;
		},
		handleMouseDown: function(callback,event){
			var me = this, namespace = this.namespace;
			window.mouseMoveLocked = true;
			$('body').on('selectstart'+namespace,function(event) {
				event.preventDefault();
			})
			$(document).on('mouseup'+namespace,function(event){
				delete window.mouseMoveLocked
				$(document).add('body').off(namespace);
				callback&&callback();
			})
	
			event&&event.preventDefault();
			return false;
		},
	
		setSize: function(){
			var me = this;
			setTimeout(function(){
				resize.call(me);
			},2)
			function resize(){
				if(this.scrollyWrap) {
					var scrollHeight = this.contentWrap.prop('scrollHeight');
					var clientHeight = this.contentWrap.outerHeight();
					if(clientHeight < scrollHeight-5) {
						this.scrollHeight = scrollHeight;
						this.clientHeight = clientHeight;
	
						//�����߶�
						var thumbHeight = Math.ceil((clientHeight*clientHeight)/scrollHeight);
						//����scrollTopֵ
						var scrollTop = this.contentWrap.scrollTop();
						var top = Math.ceil(scrollTop*thumbHeight/scrollHeight);
						this.scrollyWrap.css({height:clientHeight}).find('.lynn-scrollbar-thumb').css({height:thumbHeight,top:top});
						this.scrollyWrap.show();
					}else {
						this.scrollyWrap.hide();
					}
				}
					
				if(this.scrollxWrap) {
					var scrollWidth = this.contentWrap.prop('scrollWidth');
					var clientWidth = this.contentWrap.outerWidth();
	
					if(clientWidth <scrollWidth-5) {
						this.scrollWidth = scrollWidth;
						this.clientWidth = clientWidth;
	
						var thumbWidth = (clientWidth*clientWidth)/scrollWidth;
						var scrollLeft = this.contentWrap.scrollLeft();
						var left = Math.ceil(scrollLeft*thumbWidth/scrollWidth);
						this.scrollxWrap.width(thumbWidth).find('.lynn-scrollbar-thumb').css({width:thumbWidth,top:top});
						this.scrollxWrap.show();
					}else {
						this.scrollxWrap.hide();
					}
				}
				
			}
	
		},
	}
	
	LynnScrollbar.defaults = {
		pluginCls:'lynn-scrollbar',
		contentWrapCls: 'lynn-scrollbar-content',
	}
	
	function throttle(fn,delay) {
	    var timer = null;
	    var t_start;
	    delay = delay||200;
	
	    return function() {
	        var context = this,t_curr = +new Date();
	        if(!t_start) {
	            t_start = t_curr;
	        }
	        var args = arguments;
	        if(t_curr - t_start <delay) {
	            clearTimeout(timer);
	            timer = setTimeout(function(){
	                fn.apply(context,args);
	            },delay)
	        }else {
	            fn.apply(context,args);
	            t_start = t_curr;
	        }
	        
	    }
	}
	
	module.exports = LynnScrollbar;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	/**
	 * [LynnSpinner description]
	 * @param {[type]} input [input元素]
	 * @param {[type]} opts  {
	 *  min: 最小值
	 *  step: 每次改变时候改变多少
	 *  max: 最大值
	 * }
	 */
	function LynnSpinner(input,opts){
		this.textField = $(input);
		this.opts = $.extend({
			min:1,
			step:1,
			max:Infinity
		},opts)
	
		this.init();
	
	}
	
	LynnSpinner.prototype = {
		constructor: LynnSpinner,
		init: function(){
			if(!this.textField) {
				throw new Error('没给input')
			}
			var container = $('<div class="lynn-spinner"></div>');
			this.textField.wrap(container);
			var btns = $('<span class="spinner-btn"><a href="javascritp:void(0);" class="increase"><i class="tgl-up"></i></a><a href="javascritp:void(0);" class="decrease"><i class="tgl-down"></i></a>').insertAfter(this.textField);
			
			this.textField.val(this.opts.min).addClass('spinner-input');
	
			var step = this.opts.step;
			var dotIndex = (step+"").indexOf('.');
			this.baseNum = 1;
			if(dotIndex!==-1) {
				var dotLength = (step+"").length - dotIndex -1;
				this.baseNum = Math.pow(10,dotLength*1);
			}
	
			var me  = this;
			this.textField.on('keyup',function(){
				var val = $(this).val();
				var v = me.valueChange.call(me,val);
				$(this).val(v);
				$(this).focus();
			})
			
			this.increaseBtn = btns.find('.increase').on('click',function(e){
				var ret = me.changeValue.call(me,1);
				if(ret){
					me.textField.focus();
				}
				return false;
			});
			this.decreaseBtn = btns.find('.decrease').on('click',function(e){
				var ret =me.changeValue.call(me,-1);
				if(ret){
					me.textField.focus();
				}
				return false;
			});
		},
		getVal: function(){
			return parseFloat(this.textField.val())||this.opts.min;
		},
		setVal: function(val){
			var v = this.valueChange(val);
			this.textField.val(v);
		},
		changeValue: function(delta){
			var value = this.getVal(),step = this.opts.step, min=this.opts.min, max = this.opts.max;
			if(delta<0&&value <= min) {
				return false;
			}
			if(delta>0&&value >=max) {
				return false;
			}
			value = Math.floor(value*this.baseNum);//1.11*100==111.000000000001
			var changeValue = delta*step*this.baseNum;
			var ret = (value+changeValue)/this.baseNum;
			if(ret>max) {
				ret = max
			}
			if(ret<min) {
				ret = min
			}
			this.textField.val(ret);
			return ret;
		},
		valueChange: function(v){
			var v =v.toString();
			var opts = this.opts,min = opts.min, max = opts.max;
			if(v.length==0) {
				return min;
			}
			var reg = /^\d+$/;
			if(this.baseNum!=1) {
				reg = /^(-?\d+)(\.\d*|\d+)$/;
			}
			if(!reg.test(v)){
				return parseFloat(v);
			}
			if(v < min) {
				return min;
			}
			if(v > max) {
				return max
			}
			var dotIndex = v.indexOf('.');
			if(this.baseNum==1||dotIndex==v.length-1){
				return v;
			}else {
				return Math.round(v*this.baseNum)/this.baseNum;
			}
			
		}
	}
	
	
	
	module.exports = LynnSpinner;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	/**
	 * opt{
	 * 		label: 'string' Or function(this.value)
	 * 		value: 'string' Or [],
	 * 		showGroup:true,										//是否显示group，目前还没写样式
	 * 		listCls:''											//自定义当前下拉列表的class名称
	 * 		items: string [指下拉出现的元素的id]				//生成下拉列表的数据
	 * 			   Array [ 	//生成item的datas
	 * 			   		{value:1,label:'这时是1',active:true,group:'default'},
	 * 			   		{value:1,label:'这里是2',group:2},
	 * 			   			
	 * 			   		{value:2,label:'这里是2',active:false}
	 * 			   ]
	 * 			   object {
	 * 			   		default:[{...},{....},{....}]
	 * 			   }
	 * 	     formatItemTpl: function({value:1,label:'这时是1',active:true}){return tpl}	//格式化item的展现形式,
	 * 	     itemClick: function(itemEle,item,e.target){}								//当选项点击时的回调函数
	 * 	     multiple: true 	//多选
	 * 	     width:100,			//下拉列表的宽度
	 * 	     labelWidth:80		//上面label宽度
	 * 	     footer:[
	 * 	     	{
		 * 	     	plugin:LynnSpinner,						//插件类名
		 * 	     	name:xxx, 								//如果有name，可以在this.plugins[xx]获取到这个值
		 * 	     	tpl:'<input type="text"></input>'		//对应的html
		 * 	     	options: {								//插件配置
		 * 	     		min:1,max:250,step:1
		 * 	     	}
	 * 	     	},
	 * 	     	{
	 * 	     		tpl:'<button class="addBtn">添加</button>',
	 * 	     		onClick:function(){}					//如果需要click，就需要填这个
	 * 	     	}
	 * 	     ],
	 * 	     onAdd:function(){}
	 * 	     	
	 * 	     
	 * }
	 */
	function LynnDropDown (wrap,opts){
		if(!wrap || !opts.label) {
			return false;
		}
		this.wrap = $(wrap);
		$.extend(this,{
			width:200,
			height: 150
		},opts);
		var dpListWrap = opts.dpListWrap || document.body;
		this.dpListWrap = $(dpListWrap);
		this.open  = false;
		this.groups = {};
		this.init();
	}
	
	
	LynnDropDown.prototype = {
		constructor: LynnDropDown,
		init: function(){
			var me = this;
			this.plugins = {};
			this.wrap.addClass('lynn-dropdown');
			var width=this.labelWidth ? 'style="width:'+this.labelWidth+'px"' :'';
			$('<div class="dp-label" '+width+'></div><a href="javascript:;" class="dp-toggle"><i class="tgl-up"></i></a>').appendTo(this.wrap);
			this.labelEle = this.wrap.find('.dp-label');
			this.toggleEle = this.wrap.find('.dp-toggle');
			this.initdpListEle();
			this.setLabel();
			this.initEvents();
			this.initFooter();
			LynnDropDown.default.list.push(this);
	
		},
	
		initdpListEle: function(){
			var items = this.items;
			var type = $.type(items);
			switch(type) {
				case 'string':
					this.dpListEle = $('#'+items).addClass(LynnDropDown.default.dpListCls).hide();
					this.getValueFromHtml();
					this.dpListEle.remove().appendTo(this.dpListWrap);
					break;
				case 'array':
					var ele = document.createElement('div');
					ele.style.width = this.width+"px";
					ele.style.display = 'none';
					ele.className = LynnDropDown.default.dpListCls;
					var frag = this.initArrayItems(this.items);
					ele.appendChild(frag);
					this.dpListEle = $(ele);
					this.dpListWrap.append(this.dpListEle);
					break;
			}
			if(!this.dpListEle) {
				throw new Error('没有生成下拉列表，请检查配置是否正确');
			}
			this.dpListEle.addClass(this.listCls);
		},
	
		getValueFromHtml: function(){
			var a = this.dpListEle.children('.lynn-dpitem');
			var me = this;
			var items = {}
			a.each(function(i,v){
				var value = $(this).data('v')||$(this).html();
				var group = $(this).data('group')||'default';
				var isActive = $(this).hasClass('active');
				if(!items[group]) {
					items[group] = [];
				}
	
				var item = {value:value,label:$(this).html(),active: isActive, group:group};
				this.item = item;
				item.ele = this;
				items[group].push(item);
				this.href="javascript:;"
				if(isActive) {
					if(me.multiple) {
						me.activedEle.push(this);
					}else {
						me.activedEle = this;
					}
				}
			})
		},
		initArrayItems: function(items) {
			var groups = {};
			for(var i=0,cur;cur = items[i++];) {
				if(!cur.group) cur.group = 'default';
				if(!groups[cur.group]) {
					groups[cur.group] = [];
				}
				cur.ele = this.getItemEle(cur);
				groups[cur.group].push(cur);
			}
			for(var g in groups) {
				groups[g] = groups[g].sort(function(a,b){
					var a = parseInt(a.value),b = parseInt(b.value);
					if(!isNaN(a)&&!isNaN(b)) {
						return a-b;
					}
				})
			}
	
			var frag = this.initObjectItems(groups);
			return frag;
		},
		initObjectItems: function(items) {
			this.items = items;
			this.count=0,groupIndex=0, frag = document.createDocumentFragment();
			for(var g in items) {
				if(groupIndex > 0) {
					var span = this.getGroupEel(g);
					frag.appendChild(span);
				}
	
				for(var j=0,e;e=items[g][j++];) {
					frag.appendChild(e.ele);
					this.count++;
				}
				groupIndex++;
			}
	
			if(this.activedEle) {
				var list  = this.activedEle;
				if(!this.multiple) {
					$(list).addClass('active');
				}else {
					for(var i=0,len = list.length;i<len;i++) {
						$(list[i]).addClass('active');
					}
				}
			}
			return frag;
		},
	
		getGroupEel: function(groupName){
			var span = document.createElement('span');
			span.className="separator";
			span.setAttribute('data-group',groupName);
			return span;
		},
	
		getItemEle: function(item) {
			var tpl = '';
			if($.type(this.formatItemTpl)=='function') {
				tpl = this.formatItemTpl(item);
			}else {
				var check = '';
				if(this.multiple) {
					var checked = '';
					if(item.active){
						checked = 'checked="checked"';
					}
					check = '<input type="checkbox" class="lynn-check" '+checked+'></input>'
				}
				var del = '';
				if(item.canDel) {
					del = '<i class="icon icon-recycle"></i>';
				}
				tpl = '<a href="javascript:;">'+check+item.label+del+'</a>';
			}
			var ele = $(tpl).addClass('lynn-dpitem')[0];
			ele.item = item;
			if(item.active) {
				if(!this.multiple) {
					this.activedEle = ele;
				}else {
					this.activedEle = this.activedEle||[];
					this.activedEle.push(ele);
				}
			}
			return ele;
		},	
	
		initEvents: function(){
			var me = this;
			this.toggleEle.on('click.dp', function(e){
				me.toggle.call(me)
			})
			this.dpListEle.on('click.dp','> .lynn-dpitem',function(e){
				e.stopPropagation();
				var item = this.item;
				var target = e.target;
	
				var isActive = item.active;
				var del = $(target).is('.icon-recycle');
				var obj={show:!isActive};
				if(del) {
					obj = {delete:true};
				}
				obj = $.extend(obj,item);
				
				
				if(del) {
					me.deleteItem(item);
				}else {
					changeStatus.call(this,isActive,e);
					me.setLabel();
				}
				
				if(!me.multiple) {
					me.toggle();
				}
				me.itemClick&&me.itemClick.call(this,obj,me);
				
			})
	
			function changeStatus(isActive,e){
				if(me.multiple) {
					var fn  = isActive ? 'removeClass' : 'addClass';
					$(this)[fn]('active');
					if(isActive) {
						var index = me.activedEle.indexOf(this);
						if(index) {
							me.activedEle.splice(index+1,1);
						}
					}else {
						me.activedEle.push(this);
					}
					$(this).find('input').prop('checked',!isActive);
					this.item.active = !isActive;
				}else {
					if(me.activedEle) {
						var currItem = this;
						if(me.activedEle==currItem) {
							e.stopPropagation();
							return false;
						}
						$(me.activedEle).removeClass('active');
						me.activedEle.item.active = false;
					}
					me.activedEle = $(this).addClass('active')[0];
					me.activedEle.item.active = true;
				}
			}
		},
	
		setActiveByItem: function(item){
			if(!this.multiple) {
				if(this.activedEle&&item.value==this.activedEle.item.value) {
					return false;
				}
				if(!item.ele) {
					if(!item.group) item.group = 'default';
					
					var indexInfo = this.indexOf(item);
					if(indexInfo.index==-1) {
						return false;
					}
					item = this.items[item.group][indexInfo.index];
				}
				var ele = item.ele;
				if(this.activedEle) {
					if(ele==this.activedEle) {
						return false;
					}
					$(this.activedEle).removeClass('active');
					this.activedEle.item.active = false;
				}
				$(ele).addClass('active');
				item.active = true;
				this.activedEle = ele;
				this.setLabel();
				return true;
			}else {
				this.activedEle = null;
				var items = item,frag;
				if($.type(items)=='array') {
					frag = this.initArrayItems(items);
				}else {
					frag = this.initObjectItems(items);
				}
				var wrap = this.dpListEle;
				if(this.footerEle) {
					this.footerEle.siblings().remove();
					$(frag).insertBefore(this.footerEle);
				}else {
					wrap.html('').append(frag);
				}
				
				this.setLabel();
			}
		},
	
		initFooter: function(){
			var me  = this;
			if(!this.footer) {
				return false;
			}	
			this.footerEle = $('<div class="lynn-dp-footer"></div>')
			if(this.footer&&$.type(this.footer)=='array') {
				for(var i=0,len = this.footer.length; i<len; i++) {
					var curr = this.footer[i];
					if(!curr.tpl) {
						continue;
					}
					var currNode = $(curr.tpl);
					this.footerEle.append(currNode);
					if(curr.plugin) {
						var PluginObj = curr.plugin;
						var obj = new PluginObj(currNode,curr.options);
						if(curr.name) {
							this.plugins[curr.name] = obj;
						}
					}
					if(curr.init&&$.type(curr.init) =='function'){
						var ret = curr.init.call(currNode,curr,me);
						if(curr.name) {
							this.plugins[curr.name] = ret;
						}
					}
					if(curr.onClick) {
						currNode.on('click',function(e){
							curr.onClick.call(this,me,e);
						});
					}
					
				}
			}
	
			this.dpListEle.append(this.footerEle);
		},
	
		setLabel: function(){
			var label = this.label,title='';
			if($.type(label)=='string') {
				v= label
			}else if($.type(label)=='function') {
				v = label.call(this,this.activedEle);
			}
	
			this.labelEle.html(v);
		},
	
		toggle: function(){
			if(!this.open) {
				this.wrap.addClass('open');
				var pos = this.getPosition();
				this.dpListEle.css({
					top: pos.top,
					left: pos.left
				});
				this.dpListEle.show();
			} else {
				this.wrap.removeClass('open');
				this.dpListEle.hide();
			}
			this.open = !this.open;
		},
	
		getPosition: function(){
			var offset = this.wrap.offset();
			var width = this.wrap.outerWidth();
			var height = this.wrap.outerHeight();
			var left = offset.left + width, top = offset.top + height+1;
			if(left < this.width) {
				left = offset.left;
			}else {
				left = left - this.width;
			}
	
			return {left: left, top: top};
	
		},
	
		indexOf: function(item,isInAllItemsIndex){
			var group = item.group||'default';
			var value = item.value,groupIndex, index = -1,gtIndex=-1;
	
			if(this.items[group]) {
				for(var i=0,cur;cur=this.items[group][i++];) {
					if(value > cur.value) {
						gtIndex = i-1;
					}
					if(cur.value==value) {
						index = i-1;
						break;
					}
	
				}
			}
			var groupIndex = 0;
			if(isInAllItemsIndex) {
				for(var g in this.items) {
					if(g==group) {
						break;
					}
					groupIndex +=this.items[g].length;
				}
			}
			
			return {index: index,groupIndex: groupIndex,gtIndex:gtIndex};
		},
	
		addItem: function(item) {
			var group = item.group = item.group||'default';
			var indexInfo = this.indexOf(item,true);
			if(indexInfo.index!==-1) return false;
			var frag = document.createDocumentFragment();
			if(!this.items[group]) {
				var span = this.getGroupEel(item.group);
				frag.appendChild(span);
			}
			
			var ele = this.getItemEle(item);
			item.ele = ele;
			var maxCount = this.maxCount,del;
			if(maxCount&&this.count>=maxCount) {
				this.onError&&this.onError.call(this,'error','最多只能添加'+maxCount+'项');
				return false;
			}
			var gtIndex = indexInfo.gtIndex;
			this.items[group] = this.items[group]||[];
			this.items[group].splice(gtIndex+1,0,item);
			frag.appendChild(ele);
			var groupIndex = indexInfo.groupIndex,baseEle;
	
			
			var i = groupIndex+gtIndex;
			baseEle = this.dpListEle.find('.lynn-dpitem:eq('+i+')');
			if(gtIndex==-1) {
				var nextSpan = baseEle.next();
				if(nextSpan.data('group')==group) {
					baseEle = nextSpan;
				}
			}
			$(frag).insertAfter(baseEle);
			
			this.count++;
			return true;		
		},
	
		deleteItem: function(item) {
			var indexInfo = this.indexOf(item);
			if(indexInfo.index!==-1) {
				var ele = $(item.ele);
				this.items[item.group].splice(indexInfo.index,1);
				if(this.items[item.group].length==0) {
					ele.prev().remove();
					delete this.items[item.group];
				}
				if(ele==this.activedEle) {
					this.activedEle = null;
				}
				ele.remove();
				this.count--;
				
			}
		}
	};
	
	LynnDropDown.default = {
		dpListCls : 'lynn-dplist',
		list:[]
	}
	
	$(document).on('click.dp',function(e){
		var list = LynnDropDown.default.list;
		var target = e.target;
		for(var i=0,len=list.length;i<len;i++) {
			var curr = list[i];
			if(!curr.open) {
				continue;
			}
			var isToggle = curr.toggleEle[0]==target||$.contains(curr.toggleEle[0],target);
			var isList = $.contains(curr.dpListEle[0],target);
			if(!isToggle&&!isList){
				curr.toggle();
			}
	
		}
	})
	
	module.exports = LynnDropDown;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Spectrum Colorpicker v1.8.0
	// https://github.com/bgrins/spectrum
	// Author: Brian Grinstead
	// License: MIT
	
	(function (factory) {
	    "use strict";
	
	    if (true) { // AMD
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    else if (typeof exports == "object" && typeof module == "object") { // CommonJS
	        module.exports = factory(require('jquery'));
	    }
	    else { // Browser
	        factory(jQuery);
	    }
	})(function($, undefined) {
	    "use strict";
	
	    var defaultOpts = {
	
	        // Callbacks
	        beforeShow: noop,
	        move: noop,
	        change: noop,
	        show: noop,
	        hide: noop,
	
	        // Options
	        color: false,
	        flat: false,
	        showInput: false,
	        allowEmpty: false,
	        showButtons: true,
	        clickoutFiresChange: true,
	        showInitial: false,
	        showPalette: false,
	        showPaletteOnly: false,
	        hideAfterPaletteSelect: false,
	        togglePaletteOnly: false,
	        showSelectionPalette: true,
	        localStorageKey: false,
	        appendTo: "body",
	        maxSelectionSize: 7,
	        cancelText: "cancel",
	        chooseText: "choose",
	        togglePaletteMoreText: "more",
	        togglePaletteLessText: "less",
	        clearText: "Clear Color Selection",
	        noColorSelectedText: "No Color Selected",
	        preferredFormat: false,
	        className: "", // Deprecated - use containerClassName and replacerClassName instead.
	        containerClassName: "",
	        replacerClassName: "",
	        showAlpha: false,
	        theme: "sp-light",
	        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
	        selectionPalette: [],
	        disabled: false,
	        offset: null
	    },
	    spectrums = [],
	    IE = !!/msie/i.exec( window.navigator.userAgent ),
	    rgbaSupport = (function() {
	        function contains( str, substr ) {
	            return !!~('' + str).indexOf(substr);
	        }
	
	        var elem = document.createElement('div');
	        var style = elem.style;
	        style.cssText = 'background-color:rgba(0,0,0,.5)';
	        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
	    })(),
	    replaceInput = [
	        "<div class='sp-replacer'>",
	            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
	            "<div class='sp-dd'>&#9660;</div>",
	        "</div>"
	    ].join(''),
	    markup = (function () {
	
	        // IE does not support gradients with multiple stops, so we need to simulate
	        //  that for the rainbow slider with 8 divs that each have a single gradient
	        var gradientFix = "";
	        if (IE) {
	            for (var i = 1; i <= 6; i++) {
	                gradientFix += "<div class='sp-" + i + "'></div>";
	            }
	        }
	
	        return [
	            "<div class='sp-container sp-hidden'>",
	                "<div class='sp-palette-container'>",
	                    "<div class='sp-palette sp-thumb sp-cf'></div>",
	                    "<div class='sp-palette-button-container sp-cf'>",
	                        "<button type='button' class='sp-palette-toggle'></button>",
	                    "</div>",
	                "</div>",
	                "<div class='sp-picker-container'>",
	                    "<div class='sp-top sp-cf'>",
	                        "<div class='sp-fill'></div>",
	                        "<div class='sp-top-inner'>",
	                            "<div class='sp-color'>",
	                                "<div class='sp-sat'>",
	                                    "<div class='sp-val'>",
	                                        "<div class='sp-dragger'></div>",
	                                    "</div>",
	                                "</div>",
	                            "</div>",
	                            "<div class='sp-clear sp-clear-display'>",
	                            "</div>",
	                            "<div class='sp-hue'>",
	                                "<div class='sp-slider'></div>",
	                                gradientFix,
	                            "</div>",
	                        "</div>",
	                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
	                    "</div>",
	                    "<div class='sp-input-container sp-cf'>",
	                        "<input class='sp-input' type='text' spellcheck='false'  />",
	                    "</div>",
	                    "<div class='sp-initial sp-thumb sp-cf'></div>",
	                    "<div class='sp-button-container sp-cf'>",
	                        "<a class='sp-cancel' href='#'></a>",
	                        "<button type='button' class='sp-choose'></button>",
	                    "</div>",
	                "</div>",
	            "</div>"
	        ].join("");
	    })();
	
	    function paletteTemplate (p, color, className, opts) {
	        var html = [];
	        for (var i = 0; i < p.length; i++) {
	            var current = p[i];
	            if(current) {
	                var tiny = tinycolor(current);
	                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
	                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
	                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
	                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
	                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
	            } else {
	                var cls = 'sp-clear-display';
	                html.push($('<div />')
	                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
	                        .attr('title', opts.noColorSelectedText)
	                    )
	                    .html()
	                );
	            }
	        }
	        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
	    }
	
	    function hideAll() {
	        for (var i = 0; i < spectrums.length; i++) {
	            if (spectrums[i]) {
	                spectrums[i].hide();
	            }
	        }
	    }
	
	    function instanceOptions(o, callbackContext) {
	        var opts = $.extend({}, defaultOpts, o);
	        opts.callbacks = {
	            'move': bind(opts.move, callbackContext),
	            'change': bind(opts.change, callbackContext),
	            'show': bind(opts.show, callbackContext),
	            'hide': bind(opts.hide, callbackContext),
	            'beforeShow': bind(opts.beforeShow, callbackContext)
	        };
	
	        return opts;
	    }
	
	    function spectrum(element, o) {
	
	        var opts = instanceOptions(o, element),
	            flat = opts.flat,
	            showSelectionPalette = opts.showSelectionPalette,
	            localStorageKey = opts.localStorageKey,
	            theme = opts.theme,
	            callbacks = opts.callbacks,
	            resize = throttle(reflow, 10),
	            visible = false,
	            isDragging = false,
	            dragWidth = 0,
	            dragHeight = 0,
	            dragHelperHeight = 0,
	            slideHeight = 0,
	            slideWidth = 0,
	            alphaWidth = 0,
	            alphaSlideHelperWidth = 0,
	            slideHelperHeight = 0,
	            currentHue = 0,
	            currentSaturation = 0,
	            currentValue = 0,
	            currentAlpha = 1,
	            palette = [],
	            paletteArray = [],
	            paletteLookup = {},
	            selectionPalette = opts.selectionPalette.slice(0),
	            maxSelectionSize = opts.maxSelectionSize,
	            draggingClass = "sp-dragging",
	            shiftMovementDirection = null;
	
	        var doc = element.ownerDocument,
	            body = doc.body,
	            boundElement = $(element),
	            disabled = false,
	            container = $(markup, doc).addClass(theme),
	            pickerContainer = container.find(".sp-picker-container"),
	            dragger = container.find(".sp-color"),
	            dragHelper = container.find(".sp-dragger"),
	            slider = container.find(".sp-hue"),
	            slideHelper = container.find(".sp-slider"),
	            alphaSliderInner = container.find(".sp-alpha-inner"),
	            alphaSlider = container.find(".sp-alpha"),
	            alphaSlideHelper = container.find(".sp-alpha-handle"),
	            textInput = container.find(".sp-input"),
	            paletteContainer = container.find(".sp-palette"),
	            initialColorContainer = container.find(".sp-initial"),
	            cancelButton = container.find(".sp-cancel"),
	            clearButton = container.find(".sp-clear"),
	            chooseButton = container.find(".sp-choose"),
	            toggleButton = container.find(".sp-palette-toggle"),
	            isInput = boundElement.is("input"),
	            isInputTypeColor = isInput && boundElement.attr("type") === "color" && inputTypeColorSupport(),
	            shouldReplace = isInput && !flat,
	            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
	            offsetElement = (shouldReplace) ? replacer : boundElement,
	            previewElement = replacer.find(".sp-preview-inner"),
	            initialColor = opts.color || (isInput && boundElement.val()),
	            colorOnShow = false,
	            currentPreferredFormat = opts.preferredFormat,
	            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
	            isEmpty = !initialColor,
	            allowEmpty = opts.allowEmpty && !isInputTypeColor;
	
	        function applyOptions() {
	
	            if (opts.showPaletteOnly) {
	                opts.showPalette = true;
	            }
	
	            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
	
	            if (opts.palette) {
	                palette = opts.palette.slice(0);
	                paletteArray = $.isArray(palette[0]) ? palette : [palette];
	                paletteLookup = {};
	                for (var i = 0; i < paletteArray.length; i++) {
	                    for (var j = 0; j < paletteArray[i].length; j++) {
	                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
	                        paletteLookup[rgb] = true;
	                    }
	                }
	            }
	
	            container.toggleClass("sp-flat", flat);
	            container.toggleClass("sp-input-disabled", !opts.showInput);
	            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
	            container.toggleClass("sp-clear-enabled", allowEmpty);
	            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
	            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
	            container.toggleClass("sp-palette-disabled", !opts.showPalette);
	            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
	            container.toggleClass("sp-initial-disabled", !opts.showInitial);
	            container.addClass(opts.className).addClass(opts.containerClassName);
	
	            reflow();
	        }
	
	        function initialize() {
	
	            if (IE) {
	                container.find("*:not(input)").attr("unselectable", "on");
	            }
	
	            applyOptions();
	
	            if (shouldReplace) {
	                boundElement.after(replacer).hide();
	            }
	
	            if (!allowEmpty) {
	                clearButton.hide();
	            }
	
	            if (flat) {
	                boundElement.after(container).hide();
	            }
	            else {
	
	                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
	                if (appendTo.length !== 1) {
	                    appendTo = $("body");
	                }
	
	                appendTo.append(container);
	            }
	
	            updateSelectionPaletteFromStorage();
	
	            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
	                if (!disabled) {
	                    toggle();
	                }
	
	                e.stopPropagation();
	
	                if (!$(e.target).is("input")) {
	                    e.preventDefault();
	                }
	            });
	
	            if(boundElement.is(":disabled") || (opts.disabled === true)) {
	                disable();
	            }
	
	            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
	            container.click(stopPropagation);
	
	            // Handle user typed input
	            textInput.change(setFromTextInput);
	            textInput.bind("paste", function () {
	                setTimeout(setFromTextInput, 1);
	            });
	            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });
	
	            cancelButton.text(opts.cancelText);
	            cancelButton.bind("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                revert();
	                hide();
	            });
	
	            clearButton.attr("title", opts.clearText);
	            clearButton.bind("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	                isEmpty = true;
	                move();
	
	                if(flat) {
	                    //for the flat style, this is a change event
	                    updateOriginalInput(true);
	                }
	            });
	
	            chooseButton.text(opts.chooseText);
	            chooseButton.bind("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	
	                if (IE && textInput.is(":focus")) {
	                    textInput.trigger('change');
	                }
	
	                if (isValid()) {
	                    updateOriginalInput(true);
	                    hide();
	                }
	            });
	
	            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
	            toggleButton.bind("click.spectrum", function (e) {
	                e.stopPropagation();
	                e.preventDefault();
	
	                opts.showPaletteOnly = !opts.showPaletteOnly;
	
	                // To make sure the Picker area is drawn on the right, next to the
	                // Palette area (and not below the palette), first move the Palette
	                // to the left to make space for the picker, plus 5px extra.
	                // The 'applyOptions' function puts the whole container back into place
	                // and takes care of the button-text and the sp-palette-only CSS class.
	                if (!opts.showPaletteOnly && !flat) {
	                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
	                }
	                applyOptions();
	            });
	
	            draggable(alphaSlider, function (dragX, dragY, e) {
	                currentAlpha = (dragX / alphaWidth);
	                isEmpty = false;
	                if (e.shiftKey) {
	                    currentAlpha = Math.round(currentAlpha * 10) / 10;
	                }
	
	                move();
	            }, dragStart, dragStop);
	
	            draggable(slider, function (dragX, dragY) {
	                currentHue = parseFloat(dragY / slideHeight);
	                isEmpty = false;
	                if (!opts.showAlpha) {
	                    currentAlpha = 1;
	                }
	                move();
	            }, dragStart, dragStop);
	
	            draggable(dragger, function (dragX, dragY, e) {
	
	                // shift+drag should snap the movement to either the x or y axis.
	                if (!e.shiftKey) {
	                    shiftMovementDirection = null;
	                }
	                else if (!shiftMovementDirection) {
	                    var oldDragX = currentSaturation * dragWidth;
	                    var oldDragY = dragHeight - (currentValue * dragHeight);
	                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);
	
	                    shiftMovementDirection = furtherFromX ? "x" : "y";
	                }
	
	                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
	                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";
	
	                if (setSaturation) {
	                    currentSaturation = parseFloat(dragX / dragWidth);
	                }
	                if (setValue) {
	                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
	                }
	
	                isEmpty = false;
	                if (!opts.showAlpha) {
	                    currentAlpha = 1;
	                }
	
	                move();
	
	            }, dragStart, dragStop);
	
	            if (!!initialColor) {
	                set(initialColor);
	
	                // In case color was black - update the preview UI and set the format
	                // since the set function will not run (default color is black).
	                updateUI();
	                currentPreferredFormat = opts.preferredFormat || tinycolor(initialColor).format;
	
	                addColorToSelectionPalette(initialColor);
	            }
	            else {
	                updateUI();
	            }
	
	            if (flat) {
	                show();
	            }
	
	            function paletteElementClick(e) {
	                if (e.data && e.data.ignore) {
	                    set($(e.target).closest(".sp-thumb-el").data("color"));
	                    move();
	                }
	                else {
	                    set($(e.target).closest(".sp-thumb-el").data("color"));
	                    move();
	                    updateOriginalInput(true);
	                    if (opts.hideAfterPaletteSelect) {
	                      hide();
	                    }
	                }
	
	                return false;
	            }
	
	            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
	            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
	            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
	        }
	
	        function updateSelectionPaletteFromStorage() {
	
	            if (localStorageKey && window.localStorage) {
	
	                // Migrate old palettes over to new format.  May want to remove this eventually.
	                try {
	                    var oldPalette = window.localStorage[localStorageKey].split(",#");
	                    if (oldPalette.length > 1) {
	                        delete window.localStorage[localStorageKey];
	                        $.each(oldPalette, function(i, c) {
	                             addColorToSelectionPalette(c);
	                        });
	                    }
	                }
	                catch(e) { }
	
	                try {
	                    selectionPalette = window.localStorage[localStorageKey].split(";");
	                }
	                catch (e) { }
	            }
	        }
	
	        function addColorToSelectionPalette(color) {
	            if (showSelectionPalette) {
	                var rgb = tinycolor(color).toRgbString();
	                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
	                    selectionPalette.push(rgb);
	                    while(selectionPalette.length > maxSelectionSize) {
	                        selectionPalette.shift();
	                    }
	                }
	
	                if (localStorageKey && window.localStorage) {
	                    try {
	                        window.localStorage[localStorageKey] = selectionPalette.join(";");
	                    }
	                    catch(e) { }
	                }
	            }
	        }
	
	        function getUniqueSelectionPalette() {
	            var unique = [];
	            if (opts.showPalette) {
	                for (var i = 0; i < selectionPalette.length; i++) {
	                    var rgb = tinycolor(selectionPalette[i]).toRgbString();
	
	                    if (!paletteLookup[rgb]) {
	                        unique.push(selectionPalette[i]);
	                    }
	                }
	            }
	
	            return unique.reverse().slice(0, opts.maxSelectionSize);
	        }
	
	        function drawPalette() {
	
	            var currentColor = get();
	
	            var html = $.map(paletteArray, function (palette, i) {
	                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
	            });
	
	            updateSelectionPaletteFromStorage();
	
	            if (selectionPalette) {
	                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
	            }
	
	            paletteContainer.html(html.join(""));
	        }
	
	        function drawInitial() {
	            if (opts.showInitial) {
	                var initial = colorOnShow;
	                var current = get();
	                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
	            }
	        }
	
	        function dragStart() {
	            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
	                reflow();
	            }
	            isDragging = true;
	            container.addClass(draggingClass);
	            shiftMovementDirection = null;
	            boundElement.trigger('dragstart.spectrum', [ get() ]);
	        }
	
	        function dragStop() {
	            isDragging = false;
	            container.removeClass(draggingClass);
	            boundElement.trigger('dragstop.spectrum', [ get() ]);
	        }
	
	        function setFromTextInput() {
	
	            var value = textInput.val();
	
	            if ((value === null || value === "") && allowEmpty) {
	                set(null);
	                updateOriginalInput(true);
	            }
	            else {
	                var tiny = tinycolor(value);
	                if (tiny.isValid()) {
	                    set(tiny);
	                    updateOriginalInput(true);
	                }
	                else {
	                    textInput.addClass("sp-validation-error");
	                }
	            }
	        }
	
	        function toggle() {
	            if (visible) {
	                hide();
	            }
	            else {
	                show();
	            }
	        }
	
	        function show() {
	            var event = $.Event('beforeShow.spectrum');
	
	            if (visible) {
	                reflow();
	                return;
	            }
	
	            boundElement.trigger(event, [ get() ]);
	
	            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
	                return;
	            }
	
	            hideAll();
	            visible = true;
	
	            $(doc).bind("keydown.spectrum", onkeydown);
	            $(doc).bind("click.spectrum", clickout);
	            $(window).bind("resize.spectrum", resize);
	            replacer.addClass("sp-active");
	            container.removeClass("sp-hidden");
	
	            reflow();
	            updateUI();
	
	            colorOnShow = get();
	
	            drawInitial();
	            callbacks.show(colorOnShow);
	            boundElement.trigger('show.spectrum', [ colorOnShow ]);
	        }
	
	        function onkeydown(e) {
	            // Close on ESC
	            if (e.keyCode === 27) {
	                hide();
	            }
	        }
	
	        function clickout(e) {
	            // Return on right click.
	            if (e.button == 2) { return; }
	
	            // If a drag event was happening during the mouseup, don't hide
	            // on click.
	            if (isDragging) { return; }
	
	            if (clickoutFiresChange) {
	                updateOriginalInput(true);
	            }
	            else {
	                revert();
	            }
	            hide();
	        }
	
	        function hide() {
	            // Return if hiding is unnecessary
	            if (!visible || flat) { return; }
	            visible = false;
	
	            $(doc).unbind("keydown.spectrum", onkeydown);
	            $(doc).unbind("click.spectrum", clickout);
	            $(window).unbind("resize.spectrum", resize);
	
	            replacer.removeClass("sp-active");
	            container.addClass("sp-hidden");
	
	            callbacks.hide(get());
	            boundElement.trigger('hide.spectrum', [ get() ]);
	        }
	
	        function revert() {
	            set(colorOnShow, true);
	        }
	
	        function set(color, ignoreFormatChange) {
	            if (tinycolor.equals(color, get())) {
	                // Update UI just in case a validation error needs
	                // to be cleared.
	                updateUI();
	                return;
	            }
	
	            var newColor, newHsv;
	            if (!color && allowEmpty) {
	                isEmpty = true;
	            } else {
	                isEmpty = false;
	                newColor = tinycolor(color);
	                newHsv = newColor.toHsv();
	
	                currentHue = (newHsv.h % 360) / 360;
	                currentSaturation = newHsv.s;
	                currentValue = newHsv.v;
	                currentAlpha = newHsv.a;
	            }
	            updateUI();
	
	            if (newColor && newColor.isValid() && !ignoreFormatChange) {
	                currentPreferredFormat = opts.preferredFormat || newColor.getFormat();
	            }
	        }
	
	        function get(opts) {
	            opts = opts || { };
	
	            if (allowEmpty && isEmpty) {
	                return null;
	            }
	
	            return tinycolor.fromRatio({
	                h: currentHue,
	                s: currentSaturation,
	                v: currentValue,
	                a: Math.round(currentAlpha * 100) / 100
	            }, { format: opts.format || currentPreferredFormat });
	        }
	
	        function isValid() {
	            return !textInput.hasClass("sp-validation-error");
	        }
	
	        function move() {
	            updateUI();
	
	            callbacks.move(get());
	            boundElement.trigger('move.spectrum', [ get() ]);
	        }
	
	        function updateUI() {
	
	            textInput.removeClass("sp-validation-error");
	
	            updateHelperLocations();
	
	            // Update dragger background color (gradients take care of saturation and value).
	            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
	            dragger.css("background-color", flatColor.toHexString());
	
	            // Get a format that alpha will be included in (hex and names ignore alpha)
	            var format = currentPreferredFormat;
	            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
	                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
	                    format = "rgb";
	                }
	            }
	
	            var realColor = get({ format: format }),
	                displayColor = '';
	
	             //reset background info for preview element
	            previewElement.removeClass("sp-clear-display");
	            previewElement.css('background-color', 'transparent');
	
	            if (!realColor && allowEmpty) {
	                // Update the replaced elements background with icon indicating no color selection
	                previewElement.addClass("sp-clear-display");
	            }
	            else {
	                var realHex = realColor.toHexString(),
	                    realRgb = realColor.toRgbString();
	
	                // Update the replaced elements background color (with actual selected color)
	                if (rgbaSupport || realColor.alpha === 1) {
	                    previewElement.css("background-color", realRgb);
	                }
	                else {
	                    previewElement.css("background-color", "transparent");
	                    previewElement.css("filter", realColor.toFilter());
	                }
	
	                if (opts.showAlpha) {
	                    var rgb = realColor.toRgb();
	                    rgb.a = 0;
	                    var realAlpha = tinycolor(rgb).toRgbString();
	                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";
	
	                    if (IE) {
	                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
	                    }
	                    else {
	                        alphaSliderInner.css("background", "-webkit-" + gradient);
	                        alphaSliderInner.css("background", "-moz-" + gradient);
	                        alphaSliderInner.css("background", "-ms-" + gradient);
	                        // Use current syntax gradient on unprefixed property.
	                        alphaSliderInner.css("background",
	                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
	                    }
	                }
	
	                displayColor = realColor.toString(format);
	            }
	
	            // Update the text entry input as it changes happen
	            if (opts.showInput) {
	                textInput.val(displayColor);
	            }
	
	            if (opts.showPalette) {
	                drawPalette();
	            }
	
	            drawInitial();
	        }
	
	        function updateHelperLocations() {
	            var s = currentSaturation;
	            var v = currentValue;
	
	            if(allowEmpty && isEmpty) {
	                //if selected color is empty, hide the helpers
	                alphaSlideHelper.hide();
	                slideHelper.hide();
	                dragHelper.hide();
	            }
	            else {
	                //make sure helpers are visible
	                alphaSlideHelper.show();
	                slideHelper.show();
	                dragHelper.show();
	
	                // Where to show the little circle in that displays your current selected color
	                var dragX = s * dragWidth;
	                var dragY = dragHeight - (v * dragHeight);
	                dragX = Math.max(
	                    -dragHelperHeight,
	                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
	                );
	                dragY = Math.max(
	                    -dragHelperHeight,
	                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
	                );
	                dragHelper.css({
	                    "top": dragY + "px",
	                    "left": dragX + "px"
	                });
	
	                var alphaX = currentAlpha * alphaWidth;
	                alphaSlideHelper.css({
	                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
	                });
	
	                // Where to show the bar that displays your current selected hue
	                var slideY = (currentHue) * slideHeight;
	                slideHelper.css({
	                    "top": (slideY - slideHelperHeight) + "px"
	                });
	            }
	        }
	
	        function updateOriginalInput(fireCallback) {
	            var color = get(),
	                displayColor = '',
	                hasChanged = !tinycolor.equals(color, colorOnShow);
	
	            if (color) {
	                displayColor = color.toString(currentPreferredFormat);
	                // Update the selection palette with the current color
	                addColorToSelectionPalette(color);
	            }
	
	            if (isInput) {
	                boundElement.val(displayColor);
	            }
	
	            if (fireCallback && hasChanged) {
	                callbacks.change(color);
	                boundElement.trigger('change', [ color ]);
	            }
	        }
	
	        function reflow() {
	            if (!visible) {
	                return; // Calculations would be useless and wouldn't be reliable anyways
	            }
	            dragWidth = dragger.width();
	            dragHeight = dragger.height();
	            dragHelperHeight = dragHelper.height();
	            slideWidth = slider.width();
	            slideHeight = slider.height();
	            slideHelperHeight = slideHelper.height();
	            alphaWidth = alphaSlider.width();
	            alphaSlideHelperWidth = alphaSlideHelper.width();
	
	            if (!flat) {
	                container.css("position", "absolute");
	                if (opts.offset) {
	                    container.offset(opts.offset);
	                } else {
	                    container.offset(getOffset(container, offsetElement));
	                }
	            }
	
	            updateHelperLocations();
	
	            if (opts.showPalette) {
	                drawPalette();
	            }
	
	            boundElement.trigger('reflow.spectrum');
	        }
	
	        function destroy() {
	            boundElement.show();
	            offsetElement.unbind("click.spectrum touchstart.spectrum");
	            container.remove();
	            replacer.remove();
	            spectrums[spect.id] = null;
	        }
	
	        function option(optionName, optionValue) {
	            if (optionName === undefined) {
	                return $.extend({}, opts);
	            }
	            if (optionValue === undefined) {
	                return opts[optionName];
	            }
	
	            opts[optionName] = optionValue;
	
	            if (optionName === "preferredFormat") {
	                currentPreferredFormat = opts.preferredFormat;
	            }
	            applyOptions();
	        }
	
	        function enable() {
	            disabled = false;
	            boundElement.attr("disabled", false);
	            offsetElement.removeClass("sp-disabled");
	        }
	
	        function disable() {
	            hide();
	            disabled = true;
	            boundElement.attr("disabled", true);
	            offsetElement.addClass("sp-disabled");
	        }
	
	        function setOffset(coord) {
	            opts.offset = coord;
	            reflow();
	        }
	
	        initialize();
	
	        var spect = {
	            show: show,
	            hide: hide,
	            toggle: toggle,
	            reflow: reflow,
	            option: option,
	            enable: enable,
	            disable: disable,
	            offset: setOffset,
	            set: function (c) {
	                set(c);
	                updateOriginalInput();
	            },
	            get: get,
	            destroy: destroy,
	            container: container
	        };
	
	        spect.id = spectrums.push(spect) - 1;
	
	        return spect;
	    }
	
	    /**
	    * checkOffset - get the offset below/above and left/right element depending on screen position
	    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
	    */
	    function getOffset(picker, input) {
	        var extraY = 0;
	        var dpWidth = picker.outerWidth();
	        var dpHeight = picker.outerHeight();
	        var inputHeight = input.outerHeight();
	        var doc = picker[0].ownerDocument;
	        var docElem = doc.documentElement;
	        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
	        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
	        var offset = input.offset();
	        offset.top += inputHeight;
	
	        offset.left -=
	            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
	            Math.abs(offset.left + dpWidth - viewWidth) : 0);
	
	        offset.top -=
	            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
	            Math.abs(dpHeight + inputHeight - extraY) : extraY));
	
	        return offset;
	    }
	
	    /**
	    * noop - do nothing
	    */
	    function noop() {
	
	    }
	
	    /**
	    * stopPropagation - makes the code only doing this a little easier to read in line
	    */
	    function stopPropagation(e) {
	        e.stopPropagation();
	    }
	
	    /**
	    * Create a function bound to a given object
	    * Thanks to underscore.js
	    */
	    function bind(func, obj) {
	        var slice = Array.prototype.slice;
	        var args = slice.call(arguments, 2);
	        return function () {
	            return func.apply(obj, args.concat(slice.call(arguments)));
	        };
	    }
	
	    /**
	    * Lightweight drag helper.  Handles containment within the element, so that
	    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
	    */
	    function draggable(element, onmove, onstart, onstop) {
	        onmove = onmove || function () { };
	        onstart = onstart || function () { };
	        onstop = onstop || function () { };
	        var doc = document;
	        var dragging = false;
	        var offset = {};
	        var maxHeight = 0;
	        var maxWidth = 0;
	        var hasTouch = ('ontouchstart' in window);
	
	        var duringDragEvents = {};
	        duringDragEvents["selectstart"] = prevent;
	        duringDragEvents["dragstart"] = prevent;
	        duringDragEvents["touchmove mousemove"] = move;
	        duringDragEvents["touchend mouseup"] = stop;
	
	        function prevent(e) {
	            if (e.stopPropagation) {
	                e.stopPropagation();
	            }
	            if (e.preventDefault) {
	                e.preventDefault();
	            }
	            e.returnValue = false;
	        }
	
	        function move(e) {
	            if (dragging) {
	                // Mouseup happened outside of window
	                if (IE && doc.documentMode < 9 && !e.button) {
	                    return stop();
	                }
	
	                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0];
	                var pageX = t0 && t0.pageX || e.pageX;
	                var pageY = t0 && t0.pageY || e.pageY;
	
	                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
	                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));
	
	                if (hasTouch) {
	                    // Stop scrolling in iOS
	                    prevent(e);
	                }
	
	                onmove.apply(element, [dragX, dragY, e]);
	            }
	        }
	
	        function start(e) {
	            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
	
	            if (!rightclick && !dragging) {
	                if (onstart.apply(element, arguments) !== false) {
	                    dragging = true;
	                    maxHeight = $(element).height();
	                    maxWidth = $(element).width();
	                    offset = $(element).offset();
	
	                    $(doc).bind(duringDragEvents);
	                    $(doc.body).addClass("sp-dragging");
	
	                    move(e);
	
	                    prevent(e);
	                }
	            }
	        }
	
	        function stop() {
	            if (dragging) {
	                $(doc).unbind(duringDragEvents);
	                $(doc.body).removeClass("sp-dragging");
	
	                // Wait a tick before notifying observers to allow the click event
	                // to fire in Chrome.
	                setTimeout(function() {
	                    onstop.apply(element, arguments);
	                }, 0);
	            }
	            dragging = false;
	        }
	
	        $(element).bind("touchstart mousedown", start);
	    }
	
	    function throttle(func, wait, debounce) {
	        var timeout;
	        return function () {
	            var context = this, args = arguments;
	            var throttler = function () {
	                timeout = null;
	                func.apply(context, args);
	            };
	            if (debounce) clearTimeout(timeout);
	            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
	        };
	    }
	
	    function inputTypeColorSupport() {
	        return $.fn.spectrum.inputTypeColorSupport();
	    }
	
	    /**
	    * Define a jQuery plugin
	    */
	    var dataID = "spectrum.id";
	    $.fn.spectrum = function (opts, extra) {
	
	        if (typeof opts == "string") {
	
	            var returnValue = this;
	            var args = Array.prototype.slice.call( arguments, 1 );
	
	            this.each(function () {
	                var spect = spectrums[$(this).data(dataID)];
	                if (spect) {
	                    var method = spect[opts];
	                    if (!method) {
	                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
	                    }
	
	                    if (opts == "get") {
	                        returnValue = spect.get();
	                    }
	                    else if (opts == "container") {
	                        returnValue = spect.container;
	                    }
	                    else if (opts == "option") {
	                        returnValue = spect.option.apply(spect, args);
	                    }
	                    else if (opts == "destroy") {
	                        spect.destroy();
	                        $(this).removeData(dataID);
	                    }
	                    else {
	                        method.apply(spect, args);
	                    }
	                }
	            });
	
	            return returnValue;
	        }
	
	        // Initializing a new instance of spectrum
	        return this.spectrum("destroy").each(function () {
	            var options = $.extend({}, opts, $(this).data());
	            var spect = spectrum(this, options);
	            $(this).data(dataID, spect.id);
	        });
	    };
	
	    $.fn.spectrum.load = true;
	    $.fn.spectrum.loadOpts = {};
	    $.fn.spectrum.draggable = draggable;
	    $.fn.spectrum.defaults = defaultOpts;
	    $.fn.spectrum.inputTypeColorSupport = function inputTypeColorSupport() {
	        if (typeof inputTypeColorSupport._cachedResult === "undefined") {
	            var colorInput = $("<input type='color'/>")[0]; // if color element is supported, value will default to not null
	            inputTypeColorSupport._cachedResult = colorInput.type === "color" && colorInput.value !== "";
	        }
	        return inputTypeColorSupport._cachedResult;
	    };
	
	    $.spectrum = { };
	    $.spectrum.localization = { };
	    $.spectrum.palettes = { };
	
	    $.fn.spectrum.processNativeColorInputs = function () {
	        var colorInputs = $("input[type=color]");
	        if (colorInputs.length && !inputTypeColorSupport()) {
	            colorInputs.spectrum({
	                preferredFormat: "hex6"
	            });
	        }
	    };
	
	    // TinyColor v1.1.2
	    // https://github.com/bgrins/TinyColor
	    // Brian Grinstead, MIT License
	
	    (function() {
	
	    var trimLeft = /^[\s,#]+/,
	        trimRight = /\s+$/,
	        tinyCounter = 0,
	        math = Math,
	        mathRound = math.round,
	        mathMin = math.min,
	        mathMax = math.max,
	        mathRandom = math.random;
	
	    var tinycolor = function(color, opts) {
	
	        color = (color) ? color : '';
	        opts = opts || { };
	
	        // If input is already a tinycolor, return itself
	        if (color instanceof tinycolor) {
	           return color;
	        }
	        // If we are called as a function, call using new instead
	        if (!(this instanceof tinycolor)) {
	            return new tinycolor(color, opts);
	        }
	
	        var rgb = inputToRGB(color);
	        this._originalInput = color,
	        this._r = rgb.r,
	        this._g = rgb.g,
	        this._b = rgb.b,
	        this._a = rgb.a,
	        this._roundA = mathRound(100*this._a) / 100,
	        this._format = opts.format || rgb.format;
	        this._gradientType = opts.gradientType;
	
	        // Don't let the range of [0,255] come back in [0,1].
	        // Potentially lose a little bit of precision here, but will fix issues where
	        // .5 gets interpreted as half of the total, instead of half of 1
	        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
	        if (this._r < 1) { this._r = mathRound(this._r); }
	        if (this._g < 1) { this._g = mathRound(this._g); }
	        if (this._b < 1) { this._b = mathRound(this._b); }
	
	        this._ok = rgb.ok;
	        this._tc_id = tinyCounter++;
	    };
	
	    tinycolor.prototype = {
	        isDark: function() {
	            return this.getBrightness() < 128;
	        },
	        isLight: function() {
	            return !this.isDark();
	        },
	        isValid: function() {
	            return this._ok;
	        },
	        getOriginalInput: function() {
	          return this._originalInput;
	        },
	        getFormat: function() {
	            return this._format;
	        },
	        getAlpha: function() {
	            return this._a;
	        },
	        getBrightness: function() {
	            var rgb = this.toRgb();
	            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	        },
	        setAlpha: function(value) {
	            this._a = boundAlpha(value);
	            this._roundA = mathRound(100*this._a) / 100;
	            return this;
	        },
	        toHsv: function() {
	            var hsv = rgbToHsv(this._r, this._g, this._b);
	            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
	        },
	        toHsvString: function() {
	            var hsv = rgbToHsv(this._r, this._g, this._b);
	            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
	            return (this._a == 1) ?
	              "hsv("  + h + ", " + s + "%, " + v + "%)" :
	              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
	        },
	        toHsl: function() {
	            var hsl = rgbToHsl(this._r, this._g, this._b);
	            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
	        },
	        toHslString: function() {
	            var hsl = rgbToHsl(this._r, this._g, this._b);
	            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
	            return (this._a == 1) ?
	              "hsl("  + h + ", " + s + "%, " + l + "%)" :
	              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
	        },
	        toHex: function(allow3Char) {
	            return rgbToHex(this._r, this._g, this._b, allow3Char);
	        },
	        toHexString: function(allow3Char) {
	            return '#' + this.toHex(allow3Char);
	        },
	        toHex8: function() {
	            return rgbaToHex(this._r, this._g, this._b, this._a);
	        },
	        toHex8String: function() {
	            return '#' + this.toHex8();
	        },
	        toRgb: function() {
	            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
	        },
	        toRgbString: function() {
	            return (this._a == 1) ?
	              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
	              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
	        },
	        toPercentageRgb: function() {
	            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
	        },
	        toPercentageRgbString: function() {
	            return (this._a == 1) ?
	              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
	              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
	        },
	        toName: function() {
	            if (this._a === 0) {
	                return "transparent";
	            }
	
	            if (this._a < 1) {
	                return false;
	            }
	
	            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
	        },
	        toFilter: function(secondColor) {
	            var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
	            var secondHex8String = hex8String;
	            var gradientType = this._gradientType ? "GradientType = 1, " : "";
	
	            if (secondColor) {
	                var s = tinycolor(secondColor);
	                secondHex8String = s.toHex8String();
	            }
	
	            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
	        },
	        toString: function(format) {
	            var formatSet = !!format;
	            format = format || this._format;
	
	            var formattedString = false;
	            var hasAlpha = this._a < 1 && this._a >= 0;
	            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");
	
	            if (needsAlphaFormat) {
	                // Special case for "transparent", all other non-alpha formats
	                // will return rgba when there is transparency.
	                if (format === "name" && this._a === 0) {
	                    return this.toName();
	                }
	                return this.toRgbString();
	            }
	            if (format === "rgb") {
	                formattedString = this.toRgbString();
	            }
	            if (format === "prgb") {
	                formattedString = this.toPercentageRgbString();
	            }
	            if (format === "hex" || format === "hex6") {
	                formattedString = this.toHexString();
	            }
	            if (format === "hex3") {
	                formattedString = this.toHexString(true);
	            }
	            if (format === "hex8") {
	                formattedString = this.toHex8String();
	            }
	            if (format === "name") {
	                formattedString = this.toName();
	            }
	            if (format === "hsl") {
	                formattedString = this.toHslString();
	            }
	            if (format === "hsv") {
	                formattedString = this.toHsvString();
	            }
	
	            return formattedString || this.toHexString();
	        },
	
	        _applyModification: function(fn, args) {
	            var color = fn.apply(null, [this].concat([].slice.call(args)));
	            this._r = color._r;
	            this._g = color._g;
	            this._b = color._b;
	            this.setAlpha(color._a);
	            return this;
	        },
	        lighten: function() {
	            return this._applyModification(lighten, arguments);
	        },
	        brighten: function() {
	            return this._applyModification(brighten, arguments);
	        },
	        darken: function() {
	            return this._applyModification(darken, arguments);
	        },
	        desaturate: function() {
	            return this._applyModification(desaturate, arguments);
	        },
	        saturate: function() {
	            return this._applyModification(saturate, arguments);
	        },
	        greyscale: function() {
	            return this._applyModification(greyscale, arguments);
	        },
	        spin: function() {
	            return this._applyModification(spin, arguments);
	        },
	
	        _applyCombination: function(fn, args) {
	            return fn.apply(null, [this].concat([].slice.call(args)));
	        },
	        analogous: function() {
	            return this._applyCombination(analogous, arguments);
	        },
	        complement: function() {
	            return this._applyCombination(complement, arguments);
	        },
	        monochromatic: function() {
	            return this._applyCombination(monochromatic, arguments);
	        },
	        splitcomplement: function() {
	            return this._applyCombination(splitcomplement, arguments);
	        },
	        triad: function() {
	            return this._applyCombination(triad, arguments);
	        },
	        tetrad: function() {
	            return this._applyCombination(tetrad, arguments);
	        }
	    };
	
	    // If input is an object, force 1 into "1.0" to handle ratios properly
	    // String input requires "1.0" as input, so 1 will be treated as 1
	    tinycolor.fromRatio = function(color, opts) {
	        if (typeof color == "object") {
	            var newColor = {};
	            for (var i in color) {
	                if (color.hasOwnProperty(i)) {
	                    if (i === "a") {
	                        newColor[i] = color[i];
	                    }
	                    else {
	                        newColor[i] = convertToPercentage(color[i]);
	                    }
	                }
	            }
	            color = newColor;
	        }
	
	        return tinycolor(color, opts);
	    };
	
	    // Given a string or object, convert that input to RGB
	    // Possible string inputs:
	    //
	    //     "red"
	    //     "#f00" or "f00"
	    //     "#ff0000" or "ff0000"
	    //     "#ff000000" or "ff000000"
	    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
	    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	    //
	    function inputToRGB(color) {
	
	        var rgb = { r: 0, g: 0, b: 0 };
	        var a = 1;
	        var ok = false;
	        var format = false;
	
	        if (typeof color == "string") {
	            color = stringInputToObject(color);
	        }
	
	        if (typeof color == "object") {
	            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
	                rgb = rgbToRgb(color.r, color.g, color.b);
	                ok = true;
	                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
	            }
	            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
	                color.s = convertToPercentage(color.s);
	                color.v = convertToPercentage(color.v);
	                rgb = hsvToRgb(color.h, color.s, color.v);
	                ok = true;
	                format = "hsv";
	            }
	            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
	                color.s = convertToPercentage(color.s);
	                color.l = convertToPercentage(color.l);
	                rgb = hslToRgb(color.h, color.s, color.l);
	                ok = true;
	                format = "hsl";
	            }
	
	            if (color.hasOwnProperty("a")) {
	                a = color.a;
	            }
	        }
	
	        a = boundAlpha(a);
	
	        return {
	            ok: ok,
	            format: color.format || format,
	            r: mathMin(255, mathMax(rgb.r, 0)),
	            g: mathMin(255, mathMax(rgb.g, 0)),
	            b: mathMin(255, mathMax(rgb.b, 0)),
	            a: a
	        };
	    }
	
	
	    // Conversion Functions
	    // --------------------
	
	    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
	    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
	
	    // `rgbToRgb`
	    // Handle bounds / percentage checking to conform to CSS color spec
	    // <http://www.w3.org/TR/css3-color/>
	    // *Assumes:* r, g, b in [0, 255] or [0, 1]
	    // *Returns:* { r, g, b } in [0, 255]
	    function rgbToRgb(r, g, b){
	        return {
	            r: bound01(r, 255) * 255,
	            g: bound01(g, 255) * 255,
	            b: bound01(b, 255) * 255
	        };
	    }
	
	    // `rgbToHsl`
	    // Converts an RGB color value to HSL.
	    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
	    // *Returns:* { h, s, l } in [0,1]
	    function rgbToHsl(r, g, b) {
	
	        r = bound01(r, 255);
	        g = bound01(g, 255);
	        b = bound01(b, 255);
	
	        var max = mathMax(r, g, b), min = mathMin(r, g, b);
	        var h, s, l = (max + min) / 2;
	
	        if(max == min) {
	            h = s = 0; // achromatic
	        }
	        else {
	            var d = max - min;
	            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	            switch(max) {
	                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	                case g: h = (b - r) / d + 2; break;
	                case b: h = (r - g) / d + 4; break;
	            }
	
	            h /= 6;
	        }
	
	        return { h: h, s: s, l: l };
	    }
	
	    // `hslToRgb`
	    // Converts an HSL color value to RGB.
	    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
	    // *Returns:* { r, g, b } in the set [0, 255]
	    function hslToRgb(h, s, l) {
	        var r, g, b;
	
	        h = bound01(h, 360);
	        s = bound01(s, 100);
	        l = bound01(l, 100);
	
	        function hue2rgb(p, q, t) {
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }
	
	        if(s === 0) {
	            r = g = b = l; // achromatic
	        }
	        else {
	            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	            var p = 2 * l - q;
	            r = hue2rgb(p, q, h + 1/3);
	            g = hue2rgb(p, q, h);
	            b = hue2rgb(p, q, h - 1/3);
	        }
	
	        return { r: r * 255, g: g * 255, b: b * 255 };
	    }
	
	    // `rgbToHsv`
	    // Converts an RGB color value to HSV
	    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
	    // *Returns:* { h, s, v } in [0,1]
	    function rgbToHsv(r, g, b) {
	
	        r = bound01(r, 255);
	        g = bound01(g, 255);
	        b = bound01(b, 255);
	
	        var max = mathMax(r, g, b), min = mathMin(r, g, b);
	        var h, s, v = max;
	
	        var d = max - min;
	        s = max === 0 ? 0 : d / max;
	
	        if(max == min) {
	            h = 0; // achromatic
	        }
	        else {
	            switch(max) {
	                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	                case g: h = (b - r) / d + 2; break;
	                case b: h = (r - g) / d + 4; break;
	            }
	            h /= 6;
	        }
	        return { h: h, s: s, v: v };
	    }
	
	    // `hsvToRgb`
	    // Converts an HSV color value to RGB.
	    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
	    // *Returns:* { r, g, b } in the set [0, 255]
	     function hsvToRgb(h, s, v) {
	
	        h = bound01(h, 360) * 6;
	        s = bound01(s, 100);
	        v = bound01(v, 100);
	
	        var i = math.floor(h),
	            f = h - i,
	            p = v * (1 - s),
	            q = v * (1 - f * s),
	            t = v * (1 - (1 - f) * s),
	            mod = i % 6,
	            r = [v, q, p, p, t, v][mod],
	            g = [t, v, v, q, p, p][mod],
	            b = [p, p, t, v, v, q][mod];
	
	        return { r: r * 255, g: g * 255, b: b * 255 };
	    }
	
	    // `rgbToHex`
	    // Converts an RGB color to hex
	    // Assumes r, g, and b are contained in the set [0, 255]
	    // Returns a 3 or 6 character hex
	    function rgbToHex(r, g, b, allow3Char) {
	
	        var hex = [
	            pad2(mathRound(r).toString(16)),
	            pad2(mathRound(g).toString(16)),
	            pad2(mathRound(b).toString(16))
	        ];
	
	        // Return a 3 character hex if possible
	        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
	            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	        }
	
	        return hex.join("");
	    }
	        // `rgbaToHex`
	        // Converts an RGBA color plus alpha transparency to hex
	        // Assumes r, g, b and a are contained in the set [0, 255]
	        // Returns an 8 character hex
	        function rgbaToHex(r, g, b, a) {
	
	            var hex = [
	                pad2(convertDecimalToHex(a)),
	                pad2(mathRound(r).toString(16)),
	                pad2(mathRound(g).toString(16)),
	                pad2(mathRound(b).toString(16))
	            ];
	
	            return hex.join("");
	        }
	
	    // `equals`
	    // Can be called with any tinycolor input
	    tinycolor.equals = function (color1, color2) {
	        if (!color1 || !color2) { return false; }
	        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
	    };
	    tinycolor.random = function() {
	        return tinycolor.fromRatio({
	            r: mathRandom(),
	            g: mathRandom(),
	            b: mathRandom()
	        });
	    };
	
	
	    // Modification Functions
	    // ----------------------
	    // Thanks to less.js for some of the basics here
	    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>
	
	    function desaturate(color, amount) {
	        amount = (amount === 0) ? 0 : (amount || 10);
	        var hsl = tinycolor(color).toHsl();
	        hsl.s -= amount / 100;
	        hsl.s = clamp01(hsl.s);
	        return tinycolor(hsl);
	    }
	
	    function saturate(color, amount) {
	        amount = (amount === 0) ? 0 : (amount || 10);
	        var hsl = tinycolor(color).toHsl();
	        hsl.s += amount / 100;
	        hsl.s = clamp01(hsl.s);
	        return tinycolor(hsl);
	    }
	
	    function greyscale(color) {
	        return tinycolor(color).desaturate(100);
	    }
	
	    function lighten (color, amount) {
	        amount = (amount === 0) ? 0 : (amount || 10);
	        var hsl = tinycolor(color).toHsl();
	        hsl.l += amount / 100;
	        hsl.l = clamp01(hsl.l);
	        return tinycolor(hsl);
	    }
	
	    function brighten(color, amount) {
	        amount = (amount === 0) ? 0 : (amount || 10);
	        var rgb = tinycolor(color).toRgb();
	        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
	        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
	        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
	        return tinycolor(rgb);
	    }
	
	    function darken (color, amount) {
	        amount = (amount === 0) ? 0 : (amount || 10);
	        var hsl = tinycolor(color).toHsl();
	        hsl.l -= amount / 100;
	        hsl.l = clamp01(hsl.l);
	        return tinycolor(hsl);
	    }
	
	    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	    // Values outside of this range will be wrapped into this range.
	    function spin(color, amount) {
	        var hsl = tinycolor(color).toHsl();
	        var hue = (mathRound(hsl.h) + amount) % 360;
	        hsl.h = hue < 0 ? 360 + hue : hue;
	        return tinycolor(hsl);
	    }
	
	    // Combination Functions
	    // ---------------------
	    // Thanks to jQuery xColor for some of the ideas behind these
	    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>
	
	    function complement(color) {
	        var hsl = tinycolor(color).toHsl();
	        hsl.h = (hsl.h + 180) % 360;
	        return tinycolor(hsl);
	    }
	
	    function triad(color) {
	        var hsl = tinycolor(color).toHsl();
	        var h = hsl.h;
	        return [
	            tinycolor(color),
	            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
	            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
	        ];
	    }
	
	    function tetrad(color) {
	        var hsl = tinycolor(color).toHsl();
	        var h = hsl.h;
	        return [
	            tinycolor(color),
	            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
	            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
	            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
	        ];
	    }
	
	    function splitcomplement(color) {
	        var hsl = tinycolor(color).toHsl();
	        var h = hsl.h;
	        return [
	            tinycolor(color),
	            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
	            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
	        ];
	    }
	
	    function analogous(color, results, slices) {
	        results = results || 6;
	        slices = slices || 30;
	
	        var hsl = tinycolor(color).toHsl();
	        var part = 360 / slices;
	        var ret = [tinycolor(color)];
	
	        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
	            hsl.h = (hsl.h + part) % 360;
	            ret.push(tinycolor(hsl));
	        }
	        return ret;
	    }
	
	    function monochromatic(color, results) {
	        results = results || 6;
	        var hsv = tinycolor(color).toHsv();
	        var h = hsv.h, s = hsv.s, v = hsv.v;
	        var ret = [];
	        var modification = 1 / results;
	
	        while (results--) {
	            ret.push(tinycolor({ h: h, s: s, v: v}));
	            v = (v + modification) % 1;
	        }
	
	        return ret;
	    }
	
	    // Utility Functions
	    // ---------------------
	
	    tinycolor.mix = function(color1, color2, amount) {
	        amount = (amount === 0) ? 0 : (amount || 50);
	
	        var rgb1 = tinycolor(color1).toRgb();
	        var rgb2 = tinycolor(color2).toRgb();
	
	        var p = amount / 100;
	        var w = p * 2 - 1;
	        var a = rgb2.a - rgb1.a;
	
	        var w1;
	
	        if (w * a == -1) {
	            w1 = w;
	        } else {
	            w1 = (w + a) / (1 + w * a);
	        }
	
	        w1 = (w1 + 1) / 2;
	
	        var w2 = 1 - w1;
	
	        var rgba = {
	            r: rgb2.r * w1 + rgb1.r * w2,
	            g: rgb2.g * w1 + rgb1.g * w2,
	            b: rgb2.b * w1 + rgb1.b * w2,
	            a: rgb2.a * p  + rgb1.a * (1 - p)
	        };
	
	        return tinycolor(rgba);
	    };
	
	
	    // Readability Functions
	    // ---------------------
	    // <http://www.w3.org/TR/AERT#color-contrast>
	
	    // `readability`
	    // Analyze the 2 colors and returns an object with the following properties:
	    //    `brightness`: difference in brightness between the two colors
	    //    `color`: difference in color/hue between the two colors
	    tinycolor.readability = function(color1, color2) {
	        var c1 = tinycolor(color1);
	        var c2 = tinycolor(color2);
	        var rgb1 = c1.toRgb();
	        var rgb2 = c2.toRgb();
	        var brightnessA = c1.getBrightness();
	        var brightnessB = c2.getBrightness();
	        var colorDiff = (
	            Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
	            Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
	            Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
	        );
	
	        return {
	            brightness: Math.abs(brightnessA - brightnessB),
	            color: colorDiff
	        };
	    };
	
	    // `readable`
	    // http://www.w3.org/TR/AERT#color-contrast
	    // Ensure that foreground and background color combinations provide sufficient contrast.
	    // *Example*
	    //    tinycolor.isReadable("#000", "#111") => false
	    tinycolor.isReadable = function(color1, color2) {
	        var readability = tinycolor.readability(color1, color2);
	        return readability.brightness > 125 && readability.color > 500;
	    };
	
	    // `mostReadable`
	    // Given a base color and a list of possible foreground or background
	    // colors for that base, returns the most readable color.
	    // *Example*
	    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
	    tinycolor.mostReadable = function(baseColor, colorList) {
	        var bestColor = null;
	        var bestScore = 0;
	        var bestIsReadable = false;
	        for (var i=0; i < colorList.length; i++) {
	
	            // We normalize both around the "acceptable" breaking point,
	            // but rank brightness constrast higher than hue.
	
	            var readability = tinycolor.readability(baseColor, colorList[i]);
	            var readable = readability.brightness > 125 && readability.color > 500;
	            var score = 3 * (readability.brightness / 125) + (readability.color / 500);
	
	            if ((readable && ! bestIsReadable) ||
	                (readable && bestIsReadable && score > bestScore) ||
	                ((! readable) && (! bestIsReadable) && score > bestScore)) {
	                bestIsReadable = readable;
	                bestScore = score;
	                bestColor = tinycolor(colorList[i]);
	            }
	        }
	        return bestColor;
	    };
	
	
	    // Big List of Colors
	    // ------------------
	    // <http://www.w3.org/TR/css3-color/#svg-color>
	    var names = tinycolor.names = {
	        aliceblue: "f0f8ff",
	        antiquewhite: "faebd7",
	        aqua: "0ff",
	        aquamarine: "7fffd4",
	        azure: "f0ffff",
	        beige: "f5f5dc",
	        bisque: "ffe4c4",
	        black: "000",
	        blanchedalmond: "ffebcd",
	        blue: "00f",
	        blueviolet: "8a2be2",
	        brown: "a52a2a",
	        burlywood: "deb887",
	        burntsienna: "ea7e5d",
	        cadetblue: "5f9ea0",
	        chartreuse: "7fff00",
	        chocolate: "d2691e",
	        coral: "ff7f50",
	        cornflowerblue: "6495ed",
	        cornsilk: "fff8dc",
	        crimson: "dc143c",
	        cyan: "0ff",
	        darkblue: "00008b",
	        darkcyan: "008b8b",
	        darkgoldenrod: "b8860b",
	        darkgray: "a9a9a9",
	        darkgreen: "006400",
	        darkgrey: "a9a9a9",
	        darkkhaki: "bdb76b",
	        darkmagenta: "8b008b",
	        darkolivegreen: "556b2f",
	        darkorange: "ff8c00",
	        darkorchid: "9932cc",
	        darkred: "8b0000",
	        darksalmon: "e9967a",
	        darkseagreen: "8fbc8f",
	        darkslateblue: "483d8b",
	        darkslategray: "2f4f4f",
	        darkslategrey: "2f4f4f",
	        darkturquoise: "00ced1",
	        darkviolet: "9400d3",
	        deeppink: "ff1493",
	        deepskyblue: "00bfff",
	        dimgray: "696969",
	        dimgrey: "696969",
	        dodgerblue: "1e90ff",
	        firebrick: "b22222",
	        floralwhite: "fffaf0",
	        forestgreen: "228b22",
	        fuchsia: "f0f",
	        gainsboro: "dcdcdc",
	        ghostwhite: "f8f8ff",
	        gold: "ffd700",
	        goldenrod: "daa520",
	        gray: "808080",
	        green: "008000",
	        greenyellow: "adff2f",
	        grey: "808080",
	        honeydew: "f0fff0",
	        hotpink: "ff69b4",
	        indianred: "cd5c5c",
	        indigo: "4b0082",
	        ivory: "fffff0",
	        khaki: "f0e68c",
	        lavender: "e6e6fa",
	        lavenderblush: "fff0f5",
	        lawngreen: "7cfc00",
	        lemonchiffon: "fffacd",
	        lightblue: "add8e6",
	        lightcoral: "f08080",
	        lightcyan: "e0ffff",
	        lightgoldenrodyellow: "fafad2",
	        lightgray: "d3d3d3",
	        lightgreen: "90ee90",
	        lightgrey: "d3d3d3",
	        lightpink: "ffb6c1",
	        lightsalmon: "ffa07a",
	        lightseagreen: "20b2aa",
	        lightskyblue: "87cefa",
	        lightslategray: "789",
	        lightslategrey: "789",
	        lightsteelblue: "b0c4de",
	        lightyellow: "ffffe0",
	        lime: "0f0",
	        limegreen: "32cd32",
	        linen: "faf0e6",
	        magenta: "f0f",
	        maroon: "800000",
	        mediumaquamarine: "66cdaa",
	        mediumblue: "0000cd",
	        mediumorchid: "ba55d3",
	        mediumpurple: "9370db",
	        mediumseagreen: "3cb371",
	        mediumslateblue: "7b68ee",
	        mediumspringgreen: "00fa9a",
	        mediumturquoise: "48d1cc",
	        mediumvioletred: "c71585",
	        midnightblue: "191970",
	        mintcream: "f5fffa",
	        mistyrose: "ffe4e1",
	        moccasin: "ffe4b5",
	        navajowhite: "ffdead",
	        navy: "000080",
	        oldlace: "fdf5e6",
	        olive: "808000",
	        olivedrab: "6b8e23",
	        orange: "ffa500",
	        orangered: "ff4500",
	        orchid: "da70d6",
	        palegoldenrod: "eee8aa",
	        palegreen: "98fb98",
	        paleturquoise: "afeeee",
	        palevioletred: "db7093",
	        papayawhip: "ffefd5",
	        peachpuff: "ffdab9",
	        peru: "cd853f",
	        pink: "ffc0cb",
	        plum: "dda0dd",
	        powderblue: "b0e0e6",
	        purple: "800080",
	        rebeccapurple: "663399",
	        red: "f00",
	        rosybrown: "bc8f8f",
	        royalblue: "4169e1",
	        saddlebrown: "8b4513",
	        salmon: "fa8072",
	        sandybrown: "f4a460",
	        seagreen: "2e8b57",
	        seashell: "fff5ee",
	        sienna: "a0522d",
	        silver: "c0c0c0",
	        skyblue: "87ceeb",
	        slateblue: "6a5acd",
	        slategray: "708090",
	        slategrey: "708090",
	        snow: "fffafa",
	        springgreen: "00ff7f",
	        steelblue: "4682b4",
	        tan: "d2b48c",
	        teal: "008080",
	        thistle: "d8bfd8",
	        tomato: "ff6347",
	        turquoise: "40e0d0",
	        violet: "ee82ee",
	        wheat: "f5deb3",
	        white: "fff",
	        whitesmoke: "f5f5f5",
	        yellow: "ff0",
	        yellowgreen: "9acd32"
	    };
	
	    // Make it easy to access colors via `hexNames[hex]`
	    var hexNames = tinycolor.hexNames = flip(names);
	
	
	    // Utilities
	    // ---------
	
	    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
	    function flip(o) {
	        var flipped = { };
	        for (var i in o) {
	            if (o.hasOwnProperty(i)) {
	                flipped[o[i]] = i;
	            }
	        }
	        return flipped;
	    }
	
	    // Return a valid alpha value [0,1] with all invalid values being set to 1
	    function boundAlpha(a) {
	        a = parseFloat(a);
	
	        if (isNaN(a) || a < 0 || a > 1) {
	            a = 1;
	        }
	
	        return a;
	    }
	
	    // Take input from [0, n] and return it as [0, 1]
	    function bound01(n, max) {
	        if (isOnePointZero(n)) { n = "100%"; }
	
	        var processPercent = isPercentage(n);
	        n = mathMin(max, mathMax(0, parseFloat(n)));
	
	        // Automatically convert percentage into number
	        if (processPercent) {
	            n = parseInt(n * max, 10) / 100;
	        }
	
	        // Handle floating point rounding errors
	        if ((math.abs(n - max) < 0.000001)) {
	            return 1;
	        }
	
	        // Convert into [0, 1] range if it isn't already
	        return (n % max) / parseFloat(max);
	    }
	
	    // Force a number between 0 and 1
	    function clamp01(val) {
	        return mathMin(1, mathMax(0, val));
	    }
	
	    // Parse a base-16 hex value into a base-10 integer
	    function parseIntFromHex(val) {
	        return parseInt(val, 16);
	    }
	
	    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	    function isOnePointZero(n) {
	        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
	    }
	
	    // Check to see if string passed in is a percentage
	    function isPercentage(n) {
	        return typeof n === "string" && n.indexOf('%') != -1;
	    }
	
	    // Force a hex value to have 2 characters
	    function pad2(c) {
	        return c.length == 1 ? '0' + c : '' + c;
	    }
	
	    // Replace a decimal with it's percentage value
	    function convertToPercentage(n) {
	        if (n <= 1) {
	            n = (n * 100) + "%";
	        }
	
	        return n;
	    }
	
	    // Converts a decimal to a hex value
	    function convertDecimalToHex(d) {
	        return Math.round(parseFloat(d) * 255).toString(16);
	    }
	    // Converts a hex value to a decimal
	    function convertHexToDecimal(h) {
	        return (parseIntFromHex(h) / 255);
	    }
	
	    var matchers = (function() {
	
	        // <http://www.w3.org/TR/css3-values/#integers>
	        var CSS_INTEGER = "[-\\+]?\\d+%?";
	
	        // <http://www.w3.org/TR/css3-values/#number-value>
	        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
	
	        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
	        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
	
	        // Actual matching.
	        // Parentheses and commas are optional, but not required.
	        // Whitespace can take the place of commas or opening paren
	        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	
	        return {
	            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
	            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	        };
	    })();
	
	    // `stringInputToObject`
	    // Permissive string parsing.  Take in a number of formats, and output an object
	    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	    function stringInputToObject(color) {
	
	        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
	        var named = false;
	        if (names[color]) {
	            color = names[color];
	            named = true;
	        }
	        else if (color == 'transparent') {
	            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
	        }
	
	        // Try to match string input using regular expressions.
	        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	        // Just return an object and let the conversion functions handle that.
	        // This way the result will be the same whether the tinycolor is initialized with string or object.
	        var match;
	        if ((match = matchers.rgb.exec(color))) {
	            return { r: match[1], g: match[2], b: match[3] };
	        }
	        if ((match = matchers.rgba.exec(color))) {
	            return { r: match[1], g: match[2], b: match[3], a: match[4] };
	        }
	        if ((match = matchers.hsl.exec(color))) {
	            return { h: match[1], s: match[2], l: match[3] };
	        }
	        if ((match = matchers.hsla.exec(color))) {
	            return { h: match[1], s: match[2], l: match[3], a: match[4] };
	        }
	        if ((match = matchers.hsv.exec(color))) {
	            return { h: match[1], s: match[2], v: match[3] };
	        }
	        if ((match = matchers.hsva.exec(color))) {
	            return { h: match[1], s: match[2], v: match[3], a: match[4] };
	        }
	        if ((match = matchers.hex8.exec(color))) {
	            return {
	                a: convertHexToDecimal(match[1]),
	                r: parseIntFromHex(match[2]),
	                g: parseIntFromHex(match[3]),
	                b: parseIntFromHex(match[4]),
	                format: named ? "name" : "hex8"
	            };
	        }
	        if ((match = matchers.hex6.exec(color))) {
	            return {
	                r: parseIntFromHex(match[1]),
	                g: parseIntFromHex(match[2]),
	                b: parseIntFromHex(match[3]),
	                format: named ? "name" : "hex"
	            };
	        }
	        if ((match = matchers.hex3.exec(color))) {
	            return {
	                r: parseIntFromHex(match[1] + '' + match[1]),
	                g: parseIntFromHex(match[2] + '' + match[2]),
	                b: parseIntFromHex(match[3] + '' + match[3]),
	                format: named ? "name" : "hex"
	            };
	        }
	
	        return false;
	    }
	
	    window.tinycolor = tinycolor;
	    })();
	
	    $(function () {
	        if ($.fn.spectrum.load) {
	            $.fn.spectrum.processNativeColorInputs();
	        }
	    });
	
	});


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 图表的box
	 * @param {object} opts {
	 *     datas: [],			//图表的数据
	 *     container: Emement,	//放在哪个容器里面
	 *     title:{},			//这个图表的标题，里面要包含title属性如 {title:EUR/USD,ask:1.33,bid:1.34}
	 *     formatTitleTpl: function(title){}	//生成title的html
	 *     width:500,
	 *     height:200,
	 *     minHeight:184
	 *     ajax: { 						//如果己经设置了datas，那ajax将不会起作用
	 *     		url:StringOrFunction,	//请求url
	 *     		data: ObjectOrFunction,	//url后面需要带的参数
	 *     		formatDatas:@function   //ajax请求成功之后，需要处理数据然后再使用
	 *     },
	 *     chartOpts:{
	 *     		period:1,   		//时间段[1min,5min,15min,30min,1Hour,1Day,1Week,1Month]
				maxShowCount: 800,	//图表最多显示多少个数据
				minShowCount: 20,	//图表最小显示多少个数据
				theme {
					backgroundColor:'#2e3138',  //背景颜色
				    riseColor: '#ff0000',       //涨颜色
				    fallColor: '#3dab4b',       //跌颜色
				    normalColor: '#999',        //不涨也不跌的时候字体的颜色
				    lineStyle: 'dashed',        //画底线或者边框的样式
				    lineColor: '#21242b',       //画底线或者边框的颜色
				    lineWidth: 1,               //画底线或者边框的线的宽度
				    barWidth: 5,               //柱子的宽度
				    spaceWidth: 2,              //柱子之间的间隔宽度
				}
	
	            //区域化分  
			    areas: {
			    	//配置整个图表都有哪些区域，这些都需要能过areaName来找到配置
			    	items:['mainArea','volumeArea'],	主区域名字不能变
			    	//每个区域公共的配置
			    	right:30
			    },
			    //各字自区域对应的配置
			    mainArea: {
			    	left: 0,
			    	top: 30, 
			    	bottom:0,					//规定在主区域内，canvas离区域的距离
			    	type:'candlestick',			//规定这个区域内画什么图表类型，目前只支持candlestick和polyline类型
			    	yAxis:true,					//是否显示y轴，这个目前只对主区域有用，其他区域暂没做测试
			    	horizontalLineSpace:55,		//图形区域可能需要画一些刻度线，这里表示两条水平线之间的间隔
			    	subCharts: {				//这里表是在这个区域内，可能还存在的一些副图
			    		'MA5':{						//副图标识:{type:副图是什么图表类型，color,daysCount	    								
			    			type:'MA',				//后面这些配置可根据不同的图表类型，配置不同
			    			color: 'rgb(255,70,251)',
			    			daysCount: 5,
			    			sort:5,					//sort表示在主图上显示副图的tip时显示的顺序，数字越大越在后
			    		},
			    		'MA10':{		
			    			type:'MA',					//均线
			    			color: 'rgb(227,150,34)',	//线条的颜色
			    			daysCount: 10,				//10日均线
			    			sort:10,					
			    		},
			    		'MA20':{
			    			type:'MA',
			    			color: 'rgb(53,71,107)',
			    			daysCount: 20,
			    			sort:20,
			    		},
			    		'MA60': {
			    			type:'MA',
			    			color: 'rgb(0,0,0)',
			    			daysCount: 60,
			    			sort:60,
			    		}
			    	}
			    },
			    volumeArea: {					//因为在areas里配置了这个区域，所以也要有相应配置
			    	left: 0, top:30,bottom:0,	//距离区域的距离
			    	type:'volume',				//图表类型是交易量
			    	horizontalLineSpace:50,
			    	height: 50					//图表的高度				
			    },	
			    subArea: {
			    	left: 0, top:30,bottom:0,
			    	height: 80
			    },	
			    xAxis: {						//x轴配置
			    	left:0,top:0,bottom:0,		
			        height: 30,
				    verticalLineSpace:100,
			        color:'#999',
			        font:'12px Arial'
			    },
			    yAxis: {						//y轴配置,只有在区域里配置了yAxis为true后，才会调用这里面的配置
			        width: 60,
			        color:'#999',
			        lineColor: '#21242b',
			        font:'12px Arial'
			    },
	 *     },
	 *     callbacks: {				//除图表相关之外其他位置的回调，比如点击header的回调
	 *     		onBoxTitleClick
	 *     },
	 *     events: {				//主要是图表事件回调
				drag: {				//拖拽
					onDragBefore: function(){}	
					onDrag: function(){}
					onDragAfter: function(){}
				},
				wheel: {			//鼠标滚轮
					step:6,			//鼠标每次滚动缩放的大小
					onBeforeWheel: function(){},
					onWheel: function(){}
				},
				crossLine:{					//鼠标移动事件
					lineColor:'#ccc',		//移动画线是颜色
					background:'#3e4450',	//x,y轴移动时显示数据背景颜色
					color:'#fff',			//字体颜色
					font:'12px Arial',		//字体大小
					follow: {				//如果有这个配置，则显示移动时跟随的tip
						width:120,
						height:160,
						margin:20,
						delay:1000
					}
					onCross:function(){}	
					onAfterCross: function(){}
				},
	
		   }
	 * }
	 */
	
	
	var $=__webpack_require__(1);
	var core = __webpack_require__(9);
	var CandlestickChart = __webpack_require__(10);
	var VolumeChart = __webpack_require__(12);
	var XAxisChart = __webpack_require__(13);
	var PolylineChart = __webpack_require__(14);
	var HollowCandleChart = __webpack_require__(15);
	var MAChart = __webpack_require__(16);
	var DragEvent = __webpack_require__(17);
	var WheelEvent = __webpack_require__(18);
	var CrossLineEvent = __webpack_require__(20);
	var RightClickEvent = __webpack_require__(22);
	
	
	var noop = function(){};
	var isCanvasSuport = function(){
		return !!document.createElement('canvas').getContext;	
	}
	function Chartbox(opts) {
			var defaults = {
				formatTitleTpl: function(){},
				title:{},
				container: $(document.body),
				callbacks: {
					onBoxTitleClick: noop,
				},
				ajax: {
				},
				chartOpts: {
					period:1,   //时间段[1min,5min,15min,30min,1Hour,1Day,1Week,1Month]
					maxShowCount: 800,
					minShowCount: 20,
					theme: {
						backgroundColor:'#2e3138',  //背景颜色
					    riseColor: '#ff0000',       //涨颜色
					    fallColor: '#3dab4b',       //跌颜色
					    normalColor: '#999',        //不涨也不跌的时候字体的颜色
					    lineStyle: 'dashed',        //画底线或者边框的样式
					    lineColor: '#21242b',       //画底线或者边框的颜色
					    lineWidth: 1,               //画底线或者边框的线的宽度
					    barWidth: 5,               //柱子的宽度
					    spaceWidth: 2,              //柱子之间的间隔宽度
					    horizontalLineOpts: {		//mainArea里画价格线的默认配置
					    	color:'#fff',
					    	bgColor:'#783f04',
					    	lineColor:'yellow',
					    	font:'12px Arial'
					    }
					}, 
					//区域化分  
				    areas: {
				    	//都有哪些区域，这些都需要能过areaName来找到配置
				    	//items:['mainArea','volumeArea','subArea'],主区域(mainArea)名字不能变
				    	items:['mainArea','volumeArea'],
				    	//每个区域公共的配置
				    	right:0
				    },
				    //各字自区域对应的配置
				    mainArea: {
				    	left: 0,
				    	top: 30, 
				    	bottom:0,
				    	type:'candlestick',
				    	yAxis:true,
				    	horizontalLineSpace:55,
				    	subCharts: {
				    		'MA5':{
				    			type:'MA',
				    			color: 'rgb(255,70,251)',
				    			daysCount: 5,
				    			sort:5,
				    		},
				    		'MA10':{
				    			type:'MA',
				    			color: 'rgb(227,150,34)',
				    			daysCount: 10,
				    			sort:10,
				    		},
				    		'MA20':{
				    			type:'MA',
				    			color: 'rgb(53,71,107)',
				    			daysCount: 20,
				    			sort:20,
				    		},
				    		'MA60': {
				    			type:'MA',
				    			color: 'rgb(0,0,0)',
				    			daysCount: 60,
				    			sort:60,
				    		}
				    	},
				    	marketPriceLine:{show:true,label:'市价'},
				    	lines: {}
				    },
				    volumeArea: {
				    	left: 0, top:30,bottom:0,
				    	type:'volume',
				    	horizontalLineSpace:50,
				    	height: 50
				    },
				    subArea: {
				    	left: 0, top:30,bottom:0,
				    	height: 80
				    },
				    xAxis: {
				    	left:0,top:0,bottom:0,
				        height: 30,
					    verticalLineSpace:100,
				        color:'#999',
				        font:'12px Arial'
				    },
				    yAxis: {
				        width: 100,
				        color:'#999',
				        lineColor: '#21242b',
				        font:'12px Arial'
				    },
				    
				},
				events: {
					drag: {
					},
					wheel: {
						step:6,
					},
					crossLine:{
						lineColor:'#ccc',
						background:'#3e4450',
						color:'#fff',
						font:'12px Arial'
					},
		
				}
			};
			$.extend(true,this,defaults,opts);
			if(!this.datas&&(!this.ajax||!this.ajax.url)) {
				console.log('请设置数据');
				return false;
			}
			if(!this.container){
				return false;
			}
		
			if(!isCanvasSuport()) {
				this.container.append('<div style="text-align:center;padding:20px 0"><h1>您的浏览器不支持canvas</h1></div>');
				return false;
			}
		
			this.chartList = {};
			this.eventList = {};
			this.tipList = {};
			this.readyList = [];
			var me = this;
			this.initComplete = false;
			this.init();
			if(this.datas) {
				this.datas = this.formatDatas(this.datas);
				this.initChart();
				this.initEventsObj();
				this.execReadyList();
				this.initComplete = true;
			}else if(this.ajax) {
				var me  = this;
				this.ajaxData(null,null,function(datas){
					me.datas = datas;
					me.initChart();
					me.initEventsObj();
					this.execReadyList();
					this.initComplete = true;
				});
			}
		
	}
	
	Chartbox.prototype = {
		constructor: Chartbox
		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		,init: function(){
			var me = this;
			if(!this.width) {
				this.width = this.container.width();
				this.height = this.container.height();
			}
			var html = '<div class="chart-box" style="height:'+this.height+'px;width:'+this.width+'px"><div class="box-header"></div><div class="canvas-box">'+
								'<div class="chart-status"></div>'+
								'<canvas style="position:absolute;top:0;left:0"></canvas>'+
								'<div class="canvas-tip" style="position: absolute; top:0; left:0; width:100% "></div>'
							'</div></div>';
			
			this.wrap = $(html).appendTo(this.container);
			var boxHeader = this.wrap.find('.box-header');
			this.boxHeader = boxHeader;
			this.canvasBox = this.wrap.find('.canvas-box');
			this.canvasTipEle = this.canvasBox.find('.canvas-tip');
			this.canvas = this.canvasBox.find('canvas')[0];
			this.statusEle = this.canvasBox.find('.chart-status');
			this.headerHeight = boxHeader.outerHeight();	//边框没算进去
			
			this.setTitle(this.title);
	
			this.ctx = this.canvas.getContext('2d');
			this.computedSize();
	
			this.canvasBox.css({height:this.canvas.height,width:this.canvas.width});
	
			this.boxHeader.on('click',function(e){
				var target = $(e.target);
				function stopDefault(e){
					e.stopPropagation();
					e.stopDefault();
				}
				if(target.is('.win-close')){
					me.destroy();
					stopDefault(e);
					return;
				}
	
				if(target.is('.win-big')) {
					me.zoomUp();
					stopDefault(e);
					return;
				}
	
				if(target.is('.win-small')) {
					me.zoomOut();
					stopDefault(e);
					return ;
				}
				me.callbacks.onBoxTitleClick.call(me,me.title);
			})
	
		}
	
		/**
		 * 初始化各种图表
		 * @return {[type]} [description]
		 */
		,initChart: function(){
			this.painting = true;
			var me = this, chartOpts = this.chartOpts, areas = chartOpts.areas, items = areas.items, theme = chartOpts.theme;
			if(chartOpts.xAxis) {
				items.push('xAxis');
			}
			//获取表的需要显示的数据
			me.initBackgroundGrid(true);
			this.getShowDatas();
			
	
			for(var i=0,len = items.length; i<len;i++) {
				var cur = items[i];
				this.initAreaChart(cur);
				this.initAreaTip(cur);
			}
			this.drawMainAreaLines();
			this.painting = false;	
	
		}
		/**
		 * 初始化canvas背景
		 * @param  {[type]} resize [是否需要重新计算各高度]
		 * @return {[type]}        [description]
		 */
		,initBackgroundGrid: function(resize){
			//画背景
			if(resize) {
				var isNormal = this.computedAreaHeight();
				if(isNormal===false) {
					return false;
				}
			}
			var chartOpts = this.chartOpts,theme = chartOpts.theme;
			this.drawBackground(this.canvas.width, this.canvas.height, theme.backgroundColor);
			
			
			if(chartOpts.yAxis&&chartOpts.yAxis.width) {
				var width = this.mainRegionWidth + chartOpts.areas.right;
				core.drawVLine(this.ctx, theme.lineColor, width, 0, this.canvas.height,'solid');
			}
			var chartOpts = this.chartOpts, areas = chartOpts.areas, items = areas.items, theme = chartOpts.theme;
			var top=0,left=0;
			for(var i=0,len = items.length; i<len;i++) {
				var cur = items[i];
				var opts = chartOpts[cur];
				if(i!==0) {
					core.drawHLine(this.ctx, theme.lineColor, left, top,this.canvas.width,'solid');
				}
				var bottom = opts.bottom||0
				top += (opts.top||0)+(bottom+1);
				top += opts.height;
			}
			
		}
		/**
		 * 画背景
		 */
		,drawBackground: function(width, height, backgroundColor){
			var ctx = this.ctx;
			ctx.clearRect(0,0,width,height);
			if(backgroundColor) {
	            ctx.beginPath();
	            ctx.fillStyle = backgroundColor;
	            ctx.rect(0, 0, width, height);
	            ctx.fill();
	            ctx.closePath();
	        }
		}
	
		,computedSize: function(){
			var computedHeight = this.height - this.headerHeight;	
			var computedWidth = this.width-2;
			this.canvas.height = computedHeight;
			this.canvas.width  = computedWidth;
		}
	
		//计算各区域的高度，有可能主屏高度是没有配置的，默认第一个是主图，除主图外所以的图没有高度默认80好了
		,computedAreaHeight: function(){
			var chartOpts = this.chartOpts, areas = chartOpts.areas, items = areas.items;
			//y轴区域
			var mainRegionWidth=0;
			if(chartOpts.yAxis&&chartOpts.yAxis.width) {
				mainRegionWidth = this.canvas.width - chartOpts.yAxis.width;			
			}
			if(chartOpts.areas.right) {
				mainRegionWidth = mainRegionWidth - chartOpts.areas.right;
			}
			this.mainRegionWidth = mainRegionWidth;
	
			//其他区域
			var mainAreaHeight = 0,usedHeight=0,mainAreaKeyName;
			
			for(var i=0,len = items.length; i<len;i++) {
				var cur = items[i], opts = chartOpts[cur];
				if(!opts) {
					throw new Error('没有设置'+cur+"区域的配置");
				}
				chartOpts[cur].width = this.mainRegionWidth;
				var top = opts.top||0,bottom = opts.bottom||0;
				
				if(i==0) {
					mainAreaKeyName = cur;
					usedHeight += top + bottom;
					continue;
				}
				opts.height = opts.height||80;
				usedHeight += top + opts.height + bottom;
	
				
			}
			chartOpts[mainAreaKeyName].height = this.canvas.height - usedHeight;
			
	
			i=0;
			usedHeight = 0;
			for(var i=0,len = items.length; i<len;i++) {
				var cur = items[i], opts = chartOpts[cur];
				chartOpts[cur].x = 0;
				chartOpts[cur].y  = usedHeight;
				chartOpts[cur].margin  = chartOpts.areas.right;
				var bot = opts.bottom||0
				usedHeight +=(opts.top||0) + opts.height + (bot+1);
			}
		}
	
		//生成区域对应的图表
		,initAreaChart: function(areaName) {
			var opts = this.chartOpts[areaName];
			if(areaName=='xAxis') {
				opts.type  = 'xAxis';
			}
			if(!opts.type) {
				throw new Error('请设置'+areaName+'区域的图表类型');
				return false;
			}
			//opts.width = this.mainRegionWidth;
	
			if(opts.subItem&&!opts.hasInit) {
				for(var chart in opts.subItem) {
					this.chartList[areaName]
				}
			}
			
			var type = opts.type.toString().toLowerCase();
			var chartObj = this.chartObjFactory(type,areaName);
			if(chartObj) {
				this.chartList[areaName] = chartObj;
				chartObj.painter();
			}
	
			if(opts.yAixs) {
				var yAixsChart = this.chartObjFactory('yaixs',areaName);
			}
			
		}
	
		,changeAreaChart: function(areaName,opts) {
			var oldOpts = this.chartOpts[areaName];
			if(!oldOpts) {
				return false;
			}
			delete oldOpts.high;
			delete oldOpts.low;
			if(opts) {
				$.extend(oldOpts,opts);
				this.chartOpts[areaName] = oldOpts;
			}
			var height = oldOpts.height+oldOpts.top+oldOpts.bottom;
			var theme = this.chartOpts.theme;
			this.drawBackground(this.width,height, theme.backgroundColor);
			core.drawVLine(this.ctx, theme.lineColor, this.mainRegionWidth+oldOpts.margin, oldOpts.y, height,'solid');
			
	
			this.initAreaChart(areaName);
	
		}
		,initAreaTip: function(areaName) {
			var opts = this.chartOpts[areaName];
			if(!opts||areaName=='xAxis') {
				return false;
			}
			var index = this.showDatas.length-1;
			var tip = this.getAreaTip(areaName,index);
			if(tip) {
				this.tipList[areaName] = $('<div class="area-tip" style="position:absolute; left:0; top:'+(opts.y+2)+'px;" >'+tip+'</div>').appendTo(this.canvasTipEle);
			}
		}
	
		,getAreaTip: function(areaName,index,follow) {
			var chartList = this.chartList;
			var tip='';
			if(chartList[areaName]) {
				tip += chartList[areaName].getTip(index,follow);
				var areaSubItem = chartList[areaName+"subItem"];
				if(areaSubItem&&areaSubItem.getTip) {
					tip += areaSubItem.getTip.call(areaSubItem,index,follow);
				}
				var chartSubItem = chartList[areaName].subItem;
				if(chartSubItem&&chartSubItem.getTip) {
					tip += chartSubItem.getTip.call(chartSubItem,index,follow);
				}
			}
			return tip;
		}
	
		,initEventsObj: function(){
			if(!this.events) {
				return false;
			}
	
			var canvas = $('<canvas style="position:absolute; top:0; left: 0;" width="'+this.canvas.width+'" height="'+this.canvas.height+'"></canvas>').insertBefore(this.canvasTipEle);
			this.eventsCanvas = canvas[0];
	
	
			if(this.events.drag) {
				this.eventList['drag'] = new DragEvent(this.eventsCanvas,this);
			}
	
			if(this.events.wheel) {
				this.eventList['wheel'] = new WheelEvent(this.eventsCanvas,this);
			}
	
			if(this.events.crossLine) {
				this.eventList['crossLine'] = new CrossLineEvent(this.eventsCanvas,this);
			}
	
			if(this.events.rightClick) {
				this.eventList['rightClick'] = new RightClickEvent(this.eventsCanvas,this);
			}
	
		}
	
		,execReadyList: function(){
			while(this.readyList.length) {
				var fn = this.readyList.shift();
				fn&&fn();
			}
		}
	
		/**
		 * 各种不同种类的chart工厂方法
		 * @param  {[string]}  type      [插入类型]
		 * @param  {[string]}  areaName  [所在的区域名称]
		 * @param  {[boolean]} subId [是否是所以区域里的子chart]
		 * @return {[object]}            [返回生成的对象]
		 */
		,chartObjFactory: function(type,areaName,subId){
			var chartObj;
			var type = type.toString().toLowerCase();
			switch(type) {
				case 'candlestick':
					chartObj = new CandlestickChart(areaName, this, subId);
				break;
				case 'hollowcandle':
					chartObj = new HollowCandleChart(areaName, this, subId);
				break;
				case 'polyline':
					chartObj = new PolylineChart(areaName, this, subId);
					break;
				case 'volume':
					chartObj = new VolumeChart(areaName, this, subId);
				break;
				case 'xaxis':
					chartObj = new XAxisChart(areaName, this, subId);
				break;
				case 'ma':
					chartObj = new MAChart(areaName,this, subId);
				break;
			}
			return chartObj;
		}
		/**
		 * 计算当前所在图表需要显示数据在所在数据里面的索引
		 * @return {[obj]} [显示数据的起始索引]
		 */
		,calcDataRanges: function(){
			var chartOpts  = this.chartOpts, theme = chartOpts.theme, datas = this.datas;
			var needResetBarWidth = this.zoom, maxDataLength = datas.length, totalWidth = this.mainRegionWidth;
			if(this.dataRanges == null) {
	            //计算dataRanges
	            var dataCount = Math.ceil(totalWidth / (theme.spaceWidth + theme.barWidth));
	            if (dataCount > maxDataLength){
	                dataCount = maxDataLength;
	                needResetBarWidth = true;
	            };
	            this.dataRanges = {
	                start: maxDataLength - dataCount,
	                to: maxDataLength -1,
	            };
	        }
	
	
	        //检查dataRanges是否合理
	        var startIndex = this.dataRanges.start, toIndex = this.dataRanges.to;
	        var itemsCount = this.dataRanges.to - this.dataRanges.start+1;
	        var minShowCount = chartOpts.minShowCount,maxShowCount = chartOpts.maxShowCount;
	
	        /*var tempDataRanges = this.checkDataRanges();
	        var tempCount = tempDataRanges.to - tempDataRanges.start +1;
	
	        if(tempCount!==itemsCount) {
	        	needResetBarWidth = true;
	        	itemsCount =tempCount;
	        }*/
	
	        if(needResetBarWidth) {
	            var spaceWidth,barWidth;
	            var perWidth = this.mainRegionWidth/itemsCount;
	            barWidth = Math.ceil(perWidth*2/3);
	            barWidth = barWidth >= perWidth ? perWidth: barWidth;
	            if(barWidth<=2) {
	                spaceWidth = 0;
	            }else {
	                spaceWidth = perWidth - barWidth;
	            }
	            spaceWidth = perWidth - barWidth;
	            chartOpts.theme.barWidth = barWidth;
	            chartOpts.theme.spaceWidth = spaceWidth;
	            
	            this.zoom = false;
	        }
	
	        return this.dataRanges;
		}
		,checkDataRanges: function(dataRanges){
			var dataRanges = dataRanges||this.dataRanges;
			var startIndex = dataRanges.start,toIndex = dataRanges.to;
	        var itemsCount = toIndex - startIndex + 1;
	
	        var start = startIndex,to = toIndex, chartOpts = this.chartOpts, maxDataLength = this.datas.length;
	        var minShowCount = chartOpts.minShowCount,maxShowCount = chartOpts.maxShowCount;
	        //处理临界值，主要是拖拽
	        if( to< minShowCount) {
	        	to = minShowCount -1;
	        	start = to - itemsCount;
	        }else if(start > maxDataLength - minShowCount){
	        	start = maxDataLength - minShowCount;
	        	to = start + itemsCount -1;
	        }
	        
	        //处理是否显示在最大个数与最小个数之间,主要是缩放
	        
	        if(itemsCount<minShowCount) {
	        	start = to - (minShowCount-1)
	        }
	        if(itemsCount > maxShowCount) {
	        	start = to - (maxShowCount-1)
	        }
	        
	        return {start: start,to :to}
		}
		/**
		 * 跟据起始索引得到显示在图表上的数据
		 * @return {[Array]}      [返回数据数组]
		 */
		,getShowDatas: function(){
			if(!this.dataRanges||this.zoom) {
				this.calcDataRanges();
			}
			var dataRanges = this.dataRanges, datas = this.datas, maxDataLength = datas.length,totalWidth = this.mainRegionWidth;
			var filteredData = [];
			for(var i=dataRanges.start; i<=dataRanges.to; i++) {
				if(i < 0||i>maxDataLength-1) {
					filteredData.push(false);
				}else {
					filteredData.push(datas[i]);
				}
			}
	        this.showDatas = filteredData;
		}
		,calcAreaDataValueRange: function(areaName){
			var datas = this.showDatas;
	        var opts = this.chartOpts[areaName];
	        var high,low,dotLen=3;
	        for(var line in opts.lines) {
	            var cur = opts.lines[line];
	            high = high ? Math.max(cur.value,high) : cur.value;
	            low = low ? Math.min(cur.value,low) : cur.low;
	        }
	        for(var i=0,len = datas.length;i<len;i++) {
	            var val = datas[i];
	            if(val) {
	                high = high ? Math.max(val.high, high) : val.high;
	                low = low ? Math.min(low, val.low) : val.low;
	                var highStr = val.high.toString(), highDotLen = highStr.length - highStr.indexOf('.') -1;
	                dotLen = Math.max(highDotLen,dotLen);
	            }
	        }
	        this.chartOpts[areaName].high = high;
	        this.chartOpts[areaName].low = low;
	        if(!this.chartOpts[areaName].length){
	            this.chartOpts[areaName].dotLen = dotLen
	        }
		}
	
		//这四个方法由于设计上的缺陷，现没有办法更好的优化了，不应该放到这个对象里的，应该放到Area【新建】对象里
		,drawMainAreaLines: function(isDrawMarketPrice){
			var isDraw = isDrawMarketPrice;
			var mainAreaOpts = this.chartOpts.mainArea;
			if(isDraw!==false){
				
				if(mainAreaOpts.marketPriceLine&&mainAreaOpts.marketPriceLine.show) {
					this.drawMainAreaLine('marketPrice',{'label':'市价'})
				}
			}
			var lines = mainAreaOpts.lines||{};
			for(var line in lines) {
				var opts = lines[line];
				this.drawMainAreaLine(line,opts);
			}
		}
		,drawMainAreaLine: function(key,lineOpts){
			var defaultOpts = this.chartOpts.theme.horizontalLineOpts,ctx = this.ctx;
			var opts = $.extend({},defaultOpts,lineOpts);
			if(key=='marketPrice') {
				var latestData = this.datas[this.datas.length-1]
				opts.value = latestData.close;
				var color = this.getColor(latestData.close,latestData.open);
				if(!color) {
					color = defaultOpts.bgColor;
				}
				opts.lineColor = opts.bgColor = color;
			}
			
			if(!opts.value) {
				return false;
			}
	
			//得到y轴的坐标
			var y = this.getYByValue(opts.value,'mainArea');
			if(!y) {
				return false;
			}
			var mainAreaOpts = this.chartOpts.mainArea;
			ctx.save();
			ctx.translate(mainAreaOpts.left,mainAreaOpts.top);
	
			//画线
			var w = this.mainRegionWidth +this.chartOpts.areas.right;
			core.drawHLine(this.ctx,opts.lineColor, 0, y, w, 'dashed');
			//画Y轴的数据
			var yAxisWidth = this.chartOpts.yAxis.width;
			ctx.fillStyle = opts.bgColor;
			ctx.fillRect(w+1, y-10, yAxisWidth, 20);
			ctx.strokeStyle = this.chartOpts.theme.lineColor;
			ctx.strokeRect(w+1, y-10, yAxisWidth, 20);
			ctx.fillStyle = opts.color;
			ctx.font = opts.font;
			var text = core.toMoney(opts.value,mainAreaOpts.dotLen);
			ctx.fillText(text,w+7, y+5);
			if(opts.label) {
				ctx.textAlign = 'end';
				ctx.fillText(opts.label,this.canvas.width-5,y+5);
			}
			
			this.ctx.restore();
		}
		,setMainAreaLines: function(){
			var args = arguments;
			if(args.length==1) {
				this.chartOpts.mainArea.lines = args[0]
			}else if(args.length==2) {
				var lines = this.chartOpts.mainArea.lines||{};
				if(!args[1]) return false;
				var key = args[0],opts = args[1];
				if(lines.key) {
					delete lines.key
				}
				lines[key] = opts;
			}	
			
		}
		,deleteMainAreaLine: function(key){
			var lines = this.chartOpts.mainArea.lines;
			if(key) {
				delete this.chartOpts.mainArea.lines[key]
			}else{
				this.chartOpts.mainArea.lines = {}
			}
		}
		//end
		/**
		 * 画图，初始化的时候不需要
		 * @param  {[object]} dataRanges [数据范围]
		 * @param  {[object]} opts       [需要重置的配置，或者回调函数]
		 * @param  {[boolean]} resize     [是否需要重新计算size]
		 * @return {[type]}            [description]
		 */
		,painter: function(dataRanges,opts,resize) {
			var args = arguments;
			if(this.painting==true) {
				return false;
			}
	
			if(dataRanges) {
				var tempRanges  = this.checkDataRanges(dataRanges);
				if(this.dataRanges.to ==tempRanges.to&& this.dataRanges.start == tempRanges.start) {
					return false;
				}else {
					this.dataRanges = tempRanges;
				}
			}
			var callback;
			if($.type(args[1])=='object') {
				this.chartObj = $.extend(true,this.chartObj,opts);
			}else if($.type(args[1])=='function') {
				callback = args[1];
			}
	
			this.painting = true;
			this.initBackgroundGrid(resize);
			//重新计算需要显示的数据
			this.getShowDatas();
	
			var chartList = this.chartList;
			for(var chart in chartList) {
				chartList[chart].painter();
			}
			this.drawMainAreaLines();
			this.painting = false;
			callback&&callback();
		}
	
		/**
		 * 当painter.start<0自动去加载数据
		 * @return {[type]} [description]
		 */
		,autoLoadData: function(){
			var me = this,datas = me.datas, len = datas.length, dataRanges = this.dataRanges;
			if(dataRanges.start>=0&&dataRanges.to<len){
				return false;
			}
			var autoTime = this.autoTimestamp;
			var now = +new Date();
			if( !autoTime||now - autoTime >1000) {
				if(dataRanges.start < 0) {
					var startX = me.datas[0]['quoteTime'];
					me.ajaxData(null ,startX, function(datas){
						me.appendDatas(datas,-1);
						me.painter();
					})
				}else if(dataRanges.to > me.datas.length-1) {
					var endX = me.datas[me.datas.length-1]['quoteTime'];
					me.ajaxData(endX, null, function(datas){
						me.appendDatas(datas,1);
						me.painter();
					})
				}
	
				this.autoTimestamp = now;
			}
		}
		
		/**
		 * 添加数据
		 * @param  {[Array]} datas [需要添加数据]
		 * @param  {[int ]} dir   [-1：向左添加 1：向右添加]
		 * @return {[type]}       [description]
		 */
		,appendDatas: function(datas,dir) {
			var dataRanges = this.dataRanges, start = dataRanges.start, to = dataRanges.to;
			var count = datas.length;
			if(dir==-1||start < 0) {
				Array.prototype.unshift.apply(this.datas,datas);
				this.dataRanges = {start: start+count, to: to+count};
				for(var event in this.eventList) {
					if(this.eventList[event].dataRanges) {
						this.eventList[event].dataRanges = this.dataRanges;
					}
				}
			}else if(dir==1||to > this.datas.length-1) {
				Array.prototype.push.apply(this.datas,datas);
			}
		}
	
		/**
		 * 使用ajax去加载数据
		 * @param  {[timestamp]} startX     [开始时间,返回这个时间之后的1000条数据，包括他本身]
		 * @param  {[timestamp]} endX       [结束时间,返回这个时间之前的1000条数据，包括他本身]
		 * @param  {[function]} callbackFn  [回调函数]
		 * @param  {[boolean]}  isFormat  	[是否格式化返回回来的数据,为false才不格式化]
		 * @return {[undefined]}            [description]
		 */
		,ajaxData: function(startX,endX,callbackFn,isFormat,showLoading){
			var ajax = this.ajax;
			if(!ajax&&!ajax.url) {
				return ;
			}
			if(this.ajaxing) {
				return ;
			}
	
			if(startX && startX==this.maxTimestamp) {
				callbackFn&&callbackFn.call(me,[]);
				return ;
			}else if(endX && this.hasNoLeftData ){
				callbackFn&&callbackFn.call(me,[]);
				return ;
			}
	
	
			var me = this;
			this.ajaxing = true;
			if(showLoading!==false){
				this.statusEle.html('<span class="chart-icon chart-load"></span><span class="chart-text">正在加载数据。。。</span>')
			}
	
			var url = ajax.url;
			if($.type(url)=='function') {
				url = url.call(me);
			}
			
			var data = {};
			if($.type(ajax.data)=='object') {
				data = ajax.data;
			}else if($.type(ajax.data)=='function') {
				data = ajax.data.call(me, startX, endX );
			}
	
			$.ajax({
				url: url,
				data: data,
	
			}).done(function(response){
				me.ajaxing  = false;
				var data = response;
				if( ajax.formatDatas && $.type(ajax.formatDatas)=='function' ) {
					data = ajax.formatDatas.call(me,response);
				}
				if(!data) {
					error()
					return false;
				}
				if(!data.length) {
					if(endX) {me.hasNoLeftData = true}
					error()
					return false;
				}
				if(me.datas) {
					var currDatas = me.datas;
					//说明往左加载数据，最后一个数据可能需要去重，因为返回的数据是双闭合状态，也有可能不是，返回现在情部用的是双闭合
					if(endX) {
						var lastData = data[data.length-1];
						if(lastData[0]==currDatas[0]['quoteTime']) {
							data.pop();
						}
						//表明左侧数据己经没有可以加载的了
						if(data.length==0) {
							me.hasNoLeftData = true;
							return false;
						}
					}else if(startX) {
						var firstTime = data[0][0];
						if(firstTime == currDatas[currDatas.length-1]) {
							data.shift();
						}
	
						if(!data.length) {
							return false;
						}
					}
				}
				if(isFormat!==false) {
					data = me.formatDatas(data);
				}
				
				callbackFn&&callbackFn.call(me,data);
				error();
	
			}).fail(function(){
				me.ajaxing = false;
				me.statusEle.html('请求数据失败');
				me.errorTimer&&clearTimeout(me.errorTimer);
				me.errorTimer = setTimeout(function(){
					error();
				},1000)
				return false;
			})
	
			function error(){
				me.statusEle.html('');
			}
		}
	
		/**
		 * 跟据x轴的坐标获取对应数据的index和正确的x轴坐标,这里的对应数据是显示数据，不是总数据
		 * @param  {[float]} x [x轴坐标，当然是相对值 ]
		 * @return {[type]}   [description]
		 */
		,adjustX: function(x){
			if(x > this.mainRegionWidth) {
				x = this.mainRegionWidth;
			}
			var dataCount = this.showDatas.length;
			var index = Math.ceil((dataCount)*x/this.mainRegionWidth);
			index = index==0 ? 0 : index-1;
			var xPos = core.getXByShowDataIndex(index,this.chartOpts.theme.barWidth,this.chartOpts.theme.spaceWidth);
			return {index:index, x: xPos };
		}
		,getXByValue: function(value){
			var showDatas = this.showDatas;
			var data = [],max=0,min=0,index,xPos;
			for(var i=0,len = showDatas.length;i<len;i++) {
				var cur = showDatas[i];
				if(!cur) continue;
				if(cur.quoteTime==value) {
					index = i;
					break;
				}
			}
			if(index) {
				xPos = core.getXByShowDataIndex(index,this.chartOpts.theme.barWidth,this.chartOpts.theme.spaceWidth);
			}
			return {index:index,x:xPos}
		}
		,getYByValue: function(value,areaName,isTotal) {
	        var charOpts = this.chartOpts, opts = charOpts[areaName];
	        var high = opts.high,low  = opts.low,ret;
	        var value = parseFloat(value);
	        if(value >= low && value <=high) {
	            ret = core.getRelativeYByShowDataValue(value, high, low, opts.height);
	            if(ret<=opts.height) {
					if(isTotal) {
		                ret +=opts.y+opts.top;
		            }
	            }else {
	            	ret=null;
	            }
	        }
	        return ret;
	    }
		/**
		 * 根据传递的值，比较大小返回对应使用的颜色
		 * @param  {[float]} referVal [需要对比的值]
		 * @param  {[float]} target   [对比值]
		 * @return {[string]}         [是riseColor还是fallColor]
		 */
		,getColor: function(referVal,target){
	        var fallColor = this.chartOpts.theme.fallColor, riseColor = this.chartOpts.theme.riseColor, color='';
	        if(referVal > target) {
	            color = fallColor;
	        }else if(referVal < target) {
	            color = riseColor;
	        }
	        return color;
	    }
	
		/**
		 * 改变title
		 * @param {[type]} title [description]
		 */
		,setTitle: function(title) {
			var title = title,ret;
			if(typeof title=='string'){
				ret = title;
			}else if(typeof title=='object') {
				if(!this.formatTitleTpl) {
					return false;
				}
				ret = this.formatTitleTpl(title);
			}
			this.boxHeader.html(ret);
		}
	
		/**
		 * 从时间得到此时间在数据集合里的index
		 * @param  {[type]} time [时间]
		 * @param  {[type]} dir  
		 *         如果是向右拉，则是向左边请求值即请求时间较小的值，那么这时的dir是-1，反之为1。
		 *         因为这个时间可能是datas里不是存在的，只能得到这个时间在数据集里最近在两个值的index，
		 *         这个时候需要你要取左边的值还是右边的值
		 * @return {[int]}      [在数据集里的index]
		 */
		,getXIndexByTime: function(time,dir){
			var datas = this.datas;
			var upper = datas.length-1;
			var lower = 0, mid;
			var retIndex = -1;;
			var min = datas[0].quoteTime, max = datas[upper].quoteTime;
			var start = this.dataRanges.start, to = this.dataRanges.to;
			//当前显示的
			if(start >= lower){
				var startMin = datas[start].quoteTime;
				if(time >=startMin) {
					lower = start;
					min = startMin;
				}
			}
	
			if(to <= upper) {
				var toMax = datas[to].quoteTime;
				if(time <=toMax) {
					upper = to;
					max = toMax;
				}
			}
	
			if(time==min) {
				retIndex = lower;
			}else if(time==max) {
				retIndex = upper;
			}else  {
				while(upper-lower>1) {
					mid = Math.floor((upper+lower)/2);
					if(datas[mid].quoteTime < time) {
						lower  = mid +1;
					}else if(datas[mid].quoteTime > time) {
						upper = mid -1;
					}else {
						retIndex = mid;
						break;
					}
				}
	
				if(retIndex==-1) {
					retIndex = dir ? upper : upper-1;
				}
			}
			
			return retIndex;
		}
	
		/**
		 * 使用ajax同步X轴
		 * @return {[type]} [description]
		 */
		,synchronizeX: function(time,dir,barWidth,spaceWidth){
			var minTime = this.datas[0].quoteTime, maxTime = this.datas[this.datas.length-1].quoteTime;
			var me = this;
			if(typeof time=='object') {
				this.painter(time,function(){
					me.autoLoadData();
				})
			}else if(time <minTime) {
				//指定时间比当前值小
				me.ajaxData(null,minTime,function(datas){
					if(datas.length) {
						me.appendDatas(datas,-1);
						me.synchronizeX(time,dir,barWidth,spaceWidth);
					}else {
						me.synchronizeX(minTime,dir,barWidth,spaceWidth);
					}
				})
			}else if(time > maxTime) {
				//指定时间比当前值大,只能说真没有这个值了
				me.synchronizeX(maxTime,dir,barWidth,spaceWidth);
			}else {
				var index = this.getXIndexByTime(time,dir);
				if(index!==-1) {
					if(barWidth) {
						this.chartOpts.theme.barWidth = barWidth;
					}
					if(spaceWidth){
						this.chartOpts.theme.spaceWidth = spaceWidth;
					}
					if(barWidth||spaceWidth) {
						var bWidth = this.chartOpts.theme.barWidth,sWidth = this.chartOpts.theme.spaceWidth;
						count = Math.floor(this.mainRegionWidth/(bWidth+sWidth))-1;
					}else {
						count = this.dataRanges.to - this.dataRanges.start;
					}
					var start,to;
					if(dir) {
						to = index;
						start = index - count;
					}else {
						start = index;
						to = index + count;
					}
					this.painter({start:start,to:to},function(){
						me.autoLoadData();
					})
				}
			}
			
		}
	
		/**
		 * 重置数据
		 * @param {Array} data [description]
		 */
		,setDatas: function(datas){
			if(!datas) {
				return false;
			}
			this.datas = datas;
		}
	
		/**
		 * 当dom的width和height改变时调用
		 * @return {[type]} [description]
		 */
		,resize: function(){
			if(!this.initComplete){return false;}
			var width = this.container.width(),height = this.container.height();
			if(width==this.width&&height==this.height){
				return false;
			}
			this.width = this.container.width();
			this.height = this.container.height();
			this.computedSize();
			this.wrap.css({width:this.width,height: this.height});
			this.canvasBox.css({height:this.canvas.height,width:this.canvas.width});
			this.eventsCanvas.width = this.canvas.width;
			this.eventsCanvas.height = this.canvas.height;
			
			this.zoom = true;
			this.painter(null,null,true);
			for(var area in this.tipList) {
				var opts = this.chartOpts[area];
				this.tipList[area].css('top',opts.y+2);
			}
		}
	
		/**
		 * 销毁
		 * @return {[type]} [description]
		 */
		,destroy: function(){
			this.container.remove(this.wrap);
		}
	
		/**
		 * 格式化数据
		 * @param {Array} data [不符合格式的数据]
		 * @return {[Array]} [description]
		 */
		,formatDatas: function(data){
			var result = [];
		    for (var i = 0; i < data.length; i++) {
	            //20111215,11.68,11.65,11.76,11.40,11.41,43356655,502325991
	            //日期,昨收,开盘价,高,低，收,量，额
		        var rawData = data[i];
	            if(rawData) {
	                var item = {
	                    quoteTime: rawData[0],
	                    preClose: rawData[1],
	                    open: rawData[2],
	                    high: rawData[3],
	                    low: rawData[4],
	                    close: rawData[5],
	                    volume: rawData[6],
	                    amount: rawData[7],
	                    avg: parseFloat(core.toMoney((rawData[3]+rawData[4])/2,5))
	                };
	                result.push(item);
	            }
		    }
		    var tempTimestamp = this.maxTimestamp||0;
		    this.maxTimestamp = Math.max(data[data.length-1][0],tempTimestamp);
		    return result;
		}
	}
	
	module.exports = Chartbox;


/***/ },
/* 9 */
/***/ function(module, exports) {

	
	if(!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (item, index) {
	        var n = this.length,
	                i = ~~index
	        if (i < 0)
	            i += n
	        for (; i < n; i++)
	            if (this[i] === item)
	                return i
	        return -1
	    }
	}
	
	module.exports = {
		toMoney: function (number, decimals, point, thousands){
	        //form http://phpjs.org/functions/number_format/
	        //number    必需，要格式化的数字
	        //decimals  可选，规定多少个小数位。
	        //point 可选，规定用作小数点的字符串（默认为 . ）。
	        //thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
	        number = (number + '')
	                .replace(/[^0-9+\-Ee.]/g, '')
	        var n = !isFinite(+number) ? 0 : +number,
	                prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
	                sep = thousands || ",",
	                dec = point || ".",
	                s = '',
	                toFixedFix = function(n, prec) {
	                    var k = Math.pow(10, prec)
	                    return '' + (Math.round(n * k) / k)
	                            .toFixed(prec)
	                }
	        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
	                .split('.')
	        if (s[0].length > 3) {
	            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	        }
	        if ((s[1] || '')
	                .length < prec) {
	            s[1] = s[1] || ''
	            s[1] += new Array(prec - s[1].length + 1)
	                    .join('0')
	        }
	        return s.join(dec)
	    },
		bigNumberToText: function (val) {
	        var result;
	        var yi = val / 100000000;
	        if (yi > 1) {
	            result = yi.toFixed(2) + '亿';
	        } else {
	            var wan = val / 10000;
	            if (wan > 1)
	                result = wan.toFixed(2) + '万';
	            else
	                result = val;
	        }
	        return result;
	    },
	    /**
	     * 日期转换函数
	     * @param  {[longer]} val    [时间戳]
	     * @param  {[int]} period [当前图显示的时间段1,5,30,60,100[1min,5min,30min,60min,1day]]
	     * @return {[type]}        [description]
	     */
	    convertDate: function(val,period,showYear){
	    	var time = '',ymd='',hour,minute,date = new Date(val);
	        if(period>=100) {
	            var year = date.getFullYear();
	            var month = date.getMonth()+1;
	            var day = date.getDate();
	            month = month<10 ? '0'+month: month;
	            day = day<10 ? '0'+day : day;
	            ymd = year + '-' + month + '-' + day;
	        }
	        if(showYear||period<100) {
	            var hour = date.getHours();
	            var minute = date.getMinutes();
	            hour = hour<10 ? '0'+hour : hour;
	            minute = minute<10 ? '0'+minute: minute;
	            time = hour +":" + minute;
	            if(ymd) {
	                time = ' '+time;
	            }
	        }
	        
	        return  ymd+time;
	    },
	    throttle: function(fn,delay) {
	        var timer = null;
	        var t_start;
	        delay = delay||200;
	
	        return function() {
	            var context = this,t_curr = +new Date();
	            if(!t_start) {
	                t_start = t_curr;
	            }
	            var args = arguments;
	            if(t_curr - t_start <delay) {
	                clearTimeout(timer);
	                timer = setTimeout(function(){
	                    fn.apply(context,args);
	                },delay)
	            }else {
	                fn.apply(context,args);
	                t_start = t_curr;
	            }
	            
	        }
	    },
	
	    objectCreate: function(){
	        if(Object.create) {
	            return Object.create;
	        }else {
	            return function(o){
	                
	            }
	        }
	        /*var F = function(){};
	        F.prototype = o;
	        return new F();*/
	    },
	
	    drawHLine: function (ctx,color, x0, y0, w, lineStyle) {
	        ctx.strokeStyle = color;
	        var dashSize = 3;
	        if (y0 * 10 % 10 == 0) y0 += .5;
	        if (lineStyle && lineStyle == 'dashed') {
	            var width = 0;
	            do {
	                this.drawHLine(ctx,color, width, y0, dashSize, 1, 'solid');
	                width += dashSize * 2;
	            } while (width < w);
	        }
	        else {
	            ctx.beginPath();
	            ctx.moveTo(x0, y0);
	            ctx.lineTo(x0 + w, y0);
	            ctx.stroke();
	        }
	    },
	    drawVLine: function (ctx,color, x0, y0, h, lineStyle) {
	        ctx.strokeStyle = color;
	        var dashSize = 3;
	        if (x0 * 10 % 10 == 0) x0 += .5;
	        if (lineStyle && lineStyle == 'dashed') {
	            var height = 0;
	            do {
	                this.drawVLine(ctx,color, x0, height, dashSize, 1);
	                height += dashSize * 2;
	            } while (height < h);
	        }
	        else {
	            ctx.beginPath();
	            ctx.moveTo(x0, y0);
	            ctx.lineTo(x0, y0 + h);
	            ctx.stroke();
	
	        }
	    },
	    getXByShowDataIndex: function(i, barWidth, spaceWidth) {
	        var result = i*(spaceWidth+barWidth) + barWidth*.5;
	        if(result*10%10==0) result +=.5;
	        return result;
	    },
	    getRelativeYByShowDataValue: function(value, high, low, height){
	        var result = Math.ceil((high - value)*height/(high - low));
	        if (result * 10 % 10 == 0) result += .5;
	        return result;
	    }
	    
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 蜡烛图
	 * @type {[type]}
	 */
	var $ = __webpack_require__(1);
	var core = __webpack_require__(9);
	var YAxisChart = __webpack_require__(11);
	
	
	
	var Candlestick = function(areaName,chartBox){
	    if(!chartBox.showDatas) {
	        console.log('没有数据')
	        return false;
	    }
	    this.chartBox = chartBox;
	    this.name="Candlestick";
	    this.ctx = chartBox.ctx;
	    this.areaName = areaName;
	    this.chartList = {};
	    this.init();
	}
	Candlestick.prototype = {
	    constructor: Candlestick,
	    init: function(){
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName];
	        if(opts.subCharts) {
	            var list = [];
	            for(var chart in opts.subCharts) {
	                var option = opts.subCharts[chart];
	                option.label = chart;
	                list.push(option);
	            }
	            list.sort(function(a,b){
	                return a.sort - b.sort;
	            })
	
	            for(var i=0,cur;cur=list[i++];) {
	                if(cur.show!==false) {
	                    var chartBox = this.chartBox;
	                    var chartObj = chartBox.chartObjFactory.call(chartBox,cur.type,this.areaName,cur.label);
	                    this.chartList[cur.label] = chartObj;
	                }
	            }
	        }
	
	
	
	        if(opts.yAxis) {
	            this.chartList['yAxis'] = new YAxisChart( this.ctx, this.chartBox.chartOpts.yAxis );
	        }
	    },
	
	    painter: function(){
	        var me  = this;
	        this.painting = true;
	        this.ctx.save();
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName], theme = charOpts.theme,height = opts.height, width = opts.width;
	        this.ctx.translate(opts.x,opts.y + opts.top);
	        //画水平底纹线
	        var spaceCount = Math.floor(height /(opts.horizontalLineSpace));
	        var spaceHeight = height / spaceCount;
	        var yPos = [];
	        for(var i=0; i<= spaceCount; i++) {
	            var y = Math.ceil(spaceHeight*i);
	            if (y * 10 % 10 == 0) y += .5;
	            yPos.push(y);
	            if(opts.bottom<=5&&i==spaceCount) {
	                continue;
	            }
	            core.drawHLine.call(core,this.ctx,theme.lineColor,0,y,width+opts.margin,'dashed');
	            
	        }
	
	        this.yPos = yPos;
	       
	        this.getDatasRegion();
	        for(var i in this.chartList) {
	            var chartObj = this.chartList[i];
	            chartObj.getDatasRegion();
	        }        
	       
	
	        //画蜡烛线图 
	        var datas = this.getDatas();
	        this.needCandleRect = !!(theme.barWidth > 1.5);
	        this.currentX = 0;
	        for(var i=0,len = datas.length; i<len;i++) {
	            if(!datas[i]) {
	                continue;
	            }
	            me.drawItem(datas[i],i)
	        }
	
	
	        this.drawYAxisChart();
	        this.ctx.restore();
	
	        //画主图的副图部分
	        for(var i in this.chartList) {
	            if(i=='yAxis') {
	                continue;
	            }
	            var chartObj = this.chartList[i];
	            chartObj.painter();
	        }
	
	        this.painting = false;
	    },
	
	    drawBackground: function(){
	        this.paintCount = this.paintCount||1;
	        if(this.paintCount>1) {
	            var charOpts = this.opts, opts = charOpts[this.areaName];
	            var y = opts.height+opts.top+opts.bottom;
	            this.ctx.clearRect(0,-opts.top,opts.width+opts.margin,y);
	        }
	        this.paintCount++;
	    },
	
	    drawItem: function(ki,i){
	        var me = this,ctx = this.ctx,charOpts = this.chartBox.chartOpts,opts = charOpts[this.areaName], theme = charOpts.theme, datas = this.getDatas(), high = opts.high, low = opts.low;
	        
	        var isRise = ki.close > ki.open;
	        var color = isRise ? theme.riseColor : theme.fallColor;
	
	        var lineX = core.getXByShowDataIndex(i,theme.barWidth,theme.spaceWidth);
	        //currentX？
	        if (!this.currentX) this.currentX = lineX;
	        else {
	            if (lineX - this.currentX < 1) return;
	        }
	        this.currentX = lineX;
	        var topY = core.getRelativeYByShowDataValue(ki.high, high, low, opts.height);
	        var bottomY = core.getRelativeYByShowDataValue(ki.low, high, low, opts.height); 
	        if (me.needCandleRect) {
	           
	            
	            var candleY, candleHeight;
	            if (isRise) {
	                candleY = core.getRelativeYByShowDataValue(ki.close, high, low, opts.height);
	                candleHeight = core.getRelativeYByShowDataValue(ki.open, high, low, opts.height) - candleY;
	            } else {
	                candleY = core.getRelativeYByShowDataValue(ki.open, high, low, opts.height);
	                candleHeight = core.getRelativeYByShowDataValue(ki.close, high, low, opts.height) - candleY;
	            }
	
	            //candleHeight = candleHeight;
	
	            //中间的那条线
	            var candleX = lineX - theme.barWidth / 2;
	            /*ctx.beginPath();
	            ctx.moveTo(lineX, topY);
	            ctx.lineTo(lineX, bottomY);
	            ctx.stroke();*/
	
	            
	           /* ctx.beginPath();
	            ctx.fillRect(candleX, candleY, theme.barWidth, candleHeight);*/
	            this.drawCandle(isRise,lineX,topY,bottomY,[candleX,candleY,theme.barWidth,candleHeight]);
	
	        } else {
	            ctx.strokeStyle = color;
	            //画线
	            ctx.beginPath();
	            ctx.moveTo(lineX, topY);
	            ctx.lineTo(lineX, bottomY);
	            ctx.stroke();
	        }
	    },
	    drawCandle: function(isRise,x,highY,lowY,rect){
	        var me = this,ctx = this.ctx,charOpts = this.chartBox.chartOpts, theme = charOpts.theme
	        var color = isRise ? theme.riseColor : theme.fallColor;
	        ctx.strokeStyle = color;
	        ctx.beginPath();
	        ctx.moveTo(x, highY);
	        ctx.lineTo(x, lowY);
	        ctx.stroke();
	        if(isRise) {
	            ctx.fillStyle = theme.backgroundColor;
	            ctx.beginPath();
	            ctx.fillRect.apply(ctx,rect);
	            ctx.strokeStyle = color;
	            ctx.beginPath();
	            ctx.strokeRect.apply(ctx,rect);
	        }else {
	            ctx.fillStyle = color;
	            ctx.beginPath();
	            ctx.fillRect.apply(ctx,rect);
	        }
	        
	    },
	
	    getDatas: function(){
	        return this.chartBox.showDatas;
	    },
	    //这里主要是算所属区域的最大值和最小值
	    getDatasRegion: function(){
	        this.chartBox.calcAreaDataValueRange.call(this.chartBox,this.areaName);
	        
	    },
	
	    drawYAxisChart: function(){
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName];
	        if(!this.chartList['yAxis']) {
	            return false;
	        }
	        var datas = this.getDatas(), high = opts.high, low = opts.low, yPos = this.yPos, height = opts.height;
	        
	        var result = [];
	        for(var i=0,len = yPos.length; i<len; i++) {
	            var val = high - (high-low)*yPos[i]/height;
	            var v = core.toMoney(val,opts.dotLen);
	            result.push({value:v,y:yPos[i]});
	        }
	        
	        this.chartList['yAxis'].painter(result,{x: opts.width+opts.margin,y:0, height:opts.height})
	    },
	
	    getValueByY: function(y) {
	        var chartOpts = this.chartBox.chartOpts, opts = chartOpts[this.areaName], datas = this.getDatas(), high = opts.high, low = opts.low;
	        var totalHeight = opts.top + opts.height + opts.bottom, dotLen = opts.dotLen, val;
	        var highest = high + (high-low)*opts.top/opts.height;
	        var lowest = low - (high-low)*opts.bottom/opts.height;
	        var val;
	        if(y>opts.y && y < totalHeight+opts.y) {
	            y = y - opts.y;
	            val = core.toMoney(highest - (highest - lowest)*y/totalHeight,dotLen);
	        }
	        return val;
	    },
	
	    
	
	    getTip: function(index,follow){
	        var datas = this.getDatas();
	        var data = datas[index],dotLen = this.chartBox.chartOpts[this.areaName].dotLen;
	
	        var time = core.convertDate(data['quoteTime'],100,true);
	        var openColor = this.chartBox.getColor(data.preClose, data.open), openValue  = core.toMoney(data.open,dotLen);
	        var highColor = this.chartBox.getColor(data.preClose, data.high), highValue = core.toMoney(data.high,dotLen);
	        var lowColor = this.chartBox.getColor(data.preClose, data.low), lowValue = core.toMoney(data.low, dotLen);
	        var closeColor = this.chartBox.getColor(data.preClose, data.close),closeValue = core.toMoney(data.close, dotLen);
	        var ret = '';
	        if(follow){
	            ret = '<span>'+time+'</span>'+
	               '<span>开盘价:<em style="color:'+ openColor +'">'+ openValue +'</em></span>'+
	               '<span>最高价:<em style="color:'+ highColor +'">'+ highValue +'</em></span>'+
	               '<span>最低价:<em style="color:'+ lowColor +'">'+ lowValue +'</em></span>'+
	               '<span>收盘价:<em style="color:'+ closeColor +'">'+ closeValue +'</em></span>'
	        }else {
	            ret = '<span>日期:'+time+'</span>'+
	               '<span>开:<em style="color:'+ openColor +'">'+ openValue +'</em></span>'+
	               '<span>高:<em style="color:'+ highColor +'">'+ highValue +'</em></span>'+
	               '<span>低:<em style="color:'+ lowColor +'">'+ lowValue +'</em></span>'+
	               '<span>收:<em style="color:'+ closeColor +'">'+ closeValue +'</em></span>';
	            for(chart in this.chartList) {
	                var curChart = this.chartList[chart];
	                if(curChart.getTip) {
	                    ret +=curChart.getTip(index,follow);
	                }
	            }
	        }
	        return ret;
	        
	    },
	
	}
	module.exports = Candlestick;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	var core = __webpack_require__(9);
	
	function YAxisChart(ctx, opts){
		this.ctx = ctx;
		this.opts = opts;
	}
	
	YAxisChart.prototype = {
		constructor: YAxisChart,
		painter: function(datas,pos) {
			var ctx = this.ctx,opts = this.opts;
			ctx.save();
			ctx.translate(pos.x,pos.y);
			ctx.fillStyle = opts.color;
			ctx.font = opts.font;
			var height = pos.height;
			for(var j=0,cur;cur = datas[j++];) {
				var lineWidth = 5;
				core.drawHLine.call(core,this.ctx, opts.lineColor, 0, cur.y, lineWidth, 'solid');
				var y = cur.y + 3;
				if(y> height) {
					y = height -2;
				}
				ctx.fillText(cur.value,lineWidth+2,y);
			}
	
			ctx.restore();
	
		},
	
		getDatasRegion:function(){
			
		}
		
	}
	
	module.exports = YAxisChart;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(9);
	
	function VolumeChart(areaName,chartBox){
		if(!chartBox.showDatas) {
	        console.log('没有数据')
	        return false;
	    }
	    this.chartBox = chartBox;
	    this.name="VolumeChart";
	    this.ctx = chartBox.ctx;
	    this.areaName = areaName;
		this.init();
	}
	
	VolumeChart.prototype = {
		constructor: VolumeChart,
		init: function(){},
	
		painter: function(){
			this.painting = true;
			
	        this.ctx.save();
	        var chartOpts = this.chartBox.chartOpts,opts = chartOpts[this.areaName], theme = chartOpts.theme,height = opts.height, width = opts.width;
	        this.ctx.translate(opts.x,opts.y + opts.top);
	
	        //画水平底纹线
	        var spaceCount = Math.floor(height /(opts.horizontalLineSpace));
	        var spaceHeight = height / spaceCount;
	        var yPos = [];
	        for(var i=0; i<= spaceCount; i++) {
	            var y = Math.ceil(spaceHeight*i);
	            if (y * 10 % 10 == 0) y += .5;
	            yPos.push(y);
	            if(opts.bottom<=5&&i==spaceCount) {
	                continue;
	            }
	            core.drawHLine.call(core,this.ctx,opts.lineColor,0,y,width+opts.margin,'dashed');
	        }
	        this.yPos = yPos;
	
	        //画交易量图
	        this.getDatasRegion();
	        var datas = this.getDatas(), high = this.high;
	        i=0;
	        for(var i=0,len = datas.length; i<len;i++) {
	        	if(!datas[i]) {
	        		continue;
	        	}
	            this.drawItem(datas[i],i)
	        }
	        this.ctx.restore();
	        this.painting = false;
		},
		drawBackground: function(){
			this.paintCount = this.paintCount||1;
			if(this.paintCount>1) {			
				var charOpts = this.opts, opts = charOpts[this.areaName];
				var y = opts.height+opts.top+opts.bottom;
				this.ctx.clearRect(0,-opts.top,opts.width+opts.margin,y);
			}
			this.paintCount++;
		},
	
		getDatas: function(){
			return this.chartBox.showDatas;
		},
	
	    getDatasRegion: function(){
	        var datas = this.getDatas();
	        var maxVolume = 0;
	        for(var i=0,len=datas.length;i<len;i++) {
	            if(!datas[i]) {
	                continue;
	            }
	            maxVolume = Math.max(maxVolume,datas[i].volume);
	        }
	        this.chartBox.chartOpts[this.areaName].high = maxVolume;
	        this.chartBox.chartOpts[this.areaName].low = 0;
	        this.chartBox.chartOpts[this.areaName].dotLen =  2;
	    },
	
		drawItem: function(ki,i){
			var me = this,ctx = this.ctx,chartOpts = this.chartBox.chartOpts,areaOpts = chartOpts[this.areaName], theme = chartOpts.theme, high = areaOpts.high, low = areaOpts.low;
	        var isRise = ki.close > ki.open;
	        var color = isRise ? theme.riseColor : theme.fallColor;
	        var lineX = core.getXByShowDataIndex(i,theme.barWidth,theme.spaceWidth);
	        ctx.fillStyle = color;
	        var height = core.getRelativeYByShowDataValue(ki.volume, high, low, areaOpts.height);
	        ctx.beginPath();
	        var barHeight  = Math.max((areaOpts.height - height),2)
	        var x = lineX - theme.barWidth/2
	        ctx.rect(x, height, theme.barWidth, areaOpts.height-height);
	        //ctx.strokeStyle = color;
	        ctx.fill();
	       /* ctx.beginPath();
	        ctx.moveTo(lineX, height);
	        ctx.lineTo(lineX, areaOpts.height);
	        ctx.stroke();*/
	
		},
	    getValueByY: function(y) {
	        var chartOpts = this.chartBox.chartOpts, opts = chartOpts[this.areaName], datas = this.getDatas(), high = opts.high, low = opts.low;
	        var totalHeight = opts.top + opts.height + opts.bottom, dotLen=2, val;
	        var highest = high + (high-low)*opts.top/opts.height;
	        var val;
	        if(y>opts.y && y < totalHeight+opts.y) {
	            y = y - opts.y
	            val = core.toMoney(highest - (highest)*y/totalHeight,dotLen);
	        }
	        return val;
	    },
	    getTip: function(index,follow){
	        var datas = this.getDatas();
	        var data = datas[index],dotLen = this.chartBox.dotLen;
	        var volume = core.bigNumberToText(data['volume']);
	        var amount = core.bigNumberToText(data['amount']);
	        var color = this.chartBox.getColor(data.close,data.open);
	        if(follow) {
	            return '<span>成交量:<em style="color:'+ color +'">'+ volume +'</em>手</span>'+
	                '<span>成交额:<em style="color:'+ color +'">'+ data['amount'] +'</em></span>'
	        }else {
	            return '<span>量:<em style="color:'+ color +'">'+ volume +'</em></span>'+
	                '<span>额:<em style="color:'+ color +'">'+ data['amount'] +'</em></span>';
	        }
	        
	
	    }
	}
	
	module.exports = VolumeChart;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * opts {}
	 */
	var core = __webpack_require__(9);
	
	function XAixsChart(areaName,chartBox){
		if(!chartBox.showDatas) {
	        console.log('没有数据')
	        return false;
	    }
	    this.chartBox = chartBox;
	    this.name="XAixsChart";
	    this.ctx = chartBox.ctx;
	    this.areaName = areaName;
		this.init();
	}
	XAixsChart.prototype = {
		construcotor: XAixsChart,
	
		init: function(){},
	
		painter: function(){
			this.painting = true;
	        this.ctx.save();
	
	        var chartOpts = this.chartBox.chartOpts,opts = chartOpts[this.areaName],theme = chartOpts.theme,height = opts.height, width = opts.width;
	        this.ctx.translate(opts.x,opts.y + opts.top);
	       
	
	        //计算间隔
			var xWidth = opts.verticalLineSpace,barWidth = theme.barWidth,spaceWidth = theme.spaceWidth;
			var pie = Math.ceil(xWidth/(barWidth+spaceWidth));
			this.space = (barWidth+spaceWidth)*pie;
	
			
			var datas = this.getDatas();
			var xDatas = []
			for(var i=datas.length-1; i>=0; i-=pie) {
				var x = core.getXByShowDataIndex(i,theme.barWidth,theme.spaceWidth),value;
				if(datas[i]) {
					value = core.convertDate(datas[i].quoteTime,chartOpts.period);
					xDatas.push({value:value,x:x});
				}
				
			}
	
			var y = 0 ;
	
			for(var j=0,cur;cur = xDatas[j++];) {
				core.drawVLine(this.ctx, opts.lineColor, cur.x, y, 5, 'solid');
			}
	
			this.drawTexts(xDatas);
			this.ctx.restore();
	        this.painting = false;
		},
		drawBackground: function(){
			this.paintCount = this.paintCount||1;
			if(this.paintCount>1) {
				var charOpts = this.opts, opts = charOpts[this.areaName];
				var y = opts.height+opts.top+opts.bottom;
				this.ctx.clearRect(0,-opts.top,opts.width+opts.margin,y);
			}
			this.paintCount++;
		},
		getDatas: function(){
			return this.chartBox.showDatas;
		},
		drawTexts: function(datas){
			var ctx = this.ctx, opts =this.chartBox.chartOpts[this.areaName];
			ctx.fillStyle = opts.color;
			ctx.font = opts.font;
			for(var j=0,cur;cur = datas[j++];) {
				if(cur.value) {
					var w = ctx.measureText(cur.value).width;
					var x = Math.max(cur.x - w/2,0);
					ctx.fillText(cur.value,x,20);
				}
			}
		},	
	}
	
	module.exports = XAixsChart;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	var core = __webpack_require__(9);
	var YAxisChart = __webpack_require__(11);
	
	function Polyline(areaName,chartBox){
		if(!chartBox.showDatas) {
	        console.log('没有数据')
	        return false;
	    }
	    this.chartBox = chartBox;
	    this.name="Polyline";
	    this.ctx = chartBox.ctx;
	    this.areaName = areaName;
	    this.chartList = {};
		this.init();
	}
	
	Polyline.prototype = {
	    constructor: Polyline,
	    init: function(){
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName];
	        if(opts.yAxis) {
	            this.chartList['yAxis'] = new YAxisChart( this.ctx, this.chartBox.chartOpts.yAxis );
	        }
	    },
	    painter: function(){
	        var me  = this,ctx = this.ctx;
	        this.painting = true;
	        ctx.save();
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName], theme = charOpts.theme, height = opts.height, width = opts.width;
	        ctx.translate(opts.x,opts.y + opts.top);
	        //画水平底纹线
	        var spaceCount = Math.floor(height /(opts.horizontalLineSpace));
	        var spaceHeight = height / spaceCount;
	        var yPos = [];
	        for(var i=0; i<= spaceCount; i++) {
	            var y = Math.ceil(spaceHeight*i);
	            if (y * 10 % 10 == 0) y += .5;
	            
	            core.drawHLine.call(core,this.ctx,theme.lineColor,0,y,width+opts.margin,'dashed');
	            yPos.push(y);
	        }
	
	        this.yPos = yPos;
	
	        this.getDatasRegion();
	        //画折线图 
	        var datas = this.getDatas(),high = opts.high,low = opts.low;
	        
	        ctx.strokeStyle = opts.opts&&opts.opts.lineColor||theme.lineColor;
	        ctx.beginPath();
	        var moveTo = false
	        for(var i=0,len = datas.length; i<len;i++) {
	            if(!datas[i]) {
	                continue;
	            }
	            var y = core.getRelativeYByShowDataValue(datas[i]['avg'], high, low, opts.height);
	            var x = core.getXByShowDataIndex(i,theme.barWidth,theme.spaceWidth);
	            if(!moveTo) {
	                ctx.moveTo(x,y);
	                moveTo = true;
	            }else {
	                ctx.lineTo(x,y);
	            }
	            
	        }
	        
	        ctx.stroke();
	        this.drawYAxisChart();
	        ctx.restore();
	        this.painting = false;
	    },
	
	    drawBackground: function(){
	
	    },
	
	    getDatas: function(){
	        return this.chartBox.showDatas;
	    },
	
	    //这里主要是算所属区域的最大值和最小值
	    getDatasRegion: function(){
	        this.chartBox.calcAreaDataValueRange.call(this.chartBox,this.areaName);
	    },
	
	    drawYAxisChart: function(){
	        var charOpts = this.chartBox.chartOpts, opts = charOpts[this.areaName];
	        if(!this.chartList['yAxis']) {
	            return false;
	        }
	        var datas = this.getDatas(), high = opts.high, low = opts.low, yPos = this.yPos,height = opts.height;
	        var result = [];
	        for(var i=0,len = yPos.length; i<len; i++) {
	            var val = high - (high-low)*yPos[i]/height;
	            var v = core.toMoney(val,opts.dotLen);
	            result.push({value:v,y:yPos[i]});
	        }
	        
	        this.chartList['yAxis'].painter(result,{x: opts.width+opts.margin,y:0, height:opts.height})
	    },
	
	    getValueByY: function(y) {
	        var chartOpts = this.chartBox.chartOpts, opts = chartOpts[this.areaName], datas = this.getDatas(), high = opts.high, low = opts.low;
	
	        var totalHeight = opts.top + opts.height + opts.bottom, dotLen = opts.dotLen, val;
	        var highest = high + (high-low)*opts.top/opts.height;
	        var lowest = low - (high-low)*opts.bottom/opts.height;
	        var val;
	        if(y>opts.y && y < totalHeight+opts.y) {
	            y = y - opts.y;
	            val = core.toMoney(highest - (highest - lowest)*y/totalHeight,dotLen);
	        }
	        return val;
	        
	    },
	
	    getTip: function(index,follow){
	        var datas = this.getDatas();
	        var data = datas[index],dotLen = this.chartBox.chartOpts[this.areaName].dotLen;
	
	        var time = core.convertDate(data['quoteTime'],100,true);
	        var openColor = this.chartBox.getColor(data.preClose, data.open), openValue  = core.toMoney(data.open,dotLen);
	        var highColor = this.chartBox.getColor(data.preClose, data.high), highValue = core.toMoney(data.high,dotLen);
	        var lowColor = this.chartBox.getColor(data.preClose, data.low), lowValue = core.toMoney(data.low, dotLen);
	        var closeColor = this.chartBox.getColor(data.preClose, data.close),closeValue = core.toMoney(data.close, dotLen);
	        var ret = '';
	        if(follow){
	            ret = '<span>'+time+'</span>'+
	               '<span>开盘价:<em style="color:'+ openColor +'">'+ openValue +'</em></span>'+
	               '<span>最高价:<em style="color:'+ highColor +'">'+ highValue +'</em></span>'+
	               '<span>最低价:<em style="color:'+ lowColor +'">'+ lowValue +'</em></span>'+
	               '<span>收盘价:<em style="color:'+ closeColor +'">'+ closeValue +'</em></span>'
	        }else {
	            ret = '<span>日期:'+time+'</span>'+
	               '<span>开:<em style="color:'+ openColor +'">'+ openValue +'</em></span>'+
	               '<span>高:<em style="color:'+ highColor +'">'+ highValue +'</em></span>'+
	               '<span>低:<em style="color:'+ lowColor +'">'+ lowValue +'</em></span>'+
	               '<span>收:<em style="color:'+ closeColor +'">'+ closeValue +'</em></span>'
	        }
	        return ret;
	        
	    }
	}
	
	module.exports = Polyline;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	var core = __webpack_require__(9);
	var Candle = __webpack_require__(10);
	
	function HollowCandle(areaName,chartBox){
		Candle.apply(this,arguments);
	}
	
	var objectCreate = core.objectCreate();
	HollowCandle.prototype = objectCreate(Candle.prototype);
	HollowCandle.prototype.constructor = HollowCandle;
	
	HollowCandle.prototype.drawCandle = function(x,highY,lowY,rect){
	    var ctx = this.ctx;
	    ctx.beginPath();
	    ctx.moveTo(x, highY);
	    ctx.lineTo(x, rect[1]);
	    ctx.stroke();
	    
	    ctx.beginPath();
	    ctx.strokeRect.apply(ctx,rect);
	
	    ctx.beginPath();
	    ctx.moveTo(x, (rect[1]+rect[3]));
	    ctx.lineTo(x, lowY );
	    ctx.stroke();
	}
	
	
	
	module.exports = HollowCandle;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画月线
	 * @param {[type]} ctx  [description]
	 * @param {[type]} data [description]
	 */
	
	var core = __webpack_require__(9);
	function MAChart(areaName,chartBox,id){
	    if(!chartBox.showDatas) {
	        console.log('没有数据')
	        return false;
	    }
	    this.chartBox = chartBox;
	    this.name="MAChart";
	    this.areaName = areaName;
	    this.ctx = chartBox.ctx;
	    this.id = id;
	    this.init();
	}
	
	MAChart.prototype = {
	    construcotor: MAChart,
	    init: function(){},
	    painter: function(){
	        this.painting = true;
	        this.ctx.save();
	
	        var ctx = this.ctx, chartBox = this.chartBox, chartOpts = chartBox.chartOpts, areaOpts = chartOpts[this.areaName], theme = chartOpts.theme,height = areaOpts.height;
	        
	        var opts = !this.id ? areaOpts['opts']: areaOpts['subCharts'][this.id];
	        if(!this.id) {
	            this.getDatasRegion();
	        }
	
	        this.ctx.translate(areaOpts.x, areaOpts.top);
	        
	        var high = areaOpts.high, low = areaOpts.low, datas = this.getDatas();
	        ctx.strokeStyle = opts.color;
	        ctx.beginPath();
	        for(var j=0,jl = datas.length;j<jl;j++) {
	            var v = datas[j];
	            if(!v) continue ;
	            var x = core.getXByShowDataIndex(j,theme.barWidth,theme.spaceWidth),
	                y = core.getRelativeYByShowDataValue(v,high,low,height);
	
	            if(y&&j==0) {
	                ctx.moveTo(x,y);
	            }else {
	                ctx.lineTo(x,y);
	            }
	        }
	        ctx.stroke();
	        ctx.closePath();
	
	        this.ctx.restore();
	        this.painting = false;
	        
	    },
	
	    drawBackground: function(){
	        this.paintCount = this.paintCount||1;
	        if(this.paintCount>1) {
	            var charOpts = this.opts, opts = charOpts[this.areaName];
	            var height = opts.height,y = opts.y;
	            if(this.isSubItem) {
	                height = this.canvas.height;
	                y = 0;
	            }
	            this.ctx.clearRect(0,y,opts.width+opts.margin,height);
	        }
	        this.paintCount++;
	    },
	
	    getDatas: function(calc){
	        if(!calc) {
	            return this.datas;
	        }
	        var chartBox = this.chartBox, chartOpts = chartBox.chartOpts, areaOpts = chartOpts[this.areaName]
	        var opts = !this.id ? areaOpts['opts']: areaOpts['subCharts'][this.id];
	        if(!opts.daysCount) {
	            throw new Error('没有设置移动平均线的日期间隔');
	            return false
	        }
	
	        var datas = this.calcMAPrices(opts.daysCount);
	        this.preAvg = datas.shift();
	        this.datas = datas;
	        return datas;
	    },
	
	    getDatasRegion: function(){
	        var datas = this.getDatas(true);
	        var areaName  = this.areaName;
	        var opts = this.chartBox.chartOpts[areaName];
	        var high = opts.high,low = opts.low;
	        var tempDatas = [];
	        for(var i=0,len = datas.length;i<len;i++) {
	            if(datas[i]) {
	                tempDatas.push(datas[i]);
	            }
	        }
	        if(high) {
	            tempDatas.push(high);
	        }
	        high = Math.max.apply(null,tempDatas);
	
	        if(low) {
	            tempDatas.push(low);
	        }
	        low = Math.min.apply(null,tempDatas);
	
	        this.chartBox.chartOpts[areaName].high = high;
	        this.chartBox.chartOpts[areaName].low = low;
	
	    },
	
	    calcMAPrices: function(daysCn){
	        var chartBox = this.chartBox, dataRanges = chartBox.dataRanges, datas = chartBox.datas;
	        var startIndex = dataRanges.start;
	        var result = [];
	        for(var i = startIndex-1; i<= dataRanges.to; i++) {            
	            if( i<0 || i>datas.length-1) {
	                result.push(false);
	                continue;
	            }
	            var startCalcIndex = i - daysCn +1;
	            if(startCalcIndex < 0) {
	                result.push(datas[i].close);
	                continue;
	            }
	            var sum = 0;
	            for(var k = startCalcIndex; k <= i; k++) {
	                sum += datas[k].close;
	            }
	            var val = sum/daysCn;
	            
	            result.push(val);
	        }
	        
	        return result;
	    },
	
	    getTip: function(index,follow) {
	        var opts = this.chartBox.chartOpts[this.areaName],dotLen = opts.dotLen;
	        var datas = this.datas;
	
	        var chartBox = this.chartBox, chartOpts = chartBox.chartOpts, areaOpts = chartOpts[this.areaName]
	        var opts = !this.id ? areaOpts['opts']: areaOpts['subCharts'][this.id];
	        if(follow) {
	            return '';
	        }
	        var val = datas[index];
	        var prevVal = index==0 ? this.preAvg : datas[index-1];
	        var color = this.chartBox.getColor(prevVal,val);
	        val = core.toMoney(val,dotLen);
	        return '<span style="color:'+opts.color+'">MA'+opts.daysCount+':<em style="color:'+ color +'">' + val + '</em></span>';       
	    }
	
	}
	
	module.exports = MAChart;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(9);
	var $ = __webpack_require__(1);
	
	function DragEvent(canvas,chartBox){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.chartBox = chartBox;
	
		this.init();
	}
	var i=0;
	DragEvent.prototype = {
		construcor: DragEvent,
		init: function(){
			var me = this;
			$(me.canvas).on('mousedown.drag',function(e){
				if(!e.button) {
					me.start(e);
				}else {
					return;
				}
			}).on('mousemove.drag',function(e){
				me.move(e);
			}).on('mouseup.drag', function(e){
				me.end.call(me,e);
			}).on('mouseleave',function(e){
				me.end.call(me,e);
			})
		},
		start: function(e){
			$(this.canvas).addClass('cur-drag');
			var point = {
				x: e.pageX,
				y: e.pageY
			}
			var dragOpts = this.chartBox.events.drag||{};
			var canDrag = dragOpts.onBeforeDrag&&dragOpts.onBeforeDrag.call(this.chartBox);
			if(canDrag===false) {
				return false;
			}
			this.startPoint = point;
			this.dataRanges = this.chartBox.dataRanges;
			this.chartBox.dragging = true;
			if(this.canvas.clear) {
				this.ctx.clearRect(0, 0 ,this.canvas.width, this.canvas.height);
			}
			//e.stopPropagation();
		},
	
		move: function(e){
			var chartBox = this.chartBox;
			if(!this.startPoint){
				return false;
			}
			
			
			var dataRanges = this.dataRanges, startPoint = this.startPoint, dataLength = chartBox.showDatas.length;
			var moveX = e.pageX - startPoint.x;
			var dataCount = Math.floor(moveX*dataLength/chartBox.mainRegionWidth);
			
			if(dataCount!=0) { 
				this.canExecEnd = true;
				var dragOpts = chartBox.events.drag||{};
				var start  = dataRanges.start - dataCount,to = dataRanges.to - dataCount;
				var newDataRanges = {start: start, to : to};
				this.chartBox.painter(newDataRanges);
				dragOpts.onDrag&&dragOpts.onDrag.call(chartBox,dataRanges);
				
			}
			e.stopPropagation();
			
		},
		end: function(e){
			this.startPoint = null;
			this.dataRanges = null;
			$(this.canvas).removeClass('cur-drag');
			this.chartBox.dragging = false;
			if(this.canExecEnd){
				var ev;
				if(ev = this.chartBox.events.drag.onAfterDrag) {
					ev.call(this.chartBox);
				}
				if(this.chartBox.dataRanges) {
					this.chartBox.autoLoadData();
				}
				this.canExecEnd = false;
			}
			e.stopPropagation();
		}
	}
	
	module.exports = DragEvent;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var $ = jQuery = __webpack_require__(1);
	
	__webpack_require__(19);
	
	function WheelEvent(canvas,chartBox){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.chartBox = chartBox;
		this.init();
	}
	
	WheelEvent.prototype = {
		constructor: WheelEvent,
		init: function(){
			var me = this;
			$(this.canvas).on('mousewheel',function(e){
				me.wheel.call(me,e);
			})
		},
		wheel: function(e){
			var chartBox = this.chartBox, dataRanges = chartBox.dataRanges, chartOpts = chartBox.chartOpts, theme = chartOpts.theme;
			var wheelOpts = chartBox.events.wheel;
			var step = wheelOpts.step||6;
			var itemCount = chartBox.showDatas.length;
			var changeCount = Math.ceil(itemCount*step/100);
			var start = dataRanges.start, to = dataRanges.to;
			if(dataRanges.to > chartBox.datas.length-1) {
				to = dataRanges.to - changeCount;
				start = dataRanges.start - changeCount;
			}else {
				chartBox.zoom = true;
				//放大
				if(e.deltaY > 0) {
					start  = dataRanges.start + changeCount;
				}else {
					start = dataRanges.start - changeCount;
				}
			}
			var ret = wheelOpts.onWheelBefore&&wheelOpts.onWheelBefore.call(chartBox)
			if(ret!==false) {
				chartBox.painter({start: start, to: to},function(){
					chartBox.autoLoadData();
				});
				wheelOpts.onWheel&&wheelOpts.onWheel.call(chartBox,dataRanges);
			}
			
			e.stopPropagation();
		}
	}
	
	module.exports = WheelEvent;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery Mousewheel 3.1.13
	 * https://github.com/jquery/jquery-mousewheel/blob/master/jquery.mousewheel.min.js
	 * Copyright 2015 jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 */
	!function(a){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (a), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	var core = __webpack_require__(9);
	var FollowTip = __webpack_require__(21);
	
	
	function CrossLineEvent(canvas,chartBox){
			this.canvas = canvas;
			this.chartBox = chartBox;
			this.ctx = canvas.getContext('2d');
			this.init();
		}
		
		CrossLineEvent.prototype = {
			constructor: CrossLineEvent,
		
			init: function(){
				var me = this;
				this.canvas.clear = true;
		
				var followOps = this.chartBox.events.crossLine.follow;
				if(followOps){
					this.followTip = new FollowTip(this.chartBox.canvasBox,followOps);
				}
		
				var tempMove = core.throttle(me.mousemove,30);
				$(this.canvas).on('mousemove',function(e){
					tempMove.call(me,e);
				}).on('mouseleave',function(e){
					me.mouseout.call(me,e,true,true);
				}).on('mouseenter',function(e){
					if(window.mouseMoveLocked) return false;
					me.mouseenter.call(me,e);
				})
		
			},
			mouseenter: function(e) {
				this.mouseIn = true;
				e.stopPropagation();
			},
			mousemove: function(e){
				var ctx = this.ctx, chartBox = this.chartBox;
				if(chartBox.dragging||!this.mouseIn) {
					return false;
				}
				this.mouseout.call(this);
				//ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);
				var pageX = e.pageX, pageY = e.pageY;
				var offset = $(this.canvas).offset();
		
				var pos = {
					x: pageX - offset.left,
					y: pageY - offset.top,
				}
		
				var drawInfo = this.draw(pos);
				var eventOpts = chartBox.events.crossLine||{};
				if(eventOpts.onCross&&drawInfo) {
					eventOpts.onCross.call(chartBox,drawInfo);
				}
				
			},
			mouseout: function(e,out,triggle) {
				this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height)
				if(this.followTip) {
					this.followTip.hideTip();
					this.followTimer&&clearTimeout(this.followTimer);
					this.followTimer = null;
				}
				var eventOpts = this.chartBox.events.crossLine||{};
				if(eventOpts.onAfterCross&&triggle) {
					eventOpts.onAfterCross.call(this.chartBox);
				}
				if(out) {
					this.mouseIn = false;
				}
				if(e) {
					e.stopPropagation();
				}
			},
			draw: function(pos){
				var ctx = this.ctx, chartBox = this.chartBox;
				//计算可移动的反而范围
				var chartOpts = chartBox.chartOpts,theme = chartBox.events.crossLine;
				var yAxisWidth = chartOpts.yAxis.width;
				var xAxisHeight = chartOpts.xAxis.height;
		
				var effectiveX = this.canvas.width - yAxisWidth;
				var effectiveY = this.canvas.height - xAxisHeight;
		
				if(pos.x<0 || pos.y<0 || pos.x > (effectiveX)||pos.y>effectiveY) {
					return false;
				}
		
				var adjustX = chartBox.adjustX(pos.x);
				
				var areas = chartOpts.areas.items,chartList = chartBox.chartList;
				var mainAreaName = chartOpts.areas.items[0];
				var mainAreaHeight = chartOpts[mainAreaName].height + chartOpts[mainAreaName].top;
				if(pos.y > mainAreaHeight) {	//只在主区域有用
					chartBox.mouseInfo = null;
				}else {
					chartBox.mouseInfo = {point:{x:pos.x,y:pos.y},index:adjustX.index,width:effectiveX,height:effectiveY};
				}
		
				//在别处有用
				pos.x = adjustX.x;
				var yVal,area;
				for(var i=0,len=areas.length; i<len; i++) {
					var chartObj = chartList[areas[i]];
					if(chartObj.getValueByY) {
						yVal = chartObj.getValueByY.call(chartObj,pos.y);
						area = areas[i];
						if(yVal) {
							break;
						}
					}
				}
				//画y轴数据
				if(yVal) {
					this.drawY(yVal,pos.y);
				}
		
				//画x轴数据
				var xValue = chartBox.showDatas[adjustX.index];
				if(xValue) {
					this.drawX(xValue.quoteTime,pos.x,adjustX.index)
					//跟随tip
					if(this.followTip) {
						var me = this;
						var delay = this.chartBox.events.crossLine.follow.delay||1000;
						this.followTimer = setTimeout(function(){
							var fTip = '';
							for(var tip in tipList) {
								fTip += chartBox.getAreaTip(tip,adjustX.index,true);
							}
							me.followTip.changeTip(fTip,pos,{width:effectiveX,height:effectiveY});
						},delay)
						
					}
				}
				return {xValue:xValue.quoteTime,yValue:yVal,yArea:area,index:adjustX.index}
			},
			drawX: function(xValue,x,dataIndex){
				var ctx = this.ctx, chartBox = this.chartBox;
				var chartOpts = chartBox.chartOpts,theme = chartBox.events.crossLine;
				
				var xAxisHeight = chartOpts.xAxis.height;
				
				var lineHeight = this.canvas.height - xAxisHeight;
		
				core.drawVLine(this.ctx, theme.lineColor, x, 0, lineHeight, 'solid');
				ctx.save();	
				ctx.font = theme.font;
				var xValue1 = core.convertDate(xValue,100,true);
				chartBox.mouseInfo&&(chartBox.mouseInfo.xValue = xValue1);
				var w = ctx.measureText(xValue1).width;
				var boxW = w+20;
				ctx.fillStyle = theme.background;
				var boxX = Math.max(x- boxW/2,0)
				ctx.fillRect(boxX , lineHeight+2, boxW, xAxisHeight-2);
				ctx.fillStyle = theme.color;
				ctx.fillText(xValue1, boxX+10, this.canvas.height-10);
				ctx.restore();
				var tipList = chartBox.tipList;
				for(var tip in tipList) {
					var ele = tipList[tip];
					var msg = chartBox.getAreaTip(tip,dataIndex);
					ele.html(msg);
				}
			},
		
			drawY: function(Yvalue,y) {
				var ctx = this.ctx, chartBox = this.chartBox;
				var chartOpts = chartBox.chartOpts,theme = chartBox.events.crossLine;
		
				var yAxisWidth = chartOpts.yAxis.width;
				var lineWidth = this.canvas.width - yAxisWidth;
		
				chartBox.mouseInfo&&(chartBox.mouseInfo.yValue = Yvalue);
				core.drawHLine(ctx, theme.lineColor, 0, y, lineWidth, 'solid');
				ctx.save();
				ctx.fillStyle = theme.background;
				ctx.fillRect(lineWidth+1, y-10, yAxisWidth, 20);
				ctx.fillStyle = theme.color;
				ctx.font = theme.font;
				ctx.fillText(Yvalue,lineWidth+7, y+5);
				ctx.restore();
			},
		
		
			drawByValue: function(crossInfo) {
				var chartBox = this.chartBox;
				var x = chartBox.getXByValue(crossInfo.xValue);
				var y = chartBox.getYByValue(crossInfo.yValue,crossInfo.yArea,true);
				this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);
				if(x.index) {
					this.drawX(crossInfo.xValue,x.x,x.index);
				}
				if(y) {
					this.drawY(crossInfo.yValue,y);
				}
				
			}
		}
	
	module.exports = CrossLineEvent;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	
	function FollowTip($element,opts){
		this.container = $element;
		this.opts = opts;
		this.dir = {x:1,y:1};
		return this.init();
	}
	
	FollowTip.prototype = {
		constructor: FollowTip,
		init: function(){
			var opts = this.opts;
			if(!opts.width||!opts.height) {
				console.log('请设置高度或者宽度');
				return false;
			}
			var cls = opts.clsName ||''
			this.wrap = $('<div class="canvas-follow-tip '+cls+'" style="display:none; position: absolute; left:0; top:0; width:'+opts.width+'px; height:'+opts.height+'px"></div>').appendTo(this.container);
			return this;
		},
	
		calcPosition: function(pos,region){
			var opts = this.opts;
			if(opts.position) {
				return opts.position;
			}
			var wrapWidth,wrapHeight;
			if(region) {
				wrapWidth = region.width;
				wrapHeight = region.height;
			}else {
				wrapWidth = this.container.width();
				wrapHeight = this.container.height();
			}
			var margin = opts.margin||0, top=0 ,left=0 ;
			if(this.dir.y) {
				top = pos.y + margin;
				if(top > wrapHeight - opts.height - margin) {
					this.dir.y = 0;
					top = pos.y - opts.height - margin;
				}
			}else {
				top = pos.y - opts.height- margin;
				if(top < opts.height+margin) {
					this.dir.y = 1;
					top = pos.y + margin;
				}
			}
	
			if(this.dir.x) {
				left = pos.x + margin;
				if(left > wrapWidth - opts.width - margin) {
					this.dir.x = 0;
					left = pos.x - opts.width - margin;
				}
			}else {
				left = pos.x - opts.width - margin;
				if(left < opts.width + margin) {
					this.dir.x = 1;
					left = pos.x + margin;
				}
			}
			
	
			return {top:top,left:left};
			
		},
	
		hideTip: function(){
			this.wrap.hide();
		},
	
		showTip: function(){
			this.wrap.show();
		},
		changeTipPosition: function(pos,region){
			var tipPos = this.calcPosition(pos,region);
			this.wrap.css(tipPos);
		},
		changeTip: function(tip,pos,region) {
			this.changeTipPosition(pos,region);
			if(tip) {
				this.wrap.html(tip);
			}
			this.showTip();
		}
	}
	
	module.exports = FollowTip;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	var $ = __webpack_require__(1);
	var FollowTip = __webpack_require__(21);
	
	
	function RightClickEvent(canvas,chartBox){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.chartBox = chartBox;
		this.dynamicMenu = [];
	
		return this.init();
	}
	
	RightClickEvent.prototype = {
		constructor: RightClickEvent,
		init: function(){
			var opts = this.chartBox.events.rightClick, me = this;
			if(!opts.menus||!opts.menus.length) {
				return false;
			}
			//生成菜单
			this.initRightMenuHtml();
			//绑定菜单事件
			this.initMenuEvents();
			//绑定右键出现菜单事件
			this.bindRightClickEvent();
	
			//当点击页面其他地方时，要隐藏菜单
			$(document).on('click.rightClick',function(){
				me.rightMenuObj.hide();
				me.rightDialog.hideTip.call(me.rightDialog);
			});
			return this;
		},
	
		initRightMenuHtml: function(){
			var me = this,chartBox = this.chartBox,opts = chartBox.events.rightClick;
			
			//主菜单
			var menus = opts.menus;
			var fragment = document.createDocumentFragment(),height=menus.length*40+2;
			var mainMenu = document.createElement('div');
			mainMenu.className = 'main-menu';
			for(var i=0,menu; menu = menus[i++];) {
				var a = this.factoryMenu(menu,i-1);
				mainMenu.appendChild(a);
			}
			fragment.appendChild(mainMenu);
	
			//二级菜单
			var subMenus = opts.subMenus;
			if(subMenus) {
				var subMenu = document.createElement('div');
				subMenu.className = 'sub-menu';
				subMenu.style.display ='none';
				for(var j=0,submenu;submenu = subMenus[j++];) {
					var a = this.factoryMenu(submenu);
					subMenu.appendChild(a);
				}
				fragment.appendChild(subMenu);
	
				if(opts.onClick) {
					$(subMenu).on('click','a',function(e){
						opts.onClick.call(this,me.rightMenuObj.activeMainMenu);
					})
				}
			}
	
	
	
			this.rightDialog = new FollowTip(this.chartBox.canvasBox,{
				width:218,
				height: height,
				margin:5,
				clsName:'chart-right-menu'
			});
			
			this.rightDialog.wrap.append(fragment);
		},
	
		factoryMenu: function(menu,index) {
			var type = typeof menu;
			var a = document.createElement('a');
			a.href="javascript:void(0)";
			if(type=='object') {
				var tpl = menu.tpl;
				var fn = $.type(tpl) =='function';
				if(fn) {
					this.dynamicMenu.push({index:index,ele:a});
				}else {
					a.innerHTML = tpl;
				}
				if(menu.submenu) {
					a.submenu = true;
				}
	
				if(menu.click) {
					var me = this;
					$(a).on('click',function(){
						menu.click.call(this,me,me.chartBox.mouseInfo.yValue);
					})
				}
			}else {
				a.innerHTML = menu;
			}
	
			return a;
		},
	
		initMenuEvents: function(){
			var wrap = this.rightDialog.wrap;
			this.rightMenuObj = new RightMenus(wrap);
		},
	
		bindRightClickEvent: function(){
			var dynamicMenu = this.dynamicMenu,chartBox = this.chartBox, me = this, mainMenus = chartBox.events.rightClick.menus;
			$(this.canvas).on('contextmenu',function(e){
				me.rightMenuObj.hide();
				var mouseInfo = chartBox.mouseInfo;
				if(!mouseInfo) {
					return false;
				}
	
				//更新菜单
				for(var j=0,cur;cur=dynamicMenu[j++];){
					var index = cur.index;
					var tpl = mainMenus[index].tpl.call(cur.ele,me,mouseInfo.yValue);
					if(cur.ele.submenu) {
						tpl +='<i class="icon icon-triangle-right"></i>';
					}
					$(cur.ele).html(tpl);
				}
				
				me.rightDialog.changeTipPosition(mouseInfo.point, {width: mouseInfo.width, height: mouseInfo.heihgt});
				me.rightDialog.showTip();
	
				return false;
			})
		},
	
		destory: function(){
			$(document).off('.rightClick');
		}
	
	}
	
	
	
	function RightMenus(wrap,opts) {
		this.wrap = $(wrap);
		this.subMenu = this.wrap.find('.sub-menu');
		this.mainMenu = this.wrap.find('.main-menu');
		this.activeMainMenu = null;
		this.leaveTimer = null;
		this.opts = opts;
		this.init();
	}
	RightMenus.prototype = {
		init: function(){
			var me  = this;
			var mainMenus = this.mainMenu.find('a');
	
			mainMenus.on('mouseenter',function(){
				$(this).addClass('active');
				me.activeMainMenu = this;
				var more = this.submenu||$(this).data('submenu');
				if(more) {
					var borderWidth = parseInt(me.wrap.css('borderWidth'));
					
					var top = $(this).position().top-borderWidth;
					me.subMenu.css('top',top).show();
				}else {
					me.subMenu.hide();
				}
			}).on('mouseleave',function(){
				var more = this.submenu||$(this).data('submenu');
				if(!more) {
					$(this).removeClass('active');
					me.subMenu.hide();
					me.activeMainMenu = null;
					
				}else {
					var _self = this;
					me.leaveTimer&&clearTimeout(me.leaveTimer);
					me.leaveTimer = setTimeout(function(){
						$(_self).removeClass('active');
						if(me.activeMainMenu == _self) {
							me.activeMainMenu = null;
						}
						
					})
				}
			})
	
			this.subMenu.on('mouseenter',function(){
				me.leaveTimer&&clearTimeout(me.leaveTimer);
			}).on('mouseleave',function(){
				$(me.activeMainMenu).removeClass('active');
				me.activeMainMenu = false;
				$(this).hide();
			})
			
		},
	
		hide: function(){
			this.activeMainMenu&&$(this.activeMainMenu).removeClass('active');
			this.activeMainMenu = null;
			this.subMenu.hide();
		}
	}
	
	module.exports = RightClickEvent;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=lynnCharts.js.map
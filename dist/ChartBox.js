(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["ChartBox"] = factory(require("jquery"));
	else
		root["ChartBox"] = factory(root["jQuery"]);
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

	/**
	 * 图表的box
	 * @param {object} opts {
	 *     datas: [],			//图表的数据
	 *     container: Emement,	//放在哪个容器里面
	 *     title:{},			//这个图表的标题，里面要包含title属性如 {title:EUR/USD,ask:1.33,bid:1.34}
	 *     formatTitleTpl: function(title){}	//生成title的html
	 *     onTitleClick: function(){}
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
			    	bottom:10,					//规定在主区域内，canvas离区域的距离
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
	var core = __webpack_require__(2);
	var CandlestickChart = __webpack_require__(3);
	var VolumeChart = __webpack_require__(5);
	var XAxisChart = __webpack_require__(6);
	var PolylineChart = __webpack_require__(7);
	var HollowCandleChart = __webpack_require__(8);
	var MAChart = __webpack_require__(9);
	var DragEvent = __webpack_require__(10);
	var WheelEvent = __webpack_require__(11);
	var CrossLineEvent = __webpack_require__(13);
	var RightClickEvent = __webpack_require__(15);
	
	
	var noop = function(){};
	var isCanvasSuport = function(){
		return !!document.createElement('canvas').getContext;	
	}
	function Chartbox(opts) {
		var defaults = {
			formatTitleTpl: function(){},
			title:{},
			container: document.body,
			onTitleClick: noop,
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
			    	right:60
			    },
			    //各字自区域对应的配置
			    mainArea: {
			    	left: 0,
			    	top: 30, 
			    	bottom:10,
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
		this.container = $(this.container)
	
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
				me.onTitleClick.call(me,me.title);
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
				$.extend(true,oldOpts,opts);
				this.chartOpts[areaName] = oldOpts;
			}
			var height = oldOpts.height+oldOpts.top+oldOpts.bottom;
			var theme = this.chartOpts.theme;
			this.drawBackground(this.width,height, theme.backgroundColor);
			core.drawVLine(this.ctx, theme.lineColor, this.mainRegionWidth+oldOpts.margin, oldOpts.y, height,'solid');
			
	
			this.initAreaChart(areaName);
			this.drawMainAreaLines();
	
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
	            low = low ? Math.min(cur.value,low) : cur.value;
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
			var isExceed = false;
			for(var line in lines) {
				var value = lines[line].value;
				if(value > mainAreaOpts.high || value < mainAreaOpts.low) {
					isExceed = true;
					break;
				}
			}
			if(!isExceed) {
				for(var l in lines) {
					var opts = lines[l];
					this.drawMainAreaLine(l,opts);
				}
			}else{
				this.painter();
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
				if($.type(data)!=='array'){
					throw new Error('数据格式不正确');
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
	
			}).fail(function(error){
				console.log(error)
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
	            var maxHeight = opts.height+0.5;
	            if(ret<= maxHeight) {
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
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
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
	        var result;
	        if(value==low){
	            result = height;
	        }else if(value==high) {
	            result = 0;
	        }else {
	            result = Math.ceil((high - value)*height/(high - low));
	        }
	        if (result * 10 % 10 == 0) result += .5;
	        return result;
	    }
	    
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 蜡烛图
	 * @type {[type]}
	 */
	var $ = __webpack_require__(1);
	var core = __webpack_require__(2);
	var YAxisChart = __webpack_require__(4);
	
	
	
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * y轴
	 * @type {[type]}
	 */
	var core = __webpack_require__(2);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画交易额
	 */
	
	var core = __webpack_require__(2);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * x轴
	 */
	var core = __webpack_require__(2);
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画折线（分时图）
	 */
	
	var $ = __webpack_require__(1);
	var core = __webpack_require__(2);
	var YAxisChart = __webpack_require__(4);
	
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 空心蜡烛图
	 */
	var core = __webpack_require__(2);
	var Candle = __webpack_require__(3);
	
	function HollowCandle(areaName,chartBox){
		Candle.apply(this,arguments);
	}
	
	var objectCreate = core.objectCreate();
	HollowCandle.prototype = objectCreate(Candle.prototype);
	HollowCandle.prototype.constructor = HollowCandle;
	
	HollowCandle.prototype.drawCandle = function(isRise,x,highY,lowY,rect){    
	    var me = this,ctx = this.ctx,charOpts = this.chartBox.chartOpts, theme = charOpts.theme
	        var color = isRise ? theme.riseColor : theme.fallColor;
	        ctx.strokeStyle = color;
	        ctx.beginPath();
	        ctx.moveTo(x, highY);
	        ctx.lineTo(x, lowY);
	        ctx.stroke();
	        ctx.fillStyle = theme.backgroundColor;
	        ctx.beginPath();
	        ctx.fillRect.apply(ctx,rect);
	        ctx.strokeStyle = color;
	        ctx.beginPath();
	        ctx.strokeRect.apply(ctx,rect);
	
	}
	
	
	
	module.exports = HollowCandle;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画月线
	 * @param {[type]} ctx  [description]
	 * @param {[type]} data [description]
	 */
	
	var core = __webpack_require__(2);
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 拖拽事件
	 */
	
	var core = __webpack_require__(2);
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
				if(window.mouseMoveLocked) return ;
				if(!e.button) {
					me.start(e);
				}else {
					return;
				}
			}).on('mousemove.drag',function(e){
				me.move(e);
			}).on('mouseup.drag', function(e){
				if(window.mouseMoveLocked) return ;
				me.end.call(me,e);
			}).on('mouseleave',function(e){
				if(window.mouseMoveLocked) return ;
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
			e.stopPropagation();
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 鼠标滚动事件
	 */
	
	var $ = jQuery = __webpack_require__(1);
	
	__webpack_require__(12);
	
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
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 画移动十字线
	 */
	
	var $ = __webpack_require__(1);
	var core = __webpack_require__(2);
	var FollowTip = __webpack_require__(14);
	
	
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
					if(window.mouseMoveLocked) return ;
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 鼠标跟随显示信息
	 */
	
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 右键点击事件
	 */
	
	var $ = __webpack_require__(1);
	var FollowTip = __webpack_require__(14);
	
	
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
//# sourceMappingURL=ChartBox.js.map
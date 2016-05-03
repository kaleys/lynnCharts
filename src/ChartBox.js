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


var $=require('jquery');
var core = require('./common.js');
var CandlestickChart = require('./CandlestickChart');
var VolumeChart = require('./VolumeChart');
var XAxisChart = require('./XAxisChart');
var PolylineChart = require('./PolylineChart');
var HollowCandleChart = require('./HollowCandleChart');
var MAChart = require('./MAChart');
var DragEvent = require('./DragEvent');
var WheelEvent = require('./WheelEvent');
var CrossLineEvent = require('./CrossLineEvent');
var RightClickEvent = require('./RightClickEvent');


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

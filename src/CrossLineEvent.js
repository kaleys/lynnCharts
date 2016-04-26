var $ = require('jquery');
var core = require('./common.js');
var FollowTip = require('./FollowTip');


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
		ctx.fillText(Yvalue,lineWidth+5, y+5);
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
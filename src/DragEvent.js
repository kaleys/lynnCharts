var core = require('./common.js');
var $ = require('jquery');

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

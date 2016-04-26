var $ = jQuery = require('jquery');

require('./vendor/jquery.mousewheel.min');

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
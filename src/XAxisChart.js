/**
 * opts {}
 */
var core = require('./common.js');

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
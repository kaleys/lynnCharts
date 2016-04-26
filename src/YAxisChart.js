
var core = require('./common.js');

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
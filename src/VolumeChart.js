var core = require('./common.js');

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
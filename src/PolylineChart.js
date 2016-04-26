var $ = require('jquery');
var core = require('./common.js');
var YAxisChart = require('./YAxisChart');

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
        var datas = this.getDatas();
        var areaName = this.areaName;
        var opts = this.chartBox.chartOpts[areaName];
        var high = opts.high,low = opts.low;
        for(var i=0,len = datas.length;i<len;i++) {
            var val = datas[i];
            if(val) {
                high = high ? Math.max(val.avg, high) : val.high;
                low = low ? Math.min(low, val.avg) : val.low;
            }
        }
        this.chartBox.chartOpts[areaName].high = high;
        this.chartBox.chartOpts[areaName].low = low;
        if(!this.chartBox.chartOpts[areaName].length){
            var highStr = high.toString(), lowStr = low.toString();
            var highDotLen = highStr.length - highStr.indexOf('.') -1;
            var lowDotLen = lowStr.length - lowStr.indexOf('.') -1;
            this.chartBox.chartOpts[areaName].dotLen =  Math.max(highDotLen,lowDotLen);
        }
        
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
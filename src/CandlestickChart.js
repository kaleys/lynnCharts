/**
 * 蜡烛图
 * @type {[type]}
 */
var $ = require('jquery');
var core = require('./common.js');
var YAxisChart = require('./YAxisChart');



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

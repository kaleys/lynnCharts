/**
 * 画月线
 * @param {[type]} ctx  [description]
 * @param {[type]} data [description]
 */

var core = require('./common.js');
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
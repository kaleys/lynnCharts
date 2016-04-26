/**
 * 画月线
 * @param {[type]} ctx  [description]
 * @param {[type]} data [description]
 */

var core = require('./common.js');
function MAsChart(areaName,chartBox,isSubItem){
    if(!chartBox.showDatas) {
        console.log('没有数据')
        return false;
    }
    this.chartBox = chartBox;
    this.name="MAsChart";
    var ctx = chartBox.ctx;
    this.opts = chartBox.chartOpts;
    this.areaName = areaName+"Opts";
    var areaOpts = this.opts[this.areaName];
    this.isSubItem = isSubItem;
    if(isSubItem) {
        this.canvas = areaOpts.subItem.canvas;
        if(!this.canvas){
            throw new Error('月线图没有指定canvas');
            return false;
        } 
        ctx = this.canvas.getContext('2d');
    }
    this.ctx = ctx;
    
    this.init();
}

MAsChart.prototype = {
    construcotor: MAsChart,
    init: function(){},
    painter: function(){
        this.painting = true;
        if(this.isSubItem) {
            this.drawBackground();
        }
        this.ctx.save();

        var ctx = this.ctx, chartOpts = this.opts,opts = chartOpts[this.areaName], theme = chartOpts.theme,height = opts.height, width = opts.width;
        var y = this.isSubItem ? 0 : opts.y;
        y+=opts.top;
        this.ctx.translate(opts.x, y);

        var MAs = this.isSubItem ? opts.subItem.opts : opts.MAs;


        var highest = this.chartBox.showDatas.high,lowest = this.chartBox.showDatas.low;
        var tempDatas = [highest,lowest];
        this.preAvgs={};
        for(var i=0,len = MAs.length;i<len;i++) {
            var val  = MAs[i];
            var MA = this.calcMAPrices(val.daysCount);
            val.values = MA;
            for(var j=0,jlen=MA.length; j<jlen; j++) {
                if(MA[j]) {
                    tempDatas.push(MA[j]);
                }
            }
        }
        highest = Math.max.apply(null,tempDatas);
        lowest = Math.min.apply(null,tempDatas);
        this.chartBox.showDatas.high = highest;
        this.chartBox.showDatas.low  = lowest;
        i=0;
        for(;i<len;i++) {
            var val = MAs[i];
            var MA = val.values;
            ctx.strokeStyle = val.color;
            ctx.beginPath();
            for(var j=0,jl = MA.length;j<jl;j++) {
                var v = MA[j];
                if(!v) continue ;
                var x = core.getXByShowDataIndex(j,theme.barWidth,theme.spaceWidth),
                    y = core.getRelativeYByShowDataValue(v,highest,lowest,height);

                if(y&&j==0) {
                    ctx.moveTo(x,y);
                }else {
                    ctx.lineTo(x,y);
                }
            }
            ctx.stroke();
            ctx.closePath();
        }


        this.ctx.restore();
        this.painting = false;

        this.getTip(1);
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

    getDatas: function(){
        return this.chartBox.datas;
    },

    calcMAPrices: function(daysCn){
        var chartBox = this.chartBox, dataRanges = chartBox.dataRanges, datas = this.getDatas();
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
        this.preAvgs[daysCn] = result.shift();
        return result;
    },

    getTip: function(index,follow) {
        /*var datas = this.getDatas();
        var data = datas[index],;*/
        var chartOpts = this.opts,opts = chartOpts[this.areaName],dotLen = this.chartBox.dotLen;
        var MAs = this.isSubItem ? opts.subItem.opts : opts.MAs;
        var ret = '';
        if(follow) {
            return ret;
        }
        for(var i=0,len = MAs.length; i<len; i++) {
            var curData = MAs[i];
            var val = curData.values[index];
            var prevVal = index==0 ? this.preAvgs[curData.daysCount] : curData.values[index-1];
            var color = this.chartBox.getColor(prevVal,val);
            val = core.toMoney(val,dotLen);

            ret +='<span style="color:'+curData.color+'">MA'+curData.daysCount+':<em style="color:'+ color +'">' + val + '</em></span>';
        }

        return ret;
    }

}

module.exports = MAsChart;
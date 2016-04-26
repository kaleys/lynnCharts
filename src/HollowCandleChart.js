
var core = require('./common');
var Candle = require('./CandlestickChart.js');

function HollowCandle(areaName,chartBox){
	Candle.apply(this,arguments);
}

var objectCreate = core.objectCreate();
HollowCandle.prototype = objectCreate(Candle.prototype);
HollowCandle.prototype.constructor = HollowCandle;

HollowCandle.prototype.drawCandle = function(x,highY,lowY,rect){
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, rect[1]);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeRect.apply(ctx,rect);

    ctx.beginPath();
    ctx.moveTo(x, (rect[1]+rect[3]));
    ctx.lineTo(x, lowY );
    ctx.stroke();
}



module.exports = HollowCandle;
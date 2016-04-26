
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item, index) {
        var n = this.length,
                i = ~~index
        if (i < 0)
            i += n
        for (; i < n; i++)
            if (this[i] === item)
                return i
        return -1
    }
}

module.exports = {
	toMoney: function (number, decimals, point, thousands){
        //form http://phpjs.org/functions/number_format/
        //number    必需，要格式化的数字
        //decimals  可选，规定多少个小数位。
        //point 可选，规定用作小数点的字符串（默认为 . ）。
        //thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
        number = (number + '')
                .replace(/[^0-9+\-Ee.]/g, '')
        var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
                sep = thousands || ",",
                dec = point || ".",
                s = '',
                toFixedFix = function(n, prec) {
                    var k = Math.pow(10, prec)
                    return '' + (Math.round(n * k) / k)
                            .toFixed(prec)
                }
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
                .split('.')
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '')
                .length < prec) {
            s[1] = s[1] || ''
            s[1] += new Array(prec - s[1].length + 1)
                    .join('0')
        }
        return s.join(dec)
    },
	bigNumberToText: function (val) {
        var result;
        var yi = val / 100000000;
        if (yi > 1) {
            result = yi.toFixed(2) + '亿';
        } else {
            var wan = val / 10000;
            if (wan > 1)
                result = wan.toFixed(2) + '万';
            else
                result = val;
        }
        return result;
    },
    /**
     * 日期转换函数
     * @param  {[longer]} val    [时间戳]
     * @param  {[int]} period [当前图显示的时间段1,5,30,60,100[1min,5min,30min,60min,1day]]
     * @return {[type]}        [description]
     */
    convertDate: function(val,period,showYear){
    	var time = '',ymd='',hour,minute,date = new Date(val);
        if(period>=100) {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            month = month<10 ? '0'+month: month;
            day = day<10 ? '0'+day : day;
            ymd = year + '-' + month + '-' + day;
        }
        if(showYear||period<100) {
            var hour = date.getHours();
            var minute = date.getMinutes();
            hour = hour<10 ? '0'+hour : hour;
            minute = minute<10 ? '0'+minute: minute;
            time = hour +":" + minute;
            if(ymd) {
                time = ' '+time;
            }
        }
        
        return  ymd+time;
    },
    throttle: function(fn,delay) {
        var timer = null;
        var t_start;
        delay = delay||200;

        return function() {
            var context = this,t_curr = +new Date();
            if(!t_start) {
                t_start = t_curr;
            }
            var args = arguments;
            if(t_curr - t_start <delay) {
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fn.apply(context,args);
                },delay)
            }else {
                fn.apply(context,args);
                t_start = t_curr;
            }
            
        }
    },

    objectCreate: function(){
        if(Object.create) {
            return Object.create;
        }else {
            return function(o){
                
            }
        }
        /*var F = function(){};
        F.prototype = o;
        return new F();*/
    },

    drawHLine: function (ctx,color, x0, y0, w, lineStyle) {
        ctx.strokeStyle = color;
        var dashSize = 3;
        if (y0 * 10 % 10 == 0) y0 += .5;
        if (lineStyle && lineStyle == 'dashed') {
            var width = 0;
            do {
                this.drawHLine(ctx,color, width, y0, dashSize, 1, 'solid');
                width += dashSize * 2;
            } while (width < w);
        }
        else {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0 + w, y0);
            ctx.stroke();
        }
    },
    drawVLine: function (ctx,color, x0, y0, h, lineStyle) {
        ctx.strokeStyle = color;
        var dashSize = 3;
        if (x0 * 10 % 10 == 0) x0 += .5;
        if (lineStyle && lineStyle == 'dashed') {
            var height = 0;
            do {
                this.drawVLine(ctx,color, x0, height, dashSize, 1);
                height += dashSize * 2;
            } while (height < h);
        }
        else {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x0, y0 + h);
            ctx.stroke();

        }
    },
    getXByShowDataIndex: function(i, barWidth, spaceWidth) {
        var result = i*(spaceWidth+barWidth) + barWidth*.5;
        if(result*10%10==0) result +=.5;
        return result;
    },
    getRelativeYByShowDataValue: function(value, high, low, height){
        var result = Math.ceil((high - value)*height/(high - low));
        if (result * 10 % 10 == 0) result += .5;
        return result;
    }
    
}
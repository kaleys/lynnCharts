var $ = require('jquery');
/**
 * [LynnSpinner description]
 * @param {[type]} input [input元素]
 * @param {[type]} opts  {
 *  min: 最小值
 *  step: 每次改变时候改变多少
 *  max: 最大值
 * }
 */
function LynnSpinner(input,opts){
	this.textField = $(input);
	this.opts = $.extend({
		min:1,
		step:1,
		max:Infinity
	},opts)

	this.init();

}

LynnSpinner.prototype = {
	constructor: LynnSpinner,
	init: function(){
		if(!this.textField) {
			throw new Error('没给input')
		}
		var container = $('<div class="lynn-spinner"></div>');
		this.textField.wrap(container);
		var btns = $('<span class="spinner-btn"><a href="javascritp:void(0);" class="increase"><i class="tgl-up"></i></a><a href="javascritp:void(0);" class="decrease"><i class="tgl-down"></i></a>').insertAfter(this.textField);
		
		this.textField.val(this.opts.min).addClass('spinner-input');

		var step = this.opts.step;
		var dotIndex = (step+"").indexOf('.');
		this.baseNum = 1;
		if(dotIndex!==-1) {
			var dotLength = (step+"").length - dotIndex -1;
			this.baseNum = Math.pow(10,dotLength*1);
		}

		var me  = this;
		this.textField.on('keyup',function(){
			var val = $(this).val();
			var v = me.valueChange.call(me,val);
			$(this).val(v);
			$(this).focus();
		})
		
		this.increaseBtn = btns.find('.increase').on('click',function(e){
			var ret = me.changeValue.call(me,1);
			if(ret){
				me.textField.focus();
			}
			return false;
		});
		this.decreaseBtn = btns.find('.decrease').on('click',function(e){
			var ret =me.changeValue.call(me,-1);
			if(ret){
				me.textField.focus();
			}
			return false;
		});
	},
	getVal: function(){
		return parseFloat(this.textField.val())||this.opts.min;
	},
	setVal: function(val){
		var v = this.valueChange(val);
		this.textField.val(v);
	},
	changeValue: function(delta){
		var value = this.getVal(),step = this.opts.step, min=this.opts.min, max = this.opts.max;
		if(delta<0&&value <= min) {
			return false;
		}
		if(delta>0&&value >=max) {
			return false;
		}
		value = Math.floor(value*this.baseNum);//1.11*100==111.000000000001
		var changeValue = delta*step*this.baseNum;
		var ret = (value+changeValue)/this.baseNum;
		if(ret>max) {
			ret = max
		}
		if(ret<min) {
			ret = min
		}
		this.textField.val(ret);
		return ret;
	},
	valueChange: function(v){
		var v =v.toString();
		var opts = this.opts,min = opts.min, max = opts.max;
		if(v.length==0) {
			return min;
		}
		var reg = /^\d+$/;
		if(this.baseNum!=1) {
			reg = /^(-?\d+)(\.\d*|\d+)$/;
		}
		if(!reg.test(v)){
			return parseFloat(v);
		}
		if(v < min) {
			return min;
		}
		if(v > max) {
			return max
		}
		var dotIndex = v.indexOf('.');
		if(this.baseNum==1||dotIndex==v.length-1){
			return v;
		}else {
			return Math.round(v*this.baseNum)/this.baseNum;
		}
		
	}
}



module.exports = LynnSpinner;
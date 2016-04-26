var $ = require('jquery');

function FollowTip($element,opts){
	this.container = $element;
	this.opts = opts;
	this.dir = {x:1,y:1};
	return this.init();
}

FollowTip.prototype = {
	constructor: FollowTip,
	init: function(){
		var opts = this.opts;
		if(!opts.width||!opts.height) {
			console.log('请设置高度或者宽度');
			return false;
		}
		var cls = opts.clsName ||''
		this.wrap = $('<div class="canvas-follow-tip '+cls+'" style="display:none; position: absolute; left:0; top:0; width:'+opts.width+'px; height:'+opts.height+'px"></div>').appendTo(this.container);
		return this;
	},

	calcPosition: function(pos,region){
		var opts = this.opts;
		if(opts.position) {
			return opts.position;
		}
		var wrapWidth,wrapHeight;
		if(region) {
			wrapWidth = region.width;
			wrapHeight = region.height;
		}else {
			wrapWidth = this.container.width();
			wrapHeight = this.container.height();
		}
		var margin = opts.margin||0, top=0 ,left=0 ;
		if(this.dir.y) {
			top = pos.y + margin;
			if(top > wrapHeight - opts.height - margin) {
				this.dir.y = 0;
				top = pos.y - opts.height - margin;
			}
		}else {
			top = pos.y - opts.height- margin;
			if(top < opts.height+margin) {
				this.dir.y = 1;
				top = pos.y + margin;
			}
		}

		if(this.dir.x) {
			left = pos.x + margin;
			if(left > wrapWidth - opts.width - margin) {
				this.dir.x = 0;
				left = pos.x - opts.width - margin;
			}
		}else {
			left = pos.x - opts.width - margin;
			if(left < opts.width + margin) {
				this.dir.x = 1;
				left = pos.x + margin;
			}
		}
		

		return {top:top,left:left};
		
	},

	hideTip: function(){
		this.wrap.hide();
	},

	showTip: function(){
		this.wrap.show();
	},
	changeTipPosition: function(pos,region){
		var tipPos = this.calcPosition(pos,region);
		this.wrap.css(tipPos);
	},
	changeTip: function(tip,pos,region) {
		this.changeTipPosition(pos,region);
		if(tip) {
			this.wrap.html(tip);
		}
		this.showTip();
	}
}

module.exports = FollowTip;

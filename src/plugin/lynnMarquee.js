var defaults = {
	dir:'x'	//没用
}

function LynnMarquee(opts){
	if(!opts.element) {
		return false;
	}
	this.element = opts.element
	this.options = common.extend(defaults,opts)
	this.timer = null;
	this.init();
}	

LynnMarquee.prototype = {
	init: function(){
		this.parentNode = this.element.parentNode;
		var parentWidth = parseFloat(common.getStyle(this.parentNode,'width'));
		
		var scrollWrap = document.createElement('div');
		scrollWrap.className = 'lynn-marquee-scroll-wrap';
		this.scrollWrap = scrollWrap;
		this.parentNode.appendChild(scrollWrap);
		common.addClass(this.element,'lynn-marquee-element');
		scrollWrap.appendChild(this.element);


		var width = parseFloat(common.getStyle(this.element,'width'));
		var col = Math.ceil(parentWidth/width);
		this.width = width;
		this.parentWidth = parentWidth;
		
		var frag = document.createDocumentFragment();
		for(var i=0;i<col;i++) {
			var cloneNode = this.element.cloneNode(true);
			frag.appendChild(cloneNode);
		}
		
		
		scrollWrap.appendChild(frag);
		
		this.initEvent();

	},

	initEvent: function(){
		var me = this;
		this.scroll();
		me.parentNode.addEventListener('mouseover',function(){
			me.stop();
		})
		me.parentNode.addEventListener('mouseout',function(){
			me.scroll();
		})

		me.parentNode.addEventListener('touchstart',function(){
			me.stop();
		})
		me.parentNode.addEventListener('touchend',function(){
			me.scroll();
		})
		
	},
	scroll: function(){
		var me = this;
		var width = this.width,parentWidth = this.parentWidth;
		this.timer = setInterval(function(){
			var left = me.parentNode.scrollLeft;
			if(left>=width) {
				me.parentNode.scrollLeft = 0;
			}else {
				me.parentNode.scrollLeft +=1;
			}
			document.title = me.parentNode.scrollLeft;
		},16)
	},
	stop: function(){
		this.timer&&clearInterval(this.timer);
	}
}

var common = {
	addClass: function(element,clsName) {
		var cls = element.className;
		if(cls.indexOf(clsName)==-1) {
			element.className = cls +' '+clsName
		}
	},
	removeClass: function(element,clsName) {
		var cls = element.className.split(' ');
		var index = cls.indexOf(clsName);
		if(index!==-1) {
			cls.splice(index,1);

			element.className = cls.join(' ');
		}

	},
	extend: function(obj1,obj2){
		var obj = obj1;
		for(var i in obj2) {
			obj[i] = obj2[i];
		}
		return obj;
	},
	getStyle: function(element,name){
		var styles = window.getComputedStyle(element,null);
		return styles[name];
	}
}
module.exports = LynnMarquee;
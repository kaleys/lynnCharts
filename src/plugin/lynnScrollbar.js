var $ = require('jquery');

/**
 * [LynnScrollbar description]
 * @param {[object]} opts {
 *   element:需要scrollbar的元素
 * }
 */
var noop = function(){};
var defaults = {
	onScroll:noop,
	onUpdate:noop,
	duration:200,
	dir:'y',
}
var namespace = {index:0,name:'scrollbar'};
function LynnScrollbar(opts){
	if(!opts.element) return false;
	$.extend(this,defaults,opts);
	this.element = $(this.element);
	this.element.addClass(LynnScrollbar.defaults.pluginCls);
	this.contentWrap = this.element.find('.'+LynnScrollbar.defaults.contentWrapCls) || this.element.find(':first-child').addClass(LynnScrollbar.defaults.contentWrapCls);
	this.namespace = '.' + namespace.name + "_" + namespace.index++;
	this.init();

}

LynnScrollbar.prototype = {
	init: function(){
		this.initScrollX();
		this.initScrollY();
		this.setSize();
	},
	initScrollX: function(){
		if(this.dir.indexOf('x')==-1) return false;
		var me = this;
		var position = this.contentWrap.position();
		var tpl = [
			'<div class="lynn-scrollbar-element scroll-x" style="bottom:0;left:'+position.left+'px;display:none">',
			'<div class="lynn-scrollbar-track"></div>',
			'<a href="javascript:void(0)" class="lynn-scrollbar-thumb"></a>',
			'</div>'
		].join('');
		this.scrollxWrap = $(tpl).appendTo(this.element);

		this.scrollxWrap.find('.lynn-scrollbar-thumb').on('mousedown'+me.namespace,function(e){
			var thumb = $(this);
			var x= e.pageX;
			var left = thumb.position().left, maxTop = me.clientWidth - $(this).height();
			var mouseMoveFn = throttle(function(e){
				var diff = e.pageX - x;
				var changeLeft = left+diff;
				changeLeft = Math.max(changeLeft,0);
				changeLeft = Math.min(changeLeft,maxLeft);
				if(changeLeft!=Left) {
					var scrollLeft = Math.ceil(changeLeft*me.scrollWidth/me.clientWidth);
					thumb.css('left',changeLeft);
					me.contentWrap.scrollLeft(scrollLeft);
				}
			})
			$(document).on('mousemove' + me.namespace, mouseMoveFn);
			return me.handleMouseDown(null,e);
			
		})
	},
	initScrollY: function(){
		if(this.dir.indexOf('y')==-1) return false;
		var me = this;
		var position = this.contentWrap.position();
		var tpl = [
			'<div class="lynn-scrollbar-element scroll-y" style="top:'+position.top+'px;right:0;display:none">',
			'<div class="lynn-scrollbar-track"></div>',
			'<a  href="javascript:void(0)" class="lynn-scrollbar-thumb"></a>',
			'</div>'
		].join('');
		this.scrollyWrap = $(tpl).appendTo(this.element);

		this.scrollyWrap.find('.lynn-scrollbar-thumb').on('mousedown'+me.namespace,function(e){
			var thumb = $(this);
			var y = e.pageY;
			var top = thumb.position().top, maxTop = me.clientHeight - $(this).height();
			var i=0;
			var mouseMoveFn = throttle(function(e){
				var diff = e.pageY - y;
				var changeTop = top+diff;
				changeTop = Math.max(changeTop,0);
				changeTop = Math.min(changeTop,maxTop);
				var scrollTop;
				if(changeTop==maxTop) {
					scrollTop = me.scrollHeight - me.clientHeight;
				}else {
					scrollTop = Math.ceil(changeTop*me.scrollHeight/me.clientHeight);
				}
				thumb.css('top',changeTop);
				me.contentWrap.scrollTop(scrollTop);
			},20)
			$(document).on('mousemove' + me.namespace, mouseMoveFn)
			
			return me.handleMouseDown(null,e);
			
		})
	},
	getScrollbarDoms: function(){
		var eles = {};
		if(this.scrollyWrap) {
			eles.y = this.scrollyWrap
		}
		if(this.scrollxWrap) {
			eles.x = this.scrollxWrap
		}
		return eles;
	},
	handleMouseDown: function(callback,event){
		var me = this, namespace = this.namespace;
		window.mouseMoveLocked = true;
		$('body').on('selectstart'+namespace,function(event) {
			event.preventDefault();
		})
		$(document).on('mouseup'+namespace,function(event){
			delete window.mouseMoveLocked
			$(document).add('body').off(namespace);
			callback&&callback();
		})

		event&&event.preventDefault();
		return false;
	},

	setSize: function(){
		var me = this;
		setTimeout(function(){
			resize.call(me);
		},2)
		function resize(){
			if(this.scrollyWrap) {
				var scrollHeight = this.contentWrap.prop('scrollHeight');
				var clientHeight = this.contentWrap.outerHeight();
				if(clientHeight < scrollHeight-5) {
					this.scrollHeight = scrollHeight;
					this.clientHeight = clientHeight;

					//计算高度
					var thumbHeight = Math.ceil((clientHeight*clientHeight)/scrollHeight);
					//计算scrollTop值
					var scrollTop = this.contentWrap.scrollTop();
					var top = Math.ceil(scrollTop*thumbHeight/scrollHeight);
					this.scrollyWrap.css({height:clientHeight}).find('.lynn-scrollbar-thumb').css({height:thumbHeight,top:top});
					this.scrollyWrap.show();
				}else {
					this.scrollyWrap.hide();
				}
			}
				
			if(this.scrollxWrap) {
				var scrollWidth = this.contentWrap.prop('scrollWidth');
				var clientWidth = this.contentWrap.outerWidth();

				if(clientWidth <scrollWidth-5) {
					this.scrollWidth = scrollWidth;
					this.clientWidth = clientWidth;

					var thumbWidth = (clientWidth*clientWidth)/scrollWidth;
					var scrollLeft = this.contentWrap.scrollLeft();
					var left = Math.ceil(scrollLeft*thumbWidth/scrollWidth);
					this.scrollxWrap.width(thumbWidth).find('.lynn-scrollbar-thumb').css({width:thumbWidth,top:top});
					this.scrollxWrap.show();
				}else {
					this.scrollxWrap.hide();
				}
			}
			
		}

	},
}

LynnScrollbar.defaults = {
	pluginCls:'lynn-scrollbar',
	contentWrapCls: 'lynn-scrollbar-content',
}

function throttle(fn,delay) {
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
}

module.exports = LynnScrollbar;
/*
(function(factory){
	if(typeof define==='function' && define.amd){
		define(['jquery'],factory);
	}else if(typeof exports=='object'&& typeof module =='object') {
		module.exports = factory(require('jquery'));
	}else {
		factory(jQuery);
	}
})(function($,undefined){*/

	var $ = require('jquery');
	/**
	 * Tab切换
	 * @param {object} opts [配置信息]
	 * {
	 *  	
	 *  	container: 被包含的element,
	 *  	minItemWidth: 200,
	 *  	items: [	//这里面的格式可以自己定义，与formatItemTpl结合，最少要有一个title,每个tab所需要数据
	 *  		{title:xxx,
	 *  		sellPrice:buyPrice,
	 *  		}	
	 *  	]
	 *  	showRemove: true				//是否显示删除图标
	 *
	 * 		formatItemTpl: function(item){}    	//每个tab的展示形式
	 *  	onRemove:function(item,parent){}		//点击删除后的回调函数
	 *  	onRemoveError: function(){}
	 *  	onClick: function(index){}		//点击item时的回调函数
	 *  	onAdd: function(item)			//添加item完成后的回调函数  
	 *  	onAddError: function(){}  
	 * }
	 */
	
	function LynnTabs(opts){
		var defaults = {
			container: document.body,
			items: [],
			showRemove: true,
			formatItemTpl: function(item) {
				return '<span>'+item.title+'</span>';
			},
			minItemWidth:200,
			minTabCount:1,
			maxTabCount: 8,
		}
		$.extend(this,defaults,opts);
		this.init();

	}

	LynnTabs.prototype = {
		constructor: LynnTabs,
		init: function(){
			var me = this;
			this.container = $(this.container);
			this.container.addClass(LynnTabs.opts.containerCls);
			this.wrap = $('<div class="lynn-tab-wrap"></div>').appendTo(this.container);
			this.formatItems();
			this.computedWidth();
			var tabCls = LynnTabs.opts.tabCls;
			this.container.on('click','.'+tabCls, function(e){
				var itemData = this.item;
				var target = e.target;
				var index = $(this).index();
				if(target.className == LynnTabs.opts.removeIcon) {
					var removed = me.remove(index);
					removed&&me.onRemove && me.onRemove.call(target,index)
					return false;
				} else {
					var ret = me.setActive(index,this);
					if(ret!==false) {
						me.onClick && me.onClick.call(target,index);
					}
					
				}
			})
		},
		formatItems: function(){
			var items = this.items;
			if(!items.length) return false;
 			var frag  = document.createDocumentFragment();
			for(var i=0,len = items.length;i<len; i++) {
				var item = items[i];
				var ele = this.formatItem(item);
				if(item.active&&this.activeIndex==void 0) {
					this.activeIndex = i;
					$(ele).addClass('active');
				}
				items[i].ele = ele;
				frag.appendChild(ele);
			}
			if(this.activeIndex==void 0) {
				this.activeIndex = 0;
				$(this.items[0].ele).addClass('active');
			}
			this.wrap.append(frag);
			this.checkIsOnlyOne();
		},
		formatItem: function(item){
			var itemTpl = this.formatItemTpl(item)||'';
			itemTpl = '<div class="lynn-item">'+itemTpl+'</div>';
			if(this.showRemove) {
				itemTpl += '<i class="'+LynnTabs.opts.removeIcon+'"></i>';
			}
			var tpl = '<a href="javascript:void(0)" class="'+LynnTabs.opts.tabCls+'">'+itemTpl+'</a>';
			var ele = $(tpl)[0];
			return ele;
		},
		indexOf: function(title){
			var items = this.items,exist = -1;
			var len = items.length;
			for(var i=0; i<len; i++) {
				var currTitle = items[i].title;
				if(currTitle==title) {
					exist = i;
					break;
				}
				if(i<len-1) {
					len = len-1;
					var lastTitle = items[len].title;
					if(lastTitle==title) {
						exist = len;
						break;
					}
				}
			}
			return exist;
		},
		add: function(item){
			if(!item.title) {
				return false
			}
			var len = this.items.length;
			if(len == this.maxTabCount) {
				this.onAddError&&this.onAddError.call(this);
				return false;
			}
			var indexOf = this.indexOf(item.title);
			if(indexOf==-1) {
				var ele = this.formatItem(item);
				if(item.active) {
					if(this.activeIndex!==void 0) {
						var activeEle = this.items[this.activeIndex].ele;
						$(activeEle).removeClass('active');
					}
					$(ele).addClass('active');
					this.activeIndex = len;
				}
				item.ele = ele;
				this.items.push(item);
				this.wrap.append(ele);
				this.computedWidth();
				this.checkIsOnlyOne();
				this.onAdd&&this.onAdd.call(this,item);
			}else {
				return false;
			}
		},
		remove: function(){
			if(this.items.length==this.minTabCount) {
				this.onRemoveError&&this.onRemoveError.call(this);
				return false;
			}
			var arg = arguments[0];
			var type = typeof arg,indexOf;
			switch(type) {
				case 'number':
					indexOf = arg;
				break;
				case 'string':
					indexOf = this.indexOf(arg);
				break;
				case 'object':
					var v = arg.title;
					indexOf = this.indexOf(v);
				break;
			}
			if(indexOf==void 0||indexOf==-1) {return false;}
			
			var item = this.items[indexOf];
			$(item.ele).remove();
			this.items.splice(indexOf,1);
			if(indexOf==this.activeIndex) {
				var maxIndex = this.items.length;
				if(indexOf==maxIndex) {
					this.activeIndex = maxIndex -1;
				}
				var activeEle = this.items[this.activeIndex].ele;
				$(activeEle).addClass('active');
			}

			this.checkIsOnlyOne();
			this.computedWidth();
			return true;
		},
		computedWidth: function(){
			var me = this;
			var maxWidth  = this.container.width();
			var tabs = this.wrap.find('.'+LynnTabs.opts.tabCls);
			var totalW = 0,activeWidth=0,count=0;
			tabs.each(function(i){
				count+=1;
				var width = $(this).data('w');
				if(!width) {
					width = $(this).outerWidth();
					$(this).data('w',width);
				}
				if(i==me.activeIndex) {
					activeWidth = width;
					count-=1;
				}
				totalW +=width;
				
			})
			if(totalW > maxWidth) {
				var avgWidth = Math.floor((maxWidth - activeWidth)/count);
				var activeWidth = maxWidth - avgWidth*count;
				tabs.each(function(i){
					var width = i!==me.activeIndex ? avgWidth: activeWidth;
					this.style.width = width+"px";
				})
				this.zoom = true;
			}else {
				if(this.zoom!==true) {return false;}
				tabs.each(function(){
					this.style.width = "";
				})
				this.zoom = false;
			}
		},
		setActive: function(index,target){
			var args = arguments,index;
			if(typeof args[0] =='number') {
				index = args[0];
				if(index<0||index>this.items.length) {
					return false;
				}
			}else if(typeof args[0]=='string') {
				index = this.indexOf(args[0]);
			}else {
				return false;
			}
			var cbFn = args[1]&&$.type(args[1])=='function' ? args[1] : null;
			if(index !== void 0 && index!==-1) {
				var item = this.items[index];
				ele = item.ele;
				if(index==this.activeIndex) {
					return false;
				}else {
					var activeEle = this.items[this.activeIndex].ele;
					$(activeEle).removeClass('active');
					this.activeIndex = index;
					$(ele).addClass('active');
					this.computedWidth();
				}
			}
		},
		setTitle: function(title,index) {
			var itemTpl = this.formatItemTpl(title) ||'';
			var item = $.extend(this.items[index],title);
			var tabEle = this.wrap.find('.'+LynnTabs.opts.tabCls+":eq("+index+")");
			tabEle.find('.lynn-item').html(itemTpl);
			tabEle[0].item = item;
		},
		checkIsOnlyOne: function(){
			var len = this.items.length;
			var ele = this.items[0].ele;
			if(len==1) {
				$(ele).find('.icon-close').hide();
			}else {
				$(ele).find('.icon-close').show();
			}
		},
		resize: function(){
			this.computedWidth();
		}
	}

	LynnTabs.opts = {
		containerCls: 'lynn-tabs',
		tabCls:'lynn-tab',
		removeIcon:'icon icon-close',
	}

	module.exports = LynnTabs;
/*})*/

var $ = require('jquery');
var LynnTabs = require('./LynnTabs');
var LynnScrollbar = require('./lynnScrollbar');

/**
 * 页面如何显示
 * @param {object} opts {
 *     container: 哪个元素生成,
 *     onError: function('action',status){}	//操作错误时的回调函数
 *     formatTabTpl: function(item){}		//设置tab的html
 *     onAdd: function(){}					//添加的回调函数
 *     onRemove: function(){}				//删除回调函数
 *     onClick: function(){}				//选中后的回调函数
 *     onZoomIn: function(){}				//放大后的回调函数
 *     onZoomOut: function(){}				//缩小后的回调函数
 *     col:0								//以几列显示，如果为0的话，就多tab显示
 *     margin:8								//每个子项目的间隔
 *     items: []							//初始化数据
 * }
 */

function LynnLayout(opts){
	this.container = opts.element||document.body;
	delete opts.element;
	var defaults = {
		onError: function(){},
		margin:8,
		col:0,
		items:[],
		minHeight:240
	};
	$.extend(this,defaults,opts);
	this.count = 0;

	this.init();
}

LynnLayout.prototype = {
	constructor: LynnLayout,
	init: function(){
		this.width = this.container.width();
		this.height = this.container.height();
		this.activeIndex = 0;
		this.initTabs();
		this.initItems();
		this.initEvents();

	},
	initTabs: function(){
		var me = this;
		this.container.css({padding:this.margin}).addClass('lynn-layout');
		var display=''
		if(this.col!=0) {
			display = 'display:none;';
		}
		var tabControl = $('<div class="lynn-layout-tabbar" style="'+display+'top:'+this.margin+'px;left:'+this.margin+'px;right:'+this.margin+'px;"></div>').appendTo(this.container);

		var opts = {
			container: tabControl,
			onRemoveError: function(error){
				me.onError.call(this,'remove',error);
			},
			onAddError: function(error){
				me.onError.call(this,'add',error);
			},
			onRemove: function(index){
				me.removeItem.call(me,index)
			},
			onClick: function(index){
				me.clickItem.call(me,index,true);
			}
		};
		this.tabControlEle = tabControl;
		if(this.formatTabTpl) {
			opts.formatItemTpl = this.formatTabTpl;
		}
		if(this.items) {
			opts.items = this.items;
		}
		this.tabObj = new LynnTabs(opts);
	},
	initItems: function(){
		this.itemsWrap = $('<div class="lynn-layout-items lynn-scrollbar-content"></div>').appendTo(this.container);
		var items = this.items;
		for(var i=0,len = items.length; i < len; i++) {
			this.addItem(items[i],true);
		}
		this.changeCol();
	},
	initEvents: function(){
		var me = this;
		this.container.on('click','.lynn-layout-item',function(e){
			var target = $(e.target), index = $(this).index();
			if(me.placeholder) {
				index -=1;
			}
			if(target.is('.win-close')) {
				me.tabObj.remove(index);
				me.removeItem(index);
				e.stopPropagation();
				return ;
			}else if(target.is('.win-big')) {
				me.zoomIn.call(me,target,index);
				e.stopPropagation();
				return ;
			}else if(target.is('.win-small')) {
				me.zoomOut.call(me,target,index);
				e.stopPropagation();
				return ;
			}
			me.clickItem.call(me,index);
		})
	},
	addItem: function(item,init){
		var tabAdd;
		if(!init) {
			tabAdd = this.tabObj.add(item);
		}
		if(tabAdd!==false) {
			var itemCtrls = '<div class="lynn-layout-item-ctrl">'+
				'<span class="win-small icon" style="display:none;">&#xe644;</span>'+
				'<span class="win-big icon">&#xe645;</span>'+
				'<span class="win-close icon">&#xe636;</span>'+
			'</div>';
			this.count +=1;
			var marginTop = this.col==0 ? 0 : ((this.count<=this.col) ? 0 : this.margin);
			var marginLeft = this.col<=1 ? 0 :((this.count%this.col==1) ? 0 : this.margin);
			var itemWrap = $('<div class="lynn-layout-item" style="margin-top:'+marginTop+'px;margin-left:'+marginLeft+'px">'+itemCtrls+'</div>').appendTo(this.itemsWrap);
			this.setLayoutActive();
			this.changeCol();
			this.onAdd&&this.onAdd.call(itemWrap,item);
		}
		return tabAdd;
	},
	getActiveIndex: function(){
		return this.activeIndex;
	},
	setLayoutActive: function(index){
		if(index==void 0) {
			index = this.tabObj.activeIndex;
		}else {
			if(index==this.activeIndex) return false;
		}
		var itemCls = '.lynn-layout-item';
		var item = this.container.find(itemCls+':eq('+index+')');
		item.addClass('active').siblings(itemCls).removeClass('active');
		if(this.col==0) {
			item.show().siblings(itemCls).hide();
		}
		this.activeIndex = index;
		this.onChangeActive&&this.onChangeActive.call(null,index);
		return index;
	},
	setActive: function(){
		var arg = arguments[0];
		var ret = this.tabObj.setActive(arg);
		if(ret!==false) {
			this.setLayoutActive();
		}
		return ret;
	},
	removeItem: function(index){
		var item = this.container.find('.lynn-layout-item:eq('+index+')').remove();
		this.count-=1;
		this.setLayoutActive();
		this.calcSize();
		this.checkIsOnlyOne();
		this.onRemove&&this.onRemove.call(null,index)
	},
	clickItem: function(index){
		this.setLayoutActive(index);
	},
	//放大
	zoomIn: function(target,index){
		if(this.placeholder) return ;
		var curItem = this.container.find('.lynn-layout-item:eq('+index+')');
		this.zoomItem = curItem;

		var style = 'float:left;'+curItem.attr('style');
		var div = '<div style="'+style+'"></div>';

		this.placeholder = $(div).insertBefore(curItem);
		
		curItem.css({
			'position':'absolute',
		 	'z-index':10, 
		 	'width': this.width, 
		 	'height': this.height,
		 	'margin-left':0,
		 	'margin-top' :0
		 });
		target.hide().prev().show();
		this.placeholder.data('target',target.prev());
		this.placeholder.data('index',index);

		//滚动条处理
		var scrollbars = this.scrollbarObj.getScrollbarDoms();
		var scrollStatus = {};
		for(var sb in scrollbars) {
			scrollStatus[sb] = scrollbars[sb].css('display');
			scrollbars[sb].hide();
		}

		this.scrollStatus = scrollStatus;

		this.onZoomIn && this.onZoomIn.call(target[0],index);
	},
	//缩小
	zoomOut: function(target,index){
		var marginLeft = this.placeholder.css('margin-left');
		var marginTop = this.placeholder.css('margin-top');
		var styles = {
			'position': '',
			'z-index': '',
			'width': this.itemWidth,
			'height': this.itemHeight,
			'margin-left': marginLeft,
			'margin-top' : marginTop
		}
		this.placeholder.remove();
		this.placeholder = null;
		this.zoomItem.css(styles);
		target.hide().next().show();

		var scrollbars = this.scrollbarObj.getScrollbarDoms();
		var scrollStatus = this.scrollStatus;
		for(var sb in scrollbars) {
			var status = scrollStatus[sb]||'none';
			scrollbars[sb].css('display',status);
		}
		var isAuto = arguments[2];
		if(isAuto == false) return false;
		this.onZoomOut && this.onZoomOut.call(target[0],index);
	},
	calcSize: function(count,col){
		var count = count||this.count, col = col||this.col;
		this.width = this.container.width()-1;
		this.height  = this.container.height();
		
		var col = col||1;
		this.itemWidth = Math.floor((this.width-this.margin*(col-1))/col);
		
		var row = Math.ceil(count/col),height;
		if(this.col !==0) {
			 height= Math.floor((this.height-this.margin*(row-1))/row);
		}else {
			height= this.height;
		}

		this.itemHeight = Math.max(height,this.minHeight);
		


		this.container.find('.lynn-layout-item').css({
			width: this.itemWidth,
			height: this.itemHeight
		})
	},
	resize: function(){
		this.tabObj.resize();
		this.calcSize();
		this.scrollbarResize();
	},
	changeCol: function(col){
		var me = this;
		var oldCol = this.col;
		if(typeof col=='number') {
			if(col==this.col) {
				return false;
			}
			this.col = col;
		}
		this.itemsWrap.removeClass('col_'+oldCol).addClass('col_'+this.col);

		//如果处于放大状态，要取消放大状态
		if(this.placeholder) {
			var target = this.placeholder.data('target');
			console.log(target);
			var index = this.placeholder.data('index');
			this.zoomOut(target,index,false)
		}

		this.calcSize();
		var items = this.container.find('.lynn-layout-item');
		if(this.col==0) {
			var activeIndex = this.activeIndex;
			items.each(function(i){
				$(this).css({'margin-top':0,'margin-left':0});
				if(i==activeIndex) {
					$(this).show();
				}else {
					$(this).hide();
				}
				$(this).find('.lynn-layout-item-ctrl').hide();
			})
			this.tabControlEle.show();
		}else {
			items.each(function(i){
				var index = i+1;
				var marginTop = index <=me.col ? 0 : me.margin;
				var marginLeft = (index % me.col ==1||me.col==1) ? 0 : me.margin;
				$(this).css({'margin-left': marginLeft,'margin-top':marginTop}).show();
				$(this).find('.lynn-layout-item-ctrl').show();
			})
			this.tabControlEle.hide();
		}
		this.scrollbarResize();
	},
	checkIsOnlyOne: function(){
		if(this.count==1) {
			this.container.find('.lynn-layout-item-ctrl').hide();
		}else {
			this.container.find('.lynn-layout-item-ctrl').show();
		}
	},
	scrollbarResize: function(){
		if(this.scrollbarObj) {
			this.scrollbarObj.setSize.call(this.scrollbarObj);
		}else {
			this.scrollbarObj = new LynnScrollbar({element:this.container})
		}
	},
	setTitle: function(title,index) {
		this.tabObj.setTitle.call(this.tabObj,title,index);
	}
}


module.exports = LynnLayout;
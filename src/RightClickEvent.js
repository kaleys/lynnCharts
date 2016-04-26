
var $ = require('jquery');
var FollowTip = require('./FollowTip');


function RightClickEvent(canvas,chartBox){
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.chartBox = chartBox;
	this.dynamicMenu = [];

	return this.init();
}

RightClickEvent.prototype = {
	constructor: RightClickEvent,
	init: function(){
		var opts = this.chartBox.events.rightClick, me = this;
		if(!opts.menus||!opts.menus.length) {
			return false;
		}
		//生成菜单
		this.initRightMenuHtml();
		//绑定菜单事件
		this.initMenuEvents();
		//绑定右键出现菜单事件
		this.bindRightClickEvent();

		//当点击页面其他地方时，要隐藏菜单
		$(document).on('click.rightClick',function(){
			me.rightMenuObj.hide();
			me.rightDialog.hideTip.call(me.rightDialog);
		});
		return this;
	},

	initRightMenuHtml: function(){
		var me = this,chartBox = this.chartBox,opts = chartBox.events.rightClick;
		
		//主菜单
		var menus = opts.menus;
		var fragment = document.createDocumentFragment(),height=menus.length*40+2;
		var mainMenu = document.createElement('div');
		mainMenu.className = 'main-menu';
		for(var i=0,menu; menu = menus[i++];) {
			var a = this.factoryMenu(menu,i-1);
			mainMenu.appendChild(a);
		}
		fragment.appendChild(mainMenu);

		//二级菜单
		var subMenus = opts.subMenus;
		if(subMenus) {
			var subMenu = document.createElement('div');
			subMenu.className = 'sub-menu';
			subMenu.style.display ='none';
			for(var j=0,submenu;submenu = subMenus[j++];) {
				var a = this.factoryMenu(submenu);
				subMenu.appendChild(a);
			}
			fragment.appendChild(subMenu);

			if(opts.onClick) {
				$(subMenu).on('click','a',function(e){
					opts.onClick.call(this,me.rightMenuObj.activeMainMenu);
				})
			}
		}



		this.rightDialog = new FollowTip(this.chartBox.canvasBox,{
			width:218,
			height: height,
			margin:5,
			clsName:'chart-right-menu'
		});
		
		this.rightDialog.wrap.append(fragment);
	},

	factoryMenu: function(menu,index) {
		var type = typeof menu;
		var a = document.createElement('a');
		a.href="javascript:void(0)";
		if(type=='object') {
			var tpl = menu.tpl;
			var fn = $.type(tpl) =='function';
			if(fn) {
				this.dynamicMenu.push({index:index,ele:a});
			}else {
				a.innerHTML = tpl;
			}
			if(menu.submenu) {
				a.submenu = true;
			}

			if(menu.click) {
				var me = this;
				$(a).on('click',function(){
					menu.click.call(this,me,me.chartBox.mouseInfo.yValue);
				})
			}
		}else {
			a.innerHTML = menu;
		}

		return a;
	},

	initMenuEvents: function(){
		var wrap = this.rightDialog.wrap;
		this.rightMenuObj = new RightMenus(wrap);
	},

	bindRightClickEvent: function(){
		var dynamicMenu = this.dynamicMenu,chartBox = this.chartBox, me = this, mainMenus = chartBox.events.rightClick.menus;
		$(this.canvas).on('contextmenu',function(e){
			me.rightMenuObj.hide();
			var mouseInfo = chartBox.mouseInfo;
			if(!mouseInfo) {
				return false;
			}

			//更新菜单
			for(var j=0,cur;cur=dynamicMenu[j++];){
				var index = cur.index;
				var tpl = mainMenus[index].tpl.call(cur.ele,me,mouseInfo.yValue);
				if(cur.ele.submenu) {
					tpl +='<i class="icon icon-triangle-right"></i>';
				}
				$(cur.ele).html(tpl);
			}
			
			me.rightDialog.changeTipPosition(mouseInfo.point, {width: mouseInfo.width, height: mouseInfo.heihgt});
			me.rightDialog.showTip();

			return false;
		})
	},

	destory: function(){
		$(document).off('.rightClick');
	}

}



function RightMenus(wrap,opts) {
	this.wrap = $(wrap);
	this.subMenu = this.wrap.find('.sub-menu');
	this.mainMenu = this.wrap.find('.main-menu');
	this.activeMainMenu = null;
	this.leaveTimer = null;
	this.opts = opts;
	this.init();
}
RightMenus.prototype = {
	init: function(){
		var me  = this;
		var mainMenus = this.mainMenu.find('a');

		mainMenus.on('mouseenter',function(){
			$(this).addClass('active');
			me.activeMainMenu = this;
			var more = this.submenu||$(this).data('submenu');
			if(more) {
				var borderWidth = parseInt(me.wrap.css('borderWidth'));
				
				var top = $(this).position().top-borderWidth;
				me.subMenu.css('top',top).show();
			}else {
				me.subMenu.hide();
			}
		}).on('mouseleave',function(){
			var more = this.submenu||$(this).data('submenu');
			if(!more) {
				$(this).removeClass('active');
				me.subMenu.hide();
				me.activeMainMenu = null;
				
			}else {
				var _self = this;
				me.leaveTimer&&clearTimeout(me.leaveTimer);
				me.leaveTimer = setTimeout(function(){
					$(_self).removeClass('active');
					if(me.activeMainMenu == _self) {
						me.activeMainMenu = null;
					}
					
				})
			}
		})

		this.subMenu.on('mouseenter',function(){
			me.leaveTimer&&clearTimeout(me.leaveTimer);
		}).on('mouseleave',function(){
			$(me.activeMainMenu).removeClass('active');
			me.activeMainMenu = false;
			$(this).hide();
		})
		
	},

	hide: function(){
		this.activeMainMenu&&$(this.activeMainMenu).removeClass('active');
		this.activeMainMenu = null;
		this.subMenu.hide();
	}
}

module.exports = RightClickEvent;
var $ = require('jquery');
/**
 * opt{
 * 		label: 'string' Or function(this.value)
 * 		value: 'string' Or [],
 * 		showGroup:true,										//是否显示group，目前还没写样式
 * 		listCls:''											//自定义当前下拉列表的class名称
 * 		items: string [指下拉出现的元素的id]				//生成下拉列表的数据
 * 			   Array [ 	//生成item的datas
 * 			   		{value:1,label:'这时是1',active:true,group:'default'},
 * 			   		{value:1,label:'这里是2',group:2},
 * 			   			
 * 			   		{value:2,label:'这里是2',active:false}
 * 			   ]
 * 			   object {
 * 			   		default:[{...},{....},{....}]
 * 			   }
 * 	     formatItemTpl: function({value:1,label:'这时是1',active:true}){return tpl}	//格式化item的展现形式,
 * 	     itemClick: function(itemEle,item,e.target){}								//当选项点击时的回调函数
 * 	     multiple: true 	//多选
 * 	     width:100,			//下拉列表的宽度
 * 	     labelWidth:80		//上面label宽度
 * 	     footer:[
 * 	     	{
	 * 	     	plugin:LynnSpinner,						//插件类名
	 * 	     	name:xxx, 								//如果有name，可以在this.plugins[xx]获取到这个值
	 * 	     	tpl:'<input type="text"></input>'		//对应的html
	 * 	     	options: {								//插件配置
	 * 	     		min:1,max:250,step:1
	 * 	     	}
 * 	     	},
 * 	     	{
 * 	     		tpl:'<button class="addBtn">添加</button>',
 * 	     		onClick:function(){}					//如果需要click，就需要填这个
 * 	     	}
 * 	     ],
 * 	     onAdd:function(){}
 * 	     	
 * 	     
 * }
 */
function LynnDropDown (wrap,opts){
	if(!wrap || !opts.label) {
		return false;
	}
	this.wrap = $(wrap);
	$.extend(this,{
		width:200,
		height: 150
	},opts);
	var dpListWrap = opts.dpListWrap || document.body;
	this.dpListWrap = $(dpListWrap);
	this.open  = false;
	this.groups = {};
	this.init();
}


LynnDropDown.prototype = {
	constructor: LynnDropDown,
	init: function(){
		var me = this;
		this.plugins = {};
		this.wrap.addClass('lynn-dropdown');
		var width=this.labelWidth ? 'style="width:'+this.labelWidth+'px"' :'';
		$('<div class="dp-label" '+width+'></div><a href="javascript:;" class="dp-toggle"><i class="tgl-up"></i></a>').appendTo(this.wrap);
		this.labelEle = this.wrap.find('.dp-label');
		this.toggleEle = this.wrap.find('.dp-toggle');
		this.initdpListEle();
		this.setLabel();
		this.initEvents();
		this.initFooter();
		LynnDropDown.default.list.push(this);

	},

	initdpListEle: function(){
		var items = this.items;
		var type = $.type(items);
		switch(type) {
			case 'string':
				this.dpListEle = $('#'+items).addClass(LynnDropDown.default.dpListCls).hide();
				this.getValueFromHtml();
				this.dpListEle.remove().appendTo(this.dpListWrap);
				break;
			case 'array':
				var ele = document.createElement('div');
				ele.style.width = this.width+"px";
				ele.style.display = 'none';
				ele.className = LynnDropDown.default.dpListCls;
				var frag = this.initArrayItems(this.items);
				ele.appendChild(frag);
				this.dpListEle = $(ele);
				this.dpListWrap.append(this.dpListEle);
				break;
		}
		if(!this.dpListEle) {
			throw new Error('没有生成下拉列表，请检查配置是否正确');
		}
		this.dpListEle.addClass(this.listCls);
	},

	getValueFromHtml: function(){
		var a = this.dpListEle.children('.lynn-dpitem');
		var me = this;
		var items = {}
		a.each(function(i,v){
			var value = $(this).data('v')||$(this).html();
			var group = $(this).data('group')||'default';
			var isActive = $(this).hasClass('active');
			if(!items[group]) {
				items[group] = [];
			}

			var item = {value:value,label:$(this).html(),active: isActive, group:group};
			this.item = item;
			item.ele = this;
			items[group].push(item);
			this.href="javascript:;"
			if(isActive) {
				if(me.multiple) {
					me.activedEle.push(this);
				}else {
					me.activedEle = this;
				}
			}
		})
	},
	initArrayItems: function(items) {
		var groups = {};
		for(var i=0,cur;cur = items[i++];) {
			if(!cur.group) cur.group = 'default';
			if(!groups[cur.group]) {
				groups[cur.group] = [];
			}
			cur.ele = this.getItemEle(cur);
			groups[cur.group].push(cur);
		}
		for(var g in groups) {
			groups[g] = groups[g].sort(function(a,b){
				var a = parseInt(a.value),b = parseInt(b.value);
				if(!isNaN(a)&&!isNaN(b)) {
					return a-b;
				}
			})
		}

		var frag = this.initObjectItems(groups);
		return frag;
	},
	initObjectItems: function(items) {
		this.items = items;
		this.count=0,groupIndex=0, frag = document.createDocumentFragment();
		for(var g in items) {
			if(groupIndex > 0) {
				var span = this.getGroupEel(g);
				frag.appendChild(span);
			}

			for(var j=0,e;e=items[g][j++];) {
				frag.appendChild(e.ele);
				this.count++;
			}
			groupIndex++;
		}

		if(this.activedEle) {
			var list  = this.activedEle;
			if(!this.multiple) {
				$(list).addClass('active');
			}else {
				for(var i=0,len = list.length;i<len;i++) {
					$(list[i]).addClass('active');
				}
			}
		}
		return frag;
	},

	getGroupEel: function(groupName){
		var span = document.createElement('span');
		span.className="separator";
		span.setAttribute('data-group',groupName);
		return span;
	},

	getItemEle: function(item) {
		var tpl = '';
		if($.type(this.formatItemTpl)=='function') {
			tpl = this.formatItemTpl(item);
		}else {
			var check = '';
			if(this.multiple) {
				var checked = '';
				if(item.active){
					checked = 'checked="checked"';
				}
				check = '<input type="checkbox" class="lynn-check" '+checked+'></input>'
			}
			var del = '';
			if(item.canDel) {
				del = '<i class="icon icon-recycle"></i>';
			}
			tpl = '<a href="javascript:;">'+check+item.label+del+'</a>';
		}
		var ele = $(tpl).addClass('lynn-dpitem')[0];
		ele.item = item;
		if(item.active) {
			if(!this.multiple) {
				this.activedEle = ele;
			}else {
				this.activedEle = this.activedEle||[];
				this.activedEle.push(ele);
			}
		}
		return ele;
	},	

	initEvents: function(){
		var me = this;
		this.toggleEle.on('click.dp', function(e){
			me.toggle.call(me)
		})
		this.dpListEle.on('click.dp','> .lynn-dpitem',function(e){
			e.stopPropagation();
			var item = this.item;
			var target = e.target;

			var isActive = item.active;
			var del = $(target).is('.icon-recycle');
			var obj={show:!isActive};
			if(del) {
				obj = {delete:true};
			}
			obj = $.extend(obj,item);
			
			
			if(del) {
				me.deleteItem(item);
			}else {
				changeStatus.call(this,isActive,e);
				me.setLabel();
			}
			
			if(!me.multiple) {
				me.toggle();
			}
			me.itemClick&&me.itemClick.call(this,obj,me);
			
		})

		function changeStatus(isActive,e){
			if(me.multiple) {
				var fn  = isActive ? 'removeClass' : 'addClass';
				$(this)[fn]('active');
				if(isActive) {
					var index = me.activedEle.indexOf(this);
					if(index) {
						me.activedEle.splice(index+1,1);
					}
				}else {
					me.activedEle.push(this);
				}
				$(this).find('input').prop('checked',!isActive);
				this.item.active = !isActive;
			}else {
				if(me.activedEle) {
					var currItem = this;
					if(me.activedEle==currItem) {
						e.stopPropagation();
						return false;
					}
					$(me.activedEle).removeClass('active');
					me.activedEle.item.active = false;
				}
				me.activedEle = $(this).addClass('active')[0];
				me.activedEle.item.active = true;
			}
		}
	},

	setActiveByItem: function(item){
		if(!this.multiple) {
			if(this.activedEle&&item.value==this.activedEle.item.value) {
				return false;
			}
			if(!item.ele) {
				if(!item.group) item.group = 'default';
				
				var indexInfo = this.indexOf(item);
				if(indexInfo.index==-1) {
					return false;
				}
				item = this.items[item.group][indexInfo.index];
			}
			var ele = item.ele;
			if(this.activedEle) {
				if(ele==this.activedEle) {
					return false;
				}
				$(this.activedEle).removeClass('active');
				this.activedEle.item.active = false;
			}
			$(ele).addClass('active');
			item.active = true;
			this.activedEle = ele;
			this.setLabel();
			return true;
		}else {
			this.activedEle = null;
			var items = item,frag;
			if($.type(items)=='array') {
				frag = this.initArrayItems(items);
			}else {
				frag = this.initObjectItems(items);
			}
			var wrap = this.dpListEle;
			if(this.footerEle) {
				this.footerEle.siblings().remove();
				$(frag).insertBefore(this.footerEle);
			}else {
				wrap.html('').append(frag);
			}
			
			this.setLabel();
		}
	},

	initFooter: function(){
		var me  = this;
		if(!this.footer) {
			return false;
		}	
		this.footerEle = $('<div class="lynn-dp-footer"></div>')
		if(this.footer&&$.type(this.footer)=='array') {
			for(var i=0,len = this.footer.length; i<len; i++) {
				var curr = this.footer[i];
				if(!curr.tpl) {
					continue;
				}
				var currNode = $(curr.tpl);
				this.footerEle.append(currNode);
				if(curr.plugin) {
					var PluginObj = curr.plugin;
					var obj = new PluginObj(currNode,curr.options);
					if(curr.name) {
						this.plugins[curr.name] = obj;
					}
				}
				if(curr.init&&$.type(curr.init) =='function'){
					var ret = curr.init.call(currNode,curr,me);
					if(curr.name) {
						this.plugins[curr.name] = ret;
					}
				}
				if(curr.onClick) {
					currNode.on('click',function(e){
						curr.onClick.call(this,me,e);
					});
				}
				
			}
		}

		this.dpListEle.append(this.footerEle);
	},

	setLabel: function(){
		var label = this.label,title='';
		if($.type(label)=='string') {
			v= label
		}else if($.type(label)=='function') {
			v = label.call(this,this.activedEle);
		}

		this.labelEle.html(v);
	},

	toggle: function(){
		if(!this.open) {
			this.wrap.addClass('open');
			var pos = this.getPosition();
			this.dpListEle.css({
				top: pos.top,
				left: pos.left
			});
			this.dpListEle.show();
		} else {
			this.wrap.removeClass('open');
			this.dpListEle.hide();
		}
		this.open = !this.open;
	},

	getPosition: function(){
		var offset = this.wrap.offset();
		var width = this.wrap.outerWidth();
		var height = this.wrap.outerHeight();
		var left = offset.left + width, top = offset.top + height+1;
		if(left < this.width) {
			left = offset.left;
		}else {
			left = left - this.width;
		}

		return {left: left, top: top};

	},

	indexOf: function(item,isInAllItemsIndex){
		var group = item.group||'default';
		var value = item.value,groupIndex, index = -1,gtIndex=-1;

		if(this.items[group]) {
			for(var i=0,cur;cur=this.items[group][i++];) {
				if(value > cur.value) {
					gtIndex = i-1;
				}
				if(cur.value==value) {
					index = i-1;
					break;
				}

			}
		}
		var groupIndex = 0;
		if(isInAllItemsIndex) {
			for(var g in this.items) {
				if(g==group) {
					break;
				}
				groupIndex +=this.items[g].length;
			}
		}
		
		return {index: index,groupIndex: groupIndex,gtIndex:gtIndex};
	},

	addItem: function(item) {
		var group = item.group = item.group||'default';
		var indexInfo = this.indexOf(item,true);
		if(indexInfo.index!==-1) return false;
		var frag = document.createDocumentFragment();
		if(!this.items[group]) {
			var span = this.getGroupEel(item.group);
			frag.appendChild(span);
		}
		
		var ele = this.getItemEle(item);
		item.ele = ele;
		var maxCount = this.maxCount,del;
		if(maxCount&&this.count>=maxCount) {
			this.onError&&this.onError.call(this,'error','最多只能添加'+maxCount+'项');
			return false;
		}
		var gtIndex = indexInfo.gtIndex;
		this.items[group] = this.items[group]||[];
		this.items[group].splice(gtIndex+1,0,item);
		frag.appendChild(ele);
		var groupIndex = indexInfo.groupIndex,baseEle;

		
		var i = groupIndex+gtIndex;
		baseEle = this.dpListEle.find('.lynn-dpitem:eq('+i+')');
		if(gtIndex==-1) {
			var nextSpan = baseEle.next();
			if(nextSpan.data('group')==group) {
				baseEle = nextSpan;
			}
		}
		$(frag).insertAfter(baseEle);
		
		this.count++;
		return true;		
	},

	deleteItem: function(item) {
		var indexInfo = this.indexOf(item);
		if(indexInfo.index!==-1) {
			var ele = $(item.ele);
			this.items[item.group].splice(indexInfo.index,1);
			if(this.items[item.group].length==0) {
				ele.prev().remove();
				delete this.items[item.group];
			}
			if(ele==this.activedEle) {
				this.activedEle = null;
			}
			ele.remove();
			this.count--;
			
		}
	}
};

LynnDropDown.default = {
	dpListCls : 'lynn-dplist',
	list:[]
}

$(document).on('click.dp',function(e){
	var list = LynnDropDown.default.list;
	var target = e.target;
	for(var i=0,len=list.length;i<len;i++) {
		var curr = list[i];
		if(!curr.open) {
			continue;
		}
		var isToggle = curr.toggleEle[0]==target||$.contains(curr.toggleEle[0],target);
		var isList = $.contains(curr.dpListEle[0],target);
		if(!isToggle&&!isList){
			curr.toggle();
		}

	}
})

module.exports = LynnDropDown;
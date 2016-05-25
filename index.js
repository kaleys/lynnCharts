require.config({
	baseUrl:'./',
	paths: {
		jquery:'./js/jquery.min'
	},
	shim: {
		jquery: {
			exports : 'jQuery'	
		}
	}
})

require(['jquery','dist/lynnCharts'],function($,lynnCharts){
	var charts = new lynnCharts({
		container:'#charts',
		items: [
			{title:'EUR/USD',ask:1.23344,bid:1.23456},
			{title:'NZD/USD',ask:1.23344,bid:1.23456}
		],
		toolbar:{
			period: {
				items: [
					{label: '1 Minute', value:1, active:true},
					{label: '5 Minute', value:5},
				]
			}
		},
		chartbox: {
			ajax: {
				//生成的url方法，也可以是个string
				url: function(){
					var symbol = this.title.title.replace('/','-');
					var period = this.chartOpts.period;
					return './datas/'+symbol+'-'+period+'.json';
				},
				//生成参数，也可以是个Object
				data: function(startX,endX){
					//如果左边没有值了，那此时endX就是最左侧的时间。
					//如果右侧没有值了，那startX就是最右侧的时间。
					//由于数据不是动态的，所以不能模拟正常的数据
					var symbol= this.title.title;
					data = {symbols:symbol};
					var date;
					if(startX) {
						data.startTime = startX;
						date = new Date(startX);
					}
					if(endX) {
						data.endTime = endX;
						date = new Date(endX);
					}
					data.date = date ? date.getFullYear()+ "-" + (date.getMonth()*1+1) + "-" + date.getDate():null;
					return data;
				},
				//在使用数据之前，格式化数据
				formatDatas: function(data){
					if(!this.ajaxCount){
						var symbol = this.title.title;
						var list = data.klineData[symbol];
						if(!list) {
							return false;
						}
						if(!list[0]) {
							list.shift();
						}
						list = list.reverse();
						this.ajaxCount=1;
						return list;
					}else {

						return [];
					}
				}
			},
			events: {
				rightClick: {
					menus: [
						{	
							tpl: function(rightClickEvent,limitPrice){
								var chartBox = rightClickEvent.chartBox;
								var marketPrice = chartBox.datas[chartBox.datas.length-1].close;
								if(limitPrice >marketPrice) {
									this.orderInfo = {orderType:'Limit',side:'Sell',symbol:chartBox.title.title,price:limitPrice};
									return '<span>限价卖单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}else {
									this.orderInfo = {orderType:'Limit',side:'Buy',symbol:chartBox.title.title,price:limitPrice};
									return '<span>限价买单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}
							},
							submenu:true
						},{
							tpl: function(rightClickEvent,limitPrice){
								var chartBox = rightClickEvent.chartBox;
								var marketPrice = chartBox.datas[chartBox.datas.length-1].close;
								if(limitPrice > marketPrice) {
									this.orderInfo = {orderType:'Stop',side:'Sell',symbol:chartBox.title.title,price:limitPrice};
									return '<span>止损卖单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}else {
									this.orderInfo = {orderType:'Stop',side:'Buy',symbol:chartBox.title.title,price:limitPrice};
									return '<span>止损买单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}
							},
							submenu:true
						},{
							tpl:'<span>新订单</span>',
							click: function(){
								console.log(1);
							}
						}
					],
					subMenus: [0.1,0.2,0.5,1,2],
					//二级菜单有效，一级菜单无效
					onClick: function(mainMenu){
						var quantity = parseFloat($(this).html());
						if(!mainMenu||isNaN(quantity)) {
							return false;
						}
						var orderInfo = mainMenu.orderInfo;
						orderInfo.quantity = quantity;
						console.log(orderInfo);
					}			
						
				}
			}
		},
		onAdd: function(item){
			//alert('添加成功，可以写添加后的操作');
			
		},
		onRemove: function(index,item){
			console.log(arguments);
			$("#add-symbol").find('.btn:eq('+index+')').removeClass('active');
		}

	})


	$("#add-symbol").on('click','.btn',function(){
		var symbol = $(this).data('symbol');
		var isSuccess = charts.add({title:symbol,ask:1.34556,bid:1.34566,active:true});
		if(isSuccess!==false) {
			$(this).addClass('active');
		}
	})

	$(window).on('resize',function(){
		var height = $(window).height()*0.8;
		charts.resize({height:height});
	})
})



/*require(['jquery','dist/lynnCharts'],function($,LynnCharts){
	

	var token = "595d126b-2ee3-4be9-af8f-2bfb10db484c";
	var lynnchart = new LynnCharts({
		container:'#charts',
		items: [
			{title:'EUR/USD',ask:1.23344,bid:1.23456},
			{title:'USD/CHF',ask:1.23344,bid:1.23456},
			{title:'USD/CHF',ask:1.23344,bid:1.23456},
		],
		chartbox: {
			ajax: {
				url:"/tmt/webTrade/getTestKlineData",
				data: function(startX,endX){
					var symbol= this.title.title;
					var data = {
						token: token,
						symbols:symbol,
						kline: this.chartOpts.period
					};
					var date;
					if(startX) {
							data.startTime = startX;
							date = new Date(startX);
						}
					if(endX) {
						if(endX<100) {
							debugger;
						}
						data.endTime = endX;
						date = new Date(endX);
					}
					data.date = date ? date.getFullYear()+ "-" + (date.getMonth()*1+1) + "-" + date.getDate():null;
					return data;
				},
				formatDatas: function(data){
					var symbol = this.title.title;
					var list = data.klineData[symbol];
					if(!list) {
						return false;
					}
					if(!list[0]) {
						list.shift();
					}
					list = list.reverse();
					return list;
				}
			},
			events: {
				rightClick: {
					menus: [
						{	
							tpl: function(rightClickEvent,limitPrice){
								var chartBox = rightClickEvent.chartBox;
								var marketPrice = chartBox.datas[chartBox.datas.length-1].close;
								if(limitPrice >marketPrice) {
									this.orderInfo = {orderType:'Limit',side:'Sell',symbol:chartBox.title.title,price:limitPrice};
									return '<span>限价卖单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}else {
									this.orderInfo = {orderType:'Limit',side:'Buy',symbol:chartBox.title.title,price:limitPrice};
									return '<span>限价买单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}
							},
							submenu:true
						},{
							tpl: function(rightClickEvent,limitPrice){
								var chartBox = rightClickEvent.chartBox;
								var marketPrice = chartBox.datas[chartBox.datas.length-1].close;
								if(limitPrice > marketPrice) {
									this.orderInfo = {orderType:'Stop',side:'Sell',symbol:chartBox.title.title,price:limitPrice};
									return '<span>止损卖单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}else {
									this.orderInfo = {orderType:'Stop',side:'Buy',symbol:chartBox.title.title,price:limitPrice};
									return '<span>止损买单</span><span>'+chartBox.title.title+'</span><span>'+limitPrice+'</span>'
								}
							},
							submenu:true
						},{
							tpl:'<span>新订单</span>',
							click: function(){
								console.log(1);
							}
						}
					],
					subMenus: [0.1,0.2,0.5,1,2],
					//二级菜单有效，一级菜单无效
					onClick: function(mainMenu){
						var quantity = parseFloat($(this).html());
						if(!mainMenu||isNaN(quantity)) {
							return false;
						}
						var orderInfo = mainMenu.orderInfo;
						orderInfo.quantity = quantity;
						console.log(orderInfo);
					}			
						
				}
			}
		},
		onRemove: function(){

		}
	})
	window.lynnchart = lynnchart;


	$(window).on('resize',function(){
		var height = $(window).height()*0.8;
		lynnchart.resize({height:height});
	})

	

})*/
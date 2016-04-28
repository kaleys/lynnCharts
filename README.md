#canvas多股票图表联动（目前只支持蜡烛图和分时图）

##目前的进展
  只能说实现在部分功能，一些设计上的缺陷，仍在修改中，bug也是有的
  
##设计上的思考

目前的设计还有一点逻辑混乱

![思维导图][1]

将在页面上显示的DOM分成一几个区域，区域指定图表类型（主图）以及一些附加的图表（副图）类型

对象结构如下:

![对象][2]

区域的配置如下：

```javascript
mainArea: {
    top:30,        //图表距离该区域上边距的距离
    right:30,     //距离右边距离
    height:200,    //图表我高度
    hignValue: 1, //最大值
    lowValue:0.5,    //最小值
    subChart: {
      MA5: {
        type:'MAS',
        daycounts:5,
        lineColor:'yellow'
      },
      ....
    }
}
```

设计上的缺陷：
    
    1. 概念不清晰。mainAreaChartObj包含一两个信息，一个是area对象,一个chart对象。
        这两个对象掺杂在一块了，应该要分开。
        
    2. 代码的复用性不强。目前area的配置里只存了一些基本的位置信息，图表一些数据的计算都是放在对应的chart对象里，
        导致不同的图表有些相同的计算方法属性。
        同area，数据的计算有些是相同的，这些相同的方法应该放到area对象里
        
    3. 扩展性不够。area对象和chart对象的掺杂，导到在改变chart的图表类型(从蜡烛图->分时图)，
        所有副图又要在新的chart生新实例化一遍（如果忘记写了，那不是副图都不出来了）。
        这样的副图依附主图的方式明显不对。
        
    4. 配置信息不够明确
    
需要考虑改进的地方
    
    1.如果有些副图是某一种类型的图表特有的，比如移动平均线只会在蜡烛图下面出现，那如何来设计
    2.移动设备的支持



  [1]: http://7xl0gm.com1.z0.glb.clouddn.com/oldMap.png
  [2]: http://7xl0gm.com1.z0.glb.clouddn.com/data-instructor.png

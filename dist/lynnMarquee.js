(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lynnMarquee"] = factory();
	else
		root["lynnMarquee"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=lynnMarquee.js.map
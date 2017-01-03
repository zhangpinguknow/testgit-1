(function($) {

	function Pointer(x, y) {
		this.x = x222222 ;
		this.y = y ;
	}
	function Position(left, top) {
		this.left = left ;
		this.top = top ;
	}
	
	$.fn.dom = function() { return this[0] ; }

	/* 构建容器功能1111  */
	$.fn.dict_item_content_build_function = function() {
		
		
	}
	
	/* 构建 box 容器功能  */
	$.fn.dict_item_build_function = function() {
		this.each(function() {
			$.extend(this, {
				full : function(item) { // 填充11111111
					var key = $("<span></span>").addClass("key").html(item.key).appendTo(this) ;
					var value = $("<span></span>").addClass("value").html(item.value).appendTo(this) ;
					var param_a = $("<span></span>").addClass("param_a").html(item.param_a).appendTo(this) ;
					var param_b = $("<span></span>").addClass("param_b").html(item.param_b).appendTo(this) ;
					var param_c = $("<span></span>").addClass("param_c").html(item.param_c).appendTo(this) ;
				},
				collisionCheck : function(pointer) { // 碰撞检测
					var currentItem = this ;
					$(this).siblings(".item").each(function() {
						if(pointer.x > this.box.offset().left &&
							pointer.x < this.box.offset().left + this.box.width() &&
							pointer.y > this.box.offset().top && 
							pointer.y < this.box.offset().top + this.box.height()) {
								// 碰到
							var object = this ;
							if(currentItem.box.offset().top > object.box.offset().top) {
								direction = "up" ;
							} else if(currentItem.box.offset().top < object.box.offset().top) {
								direction = "down" ;
							} else {
								direction = "normal" ;
							}
							currentItem.swap(object, direction) ;
						}
					}) ;
				},
				swap : function(object, direction) { // 交换位置
					var directions = {
						normal : function() {
							var newBox = object.box ;
							object.box = this.box ;
							this.box = newBox ;
							object.move() ;
							this.move() ;
						},
						down : function() {
							var startIndex = this.box.index() ;
							var endIndex = object.box.index() ;
							var currNode = this ;
							var newBox = object.box ;
							document.title = startIndex + " " + endIndex ;
							for(var i = endIndex; i > startIndex; i--) {
								var prevtNode = $(object).siblings(".item[index="+ (i - 1) +"]").dom() ;
								object.box = prevtNode.box ;
								object.move() ;
								object = prevtNode ;
							}
							this.box = newBox ;
							this.move() ;
						},
						up : function() {
							var startIndex = object.box.index() ;
							var endIndex = this.box.index() ;
							var currNode = this ;
							var newBox = object.box ;
							for(var i = startIndex; i < endIndex; i++) {
								var nextNode = $(object).siblings(".item[index="+ (i + 1) +"]").dom() ;
								object.box = nextNode.box ;
								object.move() ;
								object = nextNode ;
							}
							this.box = newBox ;
							this.move() ;
						}
					}
					directions[direction].call(this) ;
				},
				move : function() { // 移动
					$(this).attr("index", this.box.index()).stop(true).animate({ 
						left : this.box.offset().left,
						top : this.box.offset().top
					}, 300) ;
				},
				drag : function() { // 拖拽
					$(this).css("cursor", "pointer").css("z-index", "9999") ;
					var oldPointer = new Pointer() ;
					var oldPosition = new Position() ;
					var isDrag = false ;
					var currentItem = null ;
					$(this).mousedown(function(e) {
						$(this).stop(true) ;
						oldPointer.x = e.clientX ;
						oldPointer.y = e.clientY ;
						oldPosition.left = $(this).offset().left ;
						oldPosition.top = $(this).offset().top ;
						isDrag = true ;
						currentItem = this ;
					}) ;
					$(document).mousemove(function(e) {
						if(!isDrag) return isDrag ;
						$(currentItem).stop(true).css({
							left : oldPosition.left + e.clientX - oldPointer.x,
							top : oldPosition.top + e.clientY - oldPointer.y
						}) ;
						currentItem.collisionCheck({x : e.clientX, y : e.clientY}) ; // 碰撞检测
					}) ;
					$(document).mouseup(function(e) {
						if(!isDrag) return false ;
						isDrag = false ;
						currentItem.move() ;
						currentItem.css("z-index", "0") ;
						
					}) ;
				},
				bind_dbl_click_event : function() { // 绑定监听事件
					$(this).bind("dblclick", function(e) {
						this.lock_child_items() ;
						e.preventDefault() ;
					}) ;
				},
				move_to_box : function(currentItem, callback) {
					$(this).animate({
						left : currentItem.box.offset().left,
						top : currentItem.box.offset().top
					}, 100, function() {
						if($(this).next().length) {
							$(this).next().dom().move_to_box(currentItem, callback) ;
						} else {
							if(callback) {
								callback.call(currentItem) ;
							}
						}
						if(this != currentItem) {
							$(this).remove() ;
						}
					}) ;
				},
				lock_child_items : function() { // 加载子项
					var currentItem = this ;
					$(this).css("z-index", "9999") ;
					var siblings = $(this).siblings(".item") ;
					siblings.eq(0).dom().move_to_box(currentItem, function() {
						// 加载子项
						$(this).animate({
							left : 300,
							top : 200
						}, 500, function() {
							// 开始加载
							$(this).fadeOut(300, function() {
								
								// 删除所有的
							    $(this).remove();
                                //第二次发牌信息
								var datas = [
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "宁德", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "厦门", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "福州", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "莆田", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "泉州", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
									{key : "龙岩", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"}
								]
								
								$("ul").dom().reset_box().add_boxs(datas).animate_queue() ;
								
							}) ;
						}) ;
					}) ;
				},
				recovery_position : function() {
					
					$(this).animate({
						left : this.box.offset().left,
						top : this.box.offset().top
					}, 100, function() {
						if($(this).next().length) {
							$(this).next().dom().recovery_position() ;
						}
					}) ;
				},
				reset_position : function() {
					this.box = $(this).parent("li") ;
					$(this).attr("index", this.box.index()).css({
						position : "absolute",
						left : 300,// this.box.offset().left,
						top : 200///this.box.offset().top
					}).appendTo($(this).parents("div")) ;
				},
				init : function() {
					this.drag() ;
					this.reset_position() ;
					this.bind_dbl_click_event() ;
				}
			}).init() ;
		}) ;
		return this ;
	}
	
	
	
	/* 构建 box 容器功能  */
	$.fn.dict_box_build_function = function() {
		this.each(function() {
			$.extend(this, {
				addItems : function(items) {
					for(var i = 0; i < items.length; i++) {
						this.addItem(items[i]) ;
					}
				},
				addItem : function(item) {
					$("<div></div>").addClass("item").appendTo(this).dict_item_build_function().dom().full(item) ;
				}
			}) ;
		}) ;
		return this ;
	}
	
	/* 构建容器功能  */
	$.fn.dict_ul_content_build_function = function(datas) {
		this.each(function() {
			$.extend(this, {
				reset_box : function() {
					$("li", this).remove() ;
					return this ;
				},
				animate_queue : function() { // 动画队列
					
					$(".item:eq(0)").dom().recovery_position() ;
					return this ;
				},
				add_box : function(item) {
					$("<li></li>").appendTo(this).dict_box_build_function().dom().addItem(item) ;
					return this ;
				},
				add_boxs : function(datas) {
					for(var i = 0; i < datas.length; i++) {
						this.add_box(datas[i]) ;
					}
					return this ;
				},
				full_item : function(item, index) { // 填充多条数据
					var box = $("li", $(this)).eq(index) ;
					if(0 != box.length) {
						box.dict_box_build_function().dom().addItem(item) ;
					} else {
						this.add_box(item) ;
					}
					return this ;
				},
				full_items : function(datas) {
					for(var i = 0; i < datas.length; i++) {
						this.full_item(datas[i], i) ;
					}
					return this ;
				}
			}) ;
		}) ;
		return this ;
	}
	
	/* 构建ui界面 */
	$.fn.dict_build_ui = function(_settings) {
		var dict_item_content = $("<div></div>").addClass(_settings.baseContent).appendTo($(this)) ;
		var dict_ul_content = $("<ul></ul>").appendTo(dict_item_content) ;
		dict_item_content.dict_item_content_build_function() ;
		dict_ul_content.dict_ul_content_build_function().dom().add_boxs(_settings.datas).animate_queue() ;
		
		
	}
	
	$.fn.dict = function(options) {
		var defs = {
		    baseContent: "dict_item_content",
            //第一次发牌信息
			datas : [
				{key : "福建", value : "Fujian", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "上海", value : "Shanghai", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "北京", value : "Beijing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "天津", value : "Tianjing", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "广西", value : "Guangxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "石家庄", value : "ShijiaZhuang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "新疆", value : "Xinjiang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "广东", value : "Guangdong", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "陕西", value : "Shanxi", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "江苏", value : "Jiangsu", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "南昌", value : "NanChang", param_a : "参数A", param_b : "参数B", param_c : "参数C"},
				{key : "印度", value : "Yindu", param_a : "参数A", param_b : "参数B", param_c : "参数C"}
			]
			
		}
		var _settings = $.extend(defs, options) ;
		this.dict_build_ui(_settings) ;
	}
})($) ;
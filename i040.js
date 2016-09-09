// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i040', function($scope) {
	$scope.searchTypeMenu = '查询类型';
	$scope.dolListMenu = 10;
	$scope.exchangeListEdit = '兑换方式';
	$scope.sellerShoeType = '查询类型';

	$scope.addGoodsData = {};
		
	//时间控件	
	$scope.datetimepicker = function(){ 
	$.datetimepicker.setLocale('ch');//设置中文
		$('#datetimepicker').datetimepicker({
		  lang:"ch",           //语言选择中文
		  format:"Y-m-d",      //格式化日期
		  timepicker:false,    //关闭时间选项
		  yearStart:2000,     //设置最小年份
		  yearEnd:2050,        //设置最大年份
		  todayButton:true    //关闭选择今天按钮
		});
	apiconn.send_obj({
		// 典型的请求都有这两个字段，
		"obj": "associate",
		"act": "mock",
		"to_login_name": TOOLBOX_ACCOUNT,
		"data": {
			"obj":"test",
			"act":"datetimepicker", // 区分不同的输入
			// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
			// data 可以是复杂的哈希数组
			"data":"输入时间"
		}
	});
	};
	
	//图片预览
	$scope.choose_pic = function(){ 
		$("#file_upload").change(function() {
var $file = $(this);
var fileObj = $file[0];
var windowURL = window.URL || window.webkitURL;
var dataURL;
var $img = $("#preview");
 
if(fileObj && fileObj.files && fileObj.files[0]){
dataURL = windowURL.createObjectURL(fileObj.files[0]);
$img.attr('src',dataURL);
}else{
dataURL = $file.val();
var imgObj = document.getElementById("preview");
// 两个坑:
// 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
// 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
 	console.log($(this).val());
}
});
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "associate",
			"act": "mock",
			"to_login_name": TOOLBOX_ACCOUNT,
			"data": {
				"obj":"test",
				"act":"choose_pic", // 区分不同的输入
				// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
				// data 可以是复杂的哈希数组
				"data":$('#file_upload').val()
			}
		});
	};
	
	$scope.showList01 = function(){ 
		$('#type_list_menu').slideToggle(200);
		$('#type_list_menu').children().click(function(){ 
			$scope.searchTypeMenu=$(this).html();
		});
	};
	$scope.showList02 = function(){ 
		$('#dol_list_menu').slideToggle(200);
		$('#dol_list_menu').children().click(function(){ 
			$scope.dolListMenu=$(this).html();
		});
	};
	$scope.showList03 = function(){ 
		$('#exchange_list_edit').slideToggle(200);
		$('#exchange_list_edit').children().click(function(){ 
			$scope.exchangeListEdit=$(this).html();
		});
	};
	$scope.showList04 = function(){ 
		$('#seller_show_type').slideToggle(200);
		$('#seller_show_type').children().click(function(){ 
			$scope.sellerShoeType=$(this).html();
		});
	};
	
	$scope.addGoods = function(){ 
		console.log($scope.newImageFid);
		$scope.newExchgeWay = $scope.exchangeListEdit;
		apiconn.send_obj({
			// 典型的请求都有这两个字段，
			"obj": "truck",
			"act": "add_goods",
			"to_login_name": TOOLBOX_ACCOUNT,
			"admin_id":'',
			"goods_info": {
				"name":$scope.newName,
				"image_fid":$('#preview').attr('src'),
				"price":$scope.newPrice,
				"init_price":$scope.newInitPrice,
				"introduce":$scope.newIntroduce,
				"exchge_way":$scope.newExchgeWay,
				"merchant_name":$scope.newMerchantName,
				"min_visible_lv":$scope.newMinVisibleLv	
			}
		});
	};
	
	$scope.giveupSave = function(){ 
		$('#giveup_save').show();
		$scope.cancelCan= false;
	};	
	$scope.cancel = function(){ 
		$scope.cancelCan = true;
	};
	
	//取消保存，编辑窗口关闭，清空编辑内容
	$scope.sure = function(){ 
		$scope.sureGiveup = true;
		$scope.cancelCan= true;
		$scope.newName = '';
		$scope.newImageFid ='';
		$scope.newPrice = '';
		$scope.newInitPrice = '';
		$scope.newIntroduce = '';
		$scope.newExchgeWay = '';
		$scope.newMerchantName = '';
		$scope.newMinVisibleLv = '';	
	};
	$scope.menuEdit = function(){ 
		$('#menu_edit').show();
		$scope.sureGiveup = false;
	};

  // 【2】 按键按下 是用户输入，调用这里定义的 input 函数，工具箱那边登录后可>以观察到
  // 通常这里会收集一些数据，一起发送到服务器。比如一个选日期的界面，这里就应>该有用选择的日期
  $scope.input = function(event) {
  	apiconn.send_obj({
		// 典型的请求都有这两个字段，
		"obj": "associate",
		"act": "mock",
		"to_login_name": TOOLBOX_ACCOUNT,
		"data": {
			"obj":"test",
			"act":"input1", // 区分不同的输入
			// 通常还有采集到的用户在界面输入的其他数据，一起发送好了
			// data 可以是复杂的哈希数组
			"data":$scope.inputMsg
		}
	});

	// 典型的接口请求，构造一个请求包 调用 send_obj 就可以了
	// 就是这个send可能会被SDK拒绝。接收后，如果服务端超时，
	// 会在15秒内给出响应： uerr: ERR_CONNECTION_EXCEPTION
  };

  $scope.output = "等待服务端数据";
  
  $scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {

	// 约定是响应的JSON里面如果有 uerr 错误码字段，说明用户
	// 要处理。 ustr 是文本字符串的错误说明
	// 另外是 derr 是说明程序错误，不是用户导致的。用户不用作处理。
	
    // 【3】 工具箱那里按键 "send input" 后，会发送数据到本APP。这个是模拟服务器 “输出”
    // 如果APP 要响应服务器的输出，像请求响应，或服务器的推送，就可以在>这里定义要做的处理
    // 工具箱那里按键"send input" 这个： 
    // {"obj":"associate","act":"mock","to_login_name":"IWEB_ACCOUNT","data":{"obj":"test","act":"output1","data":"blah"}}

	if (jo.obj == "truck" && jo.act == "add_gooods") {
		// 服务端的数据来了，呈现
		$scope.addGoodsData = jo.data;
	}
	if (jo.obj == "person" && jo.act == "login" && !jo.ustr) {
		$scope.message = "帐号："+IWEB_ACCOUNT+" 这边已经自动登录。请在工具箱那边登录："+TOOLBOX_ACCOUNT
	}
  });
});

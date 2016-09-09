iweb.controller('main', function($scope) {

	$scope.login_name = "";
	$scope.login_passwd = "";
	
	$scope.login_name = localStorage.getItem("name");
	$scope.login_passwd = localStorage.getItem("pass"); 

	$scope.login = function() {
		if (apiconn.conn_state == "IN_SESSION") {
			goto_view("i000");
			return;
		}
		
		apiconn.credential($scope.login_name, $scope.login_passwd);
		apiconn.connect();
		
		localStorage.setItem("name", $scope.login_name); 
		//localStorage.setItem("pass", $scope.login_passwd); 
		/*
		apiconn.send_obj_now({
			"obj": "person",
			"act": "login",
			"login_name": $scope.login_name,
			"login_passwd": $scope.login_passwd,
			"verbose": "1"
		});*/
	};

	$scope.register_goto = function(event) {
		goto_view("i000");
	};

	$scope.$on("RESPONSE_RECEIVED_HANDLER", function(event, jo) {
		if (jo.obj == "person" && jo.act == "login" && (jo.ustr == null || jo.ustr == "")) {
			console.log("server response: login" + jo.user_info.person_name);
			rootScope.person_name = jo.user_info.person_name;
			rootScope.person_id = jo.user_info._id;
			goto_view("i000");
		}
	});
	
	$scope.$on("STATE_CHANGED_HANDLER", function(event, jo) {
		//alert("STATE_CHANGED_HANDLER");
		if (apiconn.conn_state == "LOGIN_SCREEN_ENABLED") {
			document.getElementById("loginButton").style.backgroundColor = "green";
			document.getElementById("loginButton").disabled = false;
		}
	});
});

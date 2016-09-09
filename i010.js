// 页面逻辑定制在这里，布局在 i.html 和 i.css 
iweb.controller('i010', function ($scope) {
    $scope.navi = 0;
    $scope.price = 2000;
    $scope.drwname = '绘制商圈';
    //数据
    var dx = 119.314436, dy = 26.057599, dwidth = 0.03, dheight = 0.03;
    var per = 13;//地图放大级别
    $scope.selecttable1i;
    $scope.username = localStorage.getItem("name");
    var shangquan = [];
    //初始化表格1
    $scope.table1fix = {
        "obj": "circle",
        "act": "list",
        "page_num": 1,
        "page_size": 10
    }
    $scope.ceil = function (a) {
        return Math.ceil(a);
    }
    setTimeout(function () {
        $scope.searchtable1();
    }, 0);

    $scope.hidesq = function (state, index, id) {
        console.log(state, index, id);
        var data = [state, index, id];
        var txt = "是否确认"+(state=='run'?'隐藏商圈':'解除隐藏')+"?"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.pdata = data;
                    $scope.passtate = '隐藏商圈';
                    $scope.navi = 5;
                });
            }
        })
    }
    $scope.deletesq = function (index, id) {
        var txt = "是否确认解除商圈,解除后所有配置信息将同步删除"
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.table1.splice(index, 1)
                    $scope.pdata = id;
                    $scope.passtate = '解除商圈';
                    $scope.navi = 5;
                });
            }
        })
    }

    $scope.toufan = function (i) {
        $scope.selecttable1i = i;
        var data = $scope.table1[$scope.selecttable1i];
        var data1 = shangquan[$scope.selecttable1i];
        $scope.table4 = {
            "circle_id": data1.id,
            "obj": "circle",
            "act": "update",
            "top_left": {
                "latitude": data1.y + data1.height,
                "longitude": data1.x - data1.width
            },
            "low_right": {
                "latitude": data1.y - data1.height,
                "longitude": data1.x + data1.width
            },
            "name": data.name,
            "area": data1.width * 220 * data1.height * 1111,
            "density": data.numb,
            "pre": data.pre
        }
        $scope.navi = 3;
    }

    $scope.searchtable1 = function () {
        var data = $.extend({}, $scope.table1fix);
        data.page_num -= 1;
        console.log(data);
        apiconn.send_obj(data);
    }

    $scope.table1left = function (is) {
        if (is) {
            $scope.table1fix.page_num -= 1;
            $scope.searchtable1();
        }
    }
    $scope.table1right = function (is) {
        if (is) {
            $scope.table1fix.page_num += 1;
            $scope.searchtable1();
        }
    }
    $scope.peizhi3 = function () {
        var iserror = false;
        var percent = 0;
        if (!$scope.table4.name || !$scope.table4.density) {
            iserror = true;
        }
        for (i in $scope.table4.pre) {
            var item = $scope.table4.pre[i];
            if (!item.percent) {
                iserror = true;
                break;
            } else {
                percent += (item.percent - 0);
            }
        }
        if (iserror) {
            var txt = "请完善配置信息";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        if (percent != 100) {
            var txt = "商品库配比总和不为100%";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
            return false;
        }
        var txt = '是否确定该配置投放'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                sptf();
                $scope.$apply(function () {
                    navi = 0;
                })
            }
        })
    }
    $scope.nai5ok = function () {
        if ($scope.password == '123') {
            if ($scope.passtate == '解除商圈') {
                $scope.pdata = id;


                console.log('调用解除商圈接口')
                // apiconn.send_obj({
                //
                // });
                var txt = "解除商圈成功";
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);


            }
            if ($scope.passtate == '隐藏商圈') {

                var state = $scope.pdata[0]
                    , index = $scope.pdata[1]
                    , id = $scope.pdata[2], txt;
                if (state = 'run') {
                    state = 'hide'
                } else {
                    state = 'run'
                }
                console.log($scope.pdata);
                console.log(index);
                console.log($scope.table1[index]);
                $scope.table1[index].state = state;
                apiconn.send_obj({
                    "obj": "circle",
                    "act": "switch",
                    "circle_id": id,
                    "status": state
                });
                if (state == 'run') {
                    txt = "解除商圈成功";
                } else {
                    txt = "隐藏商圈成功";
                }

                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
            }
        }
    }
    $scope.n4peizhi = function () {
        if ($scope.h4navi == 3) {
            $scope.table4.pre = [];
            for (i in $scope.table5) {
                var item = $scope.table5[i];
                if (item.select) {
                    $scope.table4.pre[i] = {
                        DGT_id: $scope.table5[i].DGT_id,
                        DGT_name: $scope.table5[i].DGT_name,
                        percent: $scope.table5[i].percent
                    }

                }
            }
        }
        $scope.navi = $scope.h4navi
    }


    $scope.addspk = function () {
        apiconn.send_obj({
            "obj": "DGT",
            "act": "list",
            "page_num": 0,
            "page_size": 100
        });
        $scope.h4navi = 3;
        $scope.navi = 4;
    }
    //商品投放
    function sptf() {
        console.log($scope.table4);
        var data = $.extend({}, $scope.table4);
        data.DGT_list = {};
        for (i in data.pre) {
            data.DGT_list[data.pre[i].DGT_id] = data.pre[i].DGT_name;
        }
        console.log(data);
        apiconn.send_obj(data);
    }

    $scope.$on("RESPONSE_RECEIVED_HANDLER", function (event, jo) {
        if (jo.obj == "circle" && jo.act == "list") {
            setmap(jo.circle_map);
            settable(jo.circle_list)
        }
        if (jo.obj == "DGT" && jo.act == "list") {
            console.log(jo.DGT_list);
            console.log($scope.table4);
            $scope.table5 = jo.DGT_list;
            for (i in $scope.table4.pre) {
                var t4 = $scope.table4.pre[i];
                for (j in $scope.table5) {
                    var t5 = $scope.table5[j];
                    if (t5.DDGT_id == t4.DDGT_id) {
                        $scope.table5[j].select = true;
                        $scope.table5[j].percent = $scope.table4.pre[i].percent;
                    } else {
                        $scope.table5[j].select = false;
                    }
                }
            }
            console.log($scope.table5);
        }
        if (jo.obj == "person" && jo.act == "login") {

        }
    });

    function setmap(data) {
        for (i in data) {
            var low_right = data[i].low_right;
            var top_left = data[i].top_left;
            shangquan[i] = {
                y: (low_right.latitude + top_left.latitude) / 2,
                x: (low_right.longitude + top_left.longitude) / 2,
                width: Math.abs(low_right.latitude - top_left.latitude),
                height: Math.abs(low_right.longitude - top_left.longitude),
                title: data[i].name,
                numb: data[i].point_num,
                id: data[i].circle_id,
            }
        }
        setTimeout(function () {
            //画商圈
            for (var i = 0; i < shangquan.length; i++) {
                drawPolygonaa(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].numb, i);
            }
        }, 10);
    }

    function zero(n) {
        return n >= 10 ? n : ('0' + n);
    }

    function getdate(data) {
        return data.getFullYear() + '-' + zero(data.getMonth() + 1) + '-' + zero(data.getDate()) + ' ' + zero(data.getHours()) + ':' + zero(data.getMinutes())
    }

    function settable(data) {
        console.log(data);
        //商圈
        $scope.table1 = [];
        $scope.table1fix.length = data.length;
        for (i in data) {
            var date = new Date(data[i].update_time);
            $scope.table1[i] = {
                time: getdate(date),
                name: data[i].name,
                id: data[i].circle_id,
                numb: data[i].density,
                pre: data[i].DGT_list,
                state: data[i].status
            }
        }
    }

    //商圈地图1
    // var shangquan = [
    //     {
    //         x: 119.314436,
    //         y: 26.057599,
    //         width: 0.01,
    //         height: 0.01,
    //         title: '商圈一',
    //         numb: 12313
    //     },
    //     {
    //         x: 119.414436,
    //         y: 26.057599,
    //         width: 0.01,
    //         height: 0.01,
    //         title: '商圈二',
    //         numb: 113
    //     }
    // ];
    var shangquanMap = [];

    //商圈地图二
    var shangquan2 = [
        {
            x: 119.314436,
            y: 26.057599,
            width: 0.01,
            height: 0.01,
            title: '商圈一',
            numb: 12313
        },
        {
            x: 119.414436,
            y: 26.057599,
            width: 0.01,
            height: 0.01,
            title: '商圈二',
            numb: 113
        }
    ];


    $scope.gonav = function (i) {
        // if(i==0){
        //     setTimeout(function () {
        //
        //     },0)
        //     $('#allmap').replaceWith('<div class="content2" id="allmap"></div>');
        //
        //
        // }
        $scope.navi = i;

    }

    $scope.editku = function (data) {
        console.log('编辑该库');
        console.log('数据:' + data);
    }

    $scope.i3out = function () {
        var txt = '退出将无法保存当前配置'
        window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
            onOk: function (v) {
                $scope.$apply(function () {
                    $scope.navi = $scope.h4navi;
                })
            }
        })
    }


    $scope.output = "等待服务端数据";


    var haspolygon = false, canedit = true, move = false, haschange = false, polygon, first = true, down = false, index, sx, sy, dx, dy, map;
    var ox = dx, oy = dy, width = dwidth, height = dheight, lastPolygon, polygons, up = false;
    $scope.show = false;

    function dxywh() {
        ox = dx;
        oy = dy;
        width = dwidth;
        height = dheight;
    }


    $scope.saveDraw = function () {
        for (var i = 0; i < shangquan.length; i++) {
            if (i == index) {
                continue;
            }
            var item = shangquan[i];
            var x1 = item.x;
            var y1 = item.y;
            var width1 = item.width;
            var height1 = item.height;
            var w = x1 - ox;
            var h = y1 - oy;
            if ((Math.abs(w) < Math.abs(width1 + width)) && (Math.abs(h) < Math.abs(height1 + height))) {
                if ((Math.abs(w) < Math.abs(width1 - width)) && (Math.abs(h) < Math.abs(height1 - height))) {

                } else {
                    var txt = "商圈间不能部分重叠,请重新规划商圈";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.error);
                    return false;
                }
            }
        }
        lastPolygon.disableEditing();
        map.removeOverlay(lastPolygon);
        if (index >= 0) {
            alert(1);
            shangquan[index].x = ox;
            shangquan[index].y = oy;
            shangquan[index].width = width;
            shangquan[index].height = height;
            shangquanMap[index] = lastPolygon;
            drawPolygonaa(ox, oy, width, height, shangquan[index].title, shangquanMap[index].numb, index);

            $scope.selecttable1i = index;
            var data = $scope.table1[$scope.selecttable1i];
            var data1 = shangquan[$scope.selecttable1i];
            $scope.table4 = {
                "circle_id": data1.id,
                "obj": "circle",
                "act": "update",
                "top_left": {
                    "latitude": data1.y + data1.height,
                    "longitude": data1.x - data1.width
                },
                "low_right": {
                    "latitude": data1.y - data1.height,
                    "longitude": data1.x + data1.width
                },
                "name": data.name,
                "area": data1.width * 220 * data1.height * 1111,
                "density": data.numb,
                "pre": data.pre
            }
        } else {
            $scope.table4 = {
                "obj": "circle",
                "act": "add",
                "top_left": {
                    "latitude": oy + height,
                    "longitude": ox - width
                },
                "low_right": {
                    "latitude": oy - height,
                    "longitude": ox + width
                },
                "area": width * 220 * height * 1111
            }
        }


        dxywh();
        $('.bel,.del').remove();
        lastPolygon = null;
        haspolygon = false;
        up = false;
        move = false;
        canedit = true;
        haschange = false;
        huanyuan();
        $scope.drwname = '绘制范围';
        $scope.show = false;
        $scope.navi = 3;
        $scope.h1navi = 0;
    }


    $scope.draw = function () {
        //取消绘制
        if (haspolygon) {
            haspolygon = false;
            //已经使用商圈
            if (canedit) {
                lastPolygon && lastPolygon.disableEditing();
                $('.bel,.del').remove();
                lastPolygon = null;
                canedit = false;
                dxywh();
                up = false;
                move = false;

                if (haschange) {
                    huanyuan();
                    canedit = true;
                    haspolygon = false;
                    move = false;
                    haschange = false
                    $scope.show = false;
                }
            } else {
                map.removeOverlay(lastPolygon);
                move = false;
                lastPolygon = null;
                $scope.show = false;
                canedit = true;
            }
            haschange = false;
            $scope.drwname = '绘制商圈';
        } else {
            index = -1;
            move = true;
            haspolygon = true;
            $scope.show = true;
            canedit = false;
        }
    }
    /*平面多边形面积*/
    function PlanarPolygonAreaMeters2(points) {
        var a = 0;
        for (var i = 0; i < points.length; ++i) {
            var j = (i + 1) % points.length;
            var xi = points[i][0] * metersPerDegree * Math.cos(points[i][1] * radiansPerDegree);
            var yi = points[i][1] * metersPerDegree;
            var xj = points[j][0] * metersPerDegree * Math.cos(points[j][1] * radiansPerDegree);
            var yj = points[j][1] * metersPerDegree;
            a += xi * yj - xj * yi;
        }
        return Math.abs(a / 2);
    }


    function drawPolygonaa(ax, ay, awidth, aheight, title, numb, i) {
        var hasChange = false;
        var di = i;
        var polygon = new BMap.Polygon([
            new BMap.Point(ax - awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay + aheight),
            new BMap.Point(ax + awidth, ay - aheight),
            new BMap.Point(ax - awidth, ay - aheight)
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});

        var point = new BMap.Point(ax, ay);
        map.centerAndZoom(point, per);
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        var label = new BMap.Label(title + '<br>定点数:' + numb, {offset: new BMap.Size(-20, -30)});
        marker.setLabel(label);
        map.addOverlay(polygon);
        shangquanMap[i] = polygon;
        polygon.addEventListener('mousedown', function (e) {
            console.log('cccc');
            //  if (e.domEvent.button == 2) {
            if (!canedit || haschange) {
                // var txt=  "请保存或取消绘范围后编辑";
                // window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
                return false;
            }

            index = di;
            $('.bel,.del').remove();
            //准备搞界面
            var $bel = $('<span class="bel">编辑<br/>投放</span>');
            var $del = $('<span class="del">解除<br/>商圈</span>');
            $bel.on('click', function () {
                $scope.selecttable1i = index;
                $scope.navi = 3;
                var data = $scope.table1[$scope.selecttable1i];
                var data1 = shangquan[$scope.selecttable1i];
                $scope.table4 = {
                    "circle_id": data1.id,
                    "obj": "circle",
                    "act": "update",
                    "top_left": {
                        "latitude": data1.y + data1.height,
                        "longitude": data1.x - data1.width
                    },
                    "low_right": {
                        "latitude": data1.y - data1.height,
                        "longitude": data1.x + data1.width
                    },
                    "name": data.name,
                    "area": data1.width * 220 * data1.height * 1111,
                    "density": data.numb,
                    "pre": data.pre
                }
                $scope.$apply();
                $bel.remove();
                $del.remove();
                return false;
            });
            $del.on('click', function () {
                lastPolygon && lastPolygon.disableEditing();
                map.removeOverlay(lastPolygon);
                lastPolygon = null;
                map.removeOverlay(marker);
                move = false;
                haspolygon = false;
                shangquan.splice(di, 1);
                $scope.pdata = shangquan[$scope.selecttable1i].id;
                $scope.passtate = '移除商圈';
                console.log('解除商圈id$scope.removeid=' + $scope.removeid);
                navi = 5;
                $scope.$apply();
            });


            $(marker.Zc).after($bel);
            $(marker.Zc).after($del);

            //生成编辑

            lastPolygon && lastPolygon.disableEditing();
            lastPolygon = polygon;
            setTimeout(function () {

                lastPolygon.enableEditing();
                $('.BMap_vectex.BMap_vectex_nodeT').remove();
            }, 0);
            ox = ax;
            oy = ay;
            width = awidth;
            height = aheight;
            move = false;
            haspolygon = true;
            down = false;
            //    }
        });

    }

    function huanyuan() {
        map.clearOverlays();
        for (var i = 0; i < shangquan.length; i++) {
            drawPolygonaa(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].numb, i);
        }
    }

    setTimeout(function () {
        initmap();
        initmap2();
    }, 0);
    function initmap() {
        //搜索城市
        $('#search1').on('click', function () {
            var city = document.getElementById("key1").value;
            if (city != "") {
                map.centerAndZoom(city, per);      // 用城市名设置地图中心点
            }
        });

        // 百度地图API功能
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(ox, oy), per);
        map.enableScrollWheelZoom();

        //drawPolygon(ox,oy,width,height)


        //画last
        function drawPolygon(ax, ay, awidth, aheight) {
            lastPolygon && map.removeOverlay(lastPolygon);
            ox = ax;
            oy = ay;
            width = awidth;
            height = aheight;
            lastPolygon = new BMap.Polygon([
                new BMap.Point(ox - width, oy + height),
                new BMap.Point(ox + width, oy + height),
                new BMap.Point(ox + width, oy - height),
                new BMap.Point(ox - width, oy - height)
            ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});
            lastPolygon.addEventListener('mousedown', function () {
                console.log(haschange)
                if (haschange) {
                    return;
                }
                $scope.$apply(function () {
                    $scope.drwname = "取消绘图";
                });
                setTimeout(function () {
                    lastPolygon.enableEditing();
                }, 0);
            })
            map.addOverlay(lastPolygon);
            listnode();
        }


        map.addEventListener("mousemove", function (e) {
            if (move && haspolygon) {
                var x = e.point.lng, y = e.point.lat;
                drawPolygon(x, y, width, height);
            }
        });
        map.addEventListener("mouseup", function (e) {
            if (e.domEvent.button == 0) {
                setTimeout(function () {
                    if (haspolygon && down && !move) {
                        var x1 = e.point.lng, y1 = e.point.lat, x2, y2;
                        if (x1 > ox && y1 > oy) {
                            x2 = ox - width;
                            y2 = oy - height;
                        } else if (x1 < ox && y1 > oy) {
                            x2 = ox + width;
                            y2 = oy - height;
                        } else if (x1 < ox && y1 < oy) {
                            x2 = ox + width;
                            y2 = oy + height;
                        } else if (x1 > ox && y1 < oy) {
                            x2 = ox - width;
                            y2 = oy + height;
                        }
                        ox = (x1 + x2) / 2;
                        oy = (y1 + y2) / 2;
                        width = (x1 - x2) / 2;
                        height = (y1 - y2) / 2;
                        if (width < 0) {
                            width = -width;
                        }
                        if (height < 0) {
                            height = -height;
                        }
                        drawPolygon(ox, oy, width, height);
                        lastPolygon.enableEditing();
                        $('.BMap_vectex.BMap_vectex_nodeT').remove();
                        down = false;
                    }
                }, 10);
            }

        });

        map.addEventListener("mousedown", function (e) {
            //  if (e.domEvent.button == 2) {
            move = false;
            down = false
            $('.BMap_vectex.BMap_vectex_nodeT').remove();
            listnode();
            if (!haschange) {
                lastPolygon && lastPolygon.disableEditing();
            }

            //  }
        });


        function listnode() {
            setTimeout(function () {
                $('.BMap_vectex.BMap_vectex_node').on('click', function () {
                    $scope.$apply(function () {
                        $scope.show = true;
                        $scope.drwname = "取消绘图";
                    });
                    down = true;
                    haschange = true;
                    console.log(haschange);
                });
            }, 0)
        }
    }


    // //删除编辑图案
    // function clearlast() {
    //     map.removeOverlay(lastPolygon);
    //     haspolygon = false;
    //     up = false;
    //     $scope.$apply(function () {
    //         $scope.show = false;
    //     })
    // }
    function initmap2() {
        var mylabel, tou = false;
        // 百度地图API功能
        var map2 = new BMap.Map("allmap2");
        map2.centerAndZoom(new BMap.Point(119.314436, 26.057599), per);
        map2.enableScrollWheelZoom();

        polygon = new BMap.Polygon([
            new BMap.Point(119.294436, 26.057599),
            new BMap.Point(119.344436, 26.057599),
            new BMap.Point(119.344436, 26.027599),
            new BMap.Point(119.294436, 26.027599)
        ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});


        map2.addOverlay(polygon);   //增加多边形

        $('#search2').on('click', function () {
            var city = document.getElementById("key2").value;
            if (city != "") {
                map2.centerAndZoom(city, per);      // 用城市名设置地图中心点
            }
        });

        polygon.hide();

        //画商圈
        for (var i = 0; i < shangquan.length; i++) {
            drawPolygonaa(shangquan[i].x, shangquan[i].y, shangquan[i].width, shangquan[i].height, shangquan[i].title, shangquan[i].numb, i);
        }
        function drawPolygonaa(ax, ay, awidth, aheight, title, numb, i) {
            var polygon = new BMap.Polygon([
                new BMap.Point(ax - awidth, ay + aheight),
                new BMap.Point(ax + awidth, ay + aheight),
                new BMap.Point(ax + awidth, ay - aheight),
                new BMap.Point(ax - awidth, ay - aheight)
            ], {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5});

            var point = new BMap.Point(ax - awidth, ay + aheight);
            var label = new BMap.Label(title + '<br>定点数:' + numb, {offset: new BMap.Size(0, -37), position: point});

            map2.addOverlay(label);
            map2.addOverlay(polygon);

            polygon.addEventListener('mousedown', function (e) {
                $(polygon.V).css('cursor', 'pointer')

                var $bel = $('<span class="sel">投放<br/>碎片</span>');
                $bel.on('mousedown', function (e) {
                    if (e.button == 0) {
                        // var txt=  "是否投放改碎片";
                        // window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{
                        //     onOk:function(v) {
                        //
                        //         return false;
                        //     }
                        // });
                        if ($(this))
                            $(this).addClass('zuobia');
                    }
                    $bel.remove();
                    $del.remove();
                });
                var point = new BMap.Point(ax, ay - aheight);
                var label1 = new BMap.Label('投放<br/>碎片', {offset: new BMap.Size(-40, 0), position: point});
                var label2 = new BMap.Label('取消<br/>投放', {offset: new BMap.Size(0, 0), position: point});
                map2.addOverlay(label1);
                map2.addOverlay(label2);
                label1.setStyle({
                    width: "40px",
                    height: "40px",
                    verticalAlign: " middle",
                    fontSize: "12px",
                    textAlign: "center",
                    background: "#fff",
                    border: "1px solid #9BC4F7",
                    borderRadius: "1000px",
                    paddingTop: "3px"
                });
                label2.setStyle({
                    width: "40px",
                    height: "40px",
                    verticalAlign: " middle",
                    fontSize: "12px",
                    textAlign: "center",
                    background: "#fff",
                    border: "1px solid #9BC4F7",
                    borderRadius: "1000px",
                    paddingTop: "3px"
                });


                label2.addEventListener('click', function () {
                    map2.removeOverlay(label1);
                    map2.removeOverlay(label2);
                });
                label1.addEventListener('click', function () {
                    $(polygon.V).css('cursor', 'help')
                    map2.removeOverlay(label1);
                    map2.removeOverlay(label2);
                    tou = true;
                });
                if (tou) {
                    var txt = "是否投放改碎片";
                    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
                        onOk: function (v) {
                            map2.removeOverlay(label1);
                            map2.removeOverlay(label2);
                            tou = false;
                        },
                        onCancel: function () {
                            map2.removeOverlay(label1);
                            map2.removeOverlay(label2);
                            tou = false;
                        }
                    });
                }

            });
        }


    }

    //是否投放改碎片
    function istoufan() {

    }

});




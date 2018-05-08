function loadWish(pno) {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebPay = new NebPay();
    var dappAddress = "n1zt97HD7KXe2VWpJjNYgpkZjtB4aM7NKo1";
    var txHash = "01fb0f272427f6f7cd1e494920fe59fbe5e82b6aed3d4ed41243e29cadfb8de9";

    //Load Wishes
    var to = dappAddress;
    var value = "0";
    /*
var callFunction = "len";
var callArgs = "";
nebPay.simulateCall(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            callback: cbPush
        });
*/

    var totalSize = 0;
    var pageSize = 10;
    var totalPage = 0;

    var callFunction = "len";
    var callArgs = "[]";
    nebPay.simulateCall(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: function(resp) {
            console.log(JSON.stringify(resp.result));
            totalSize = Number(resp.result);

            if (totalSize / pageSize > parseInt(totalSize / pageSize)) {
                totalPage = parseInt(totalSize / pageSize) + 1;
            } else {
                totalPage = parseInt(totalSize / pageSize);
            }

            var currentPage = pno; //当前页数
            var tempStr = "";
tempStr += "共" + totalPage + "页";
tempStr += "<ul class='pagination'>";
            if (currentPage > 1) {
                tempStr += "<li> <a href='javascript:void(0);' onclick='loadWish(" + 1 + ")'>首页</a></li>";
                tempStr += "<li> <a href='javascript:void(0);' onclick='loadWish(" + (currentPage - 1) + ")'>上一页</a></li>";
            } else {
                tempStr += "<li><a href='javascript:void(0);'>首页</a></li>";
                tempStr += "<li><a href='javascript:void(0);'>上一页</a></li>";
            }
var leftPage = currentPage - 5; 
var rightPage = currentPage + 5;
if(leftPage < 0){
leftPage = 1;
}
if(rightPage > totalPage){
rightPage = totalPage;
}

            for (var pageIndex = leftPage; pageIndex < rightPage + 1; pageIndex++) {
if(pageIndex == currentPage){
tempStr += "<li> <a class='active' href='javascript:void(0);' onclick='loadWish(" + pageIndex + ")'>"+pageIndex+"</a></li>";
}else{
tempStr += "<li> <a href='javascript:void(0);' onclick='loadWish(" + pageIndex + ")'>"+pageIndex+"</a></li>";
}
            }

            if (currentPage < totalPage) {
                tempStr += "<li> <a href='javascript:void(0);' onclick='loadWish(" + (currentPage + 1) + ")'>下一页</a></li>";
                tempStr += "<li> <a href='javascript:void(0);' onclick='loadWish(" + (totalPage) + ")'>尾页</a></li>";
            } else {
                tempStr += "<li><a href='javascript:void(0);'>下一页</a></li>";
                tempStr += "<li><a href='javascript:void(0);'>尾页</a></li>";
            }
tempStr += "</ul>";
console.log(tempStr);

            document.getElementById("barcon").innerHTML = tempStr;
            var limit = pageSize;
            var offset = (currentPage - 1) * pageSize;

            var callFunction = "forEach";
            var callArgs = "[\"" + pageSize + "\",\"" + offset + "\"]";
            nebPay.simulateCall(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
                listener: cbPush
            });

        }
    });

    //Load Wishes
}

function saveWish() {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebPay = new NebPay();
    var dappAddress = "n1zt97HD7KXe2VWpJjNYgpkZjtB4aM7NKo1";
    var txHash = "01fb0f272427f6f7cd1e494920fe59fbe5e82b6aed3d4ed41243e29cadfb8de9";

    var name = $('#username').val();
    var wish = $('#content').val();

    to = dappAddress;
    value = "0";
    callFunction = "save";
    callArgs = "[\"" + name + "\",\"" + wish + "\"]";

    nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的call接口去调用合约,
        listener: saveWishResult
    });
    //Load Wishes
}

function saveWishResult(resp) {
    console.log(JSON.stringify(resp));
}

function cbPush(resp) {
    var wishes = JSON.parse(resp.result);
    var wishDiv = "";
    for (var i = 0; i < wishes.length; i++) {
        if (i % 5 == 0) {
            wishDiv += "<dl class='paper a1'>";
        } else if (i % 5 == 1) {
            wishDiv += "<dl class='paper a2'>";
        } else if (i % 5 == 2) {
            wishDiv += "<dl class='paper a3'>";
        } else if (i % 5 == 3) {
            wishDiv += "<dl class='paper a4'>";
        } else if (i % 5 == 4) {
            wishDiv += "<dl class='paper a5'>";
        }

        wishDiv += "<dt>";
        wishDiv += "<span class='username'>" + wishes[i].name + "</span>";
        wishDiv += "<span class='author'>" + "" + "</span>";
        wishDiv += "</dt>";
        wishDiv += "<dd class='content'>" + wishes[i].wish + "</dd>";
        wishDiv += "<dd class='bottom'>";
        wishDiv += "<span class='time'>" + wishes[i].author + "</span>";
        wishDiv += "<a href='' class=''></a>";
        wishDiv += "</dd>";
        wishDiv += "</dl>";
    }

    $('#main')[0].innerHTML = wishDiv;

    var paper = $('.paper');
    var FW = $(window).width();
    var FH = $('#main').height();
    for (var i = 0; i < paper.length; i++) {
        var obj = paper.eq(i);
        obj.css({
            left: parseInt(Math.random() * (FW - obj.width())) + 'px',
            top: parseInt(Math.random() * (FH - obj.height() - 50)) + 'px'
        });
        drag(obj, $('dt', obj));
    }

    paper.click(function() {
        $(this).css('z-index', 1).siblings().css('z-index', 0);
    });

}

function validate(){
var name = $('#username').val();
    var wish = $('#content').val();
if(name == ""){
alert("名称不能为空。");
return false;
}
if(wish == ""){
alert("愿望不能为空。");
return false;
}
}

$(function() {

    $('#main').height($(window).height() - $('#top').height() - 45);

    $('.close').click(function() {
        $(this).parents('dl').fadeOut('slow');
        return false;
    });

    loadWish(1);

    $('#send-btn').click(function() {
if(validate() == false)
return;

        saveWish();

        $('#send-form').fadeOut('slow',
        function() {
            $('#windowBG').remove();
        });

        return false;
    });

    $('#top').click(function() {
        $('<div id="windowBG"></div>').css({
            width: $(document).width(),
            height: $(document).height(),
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 998,
            opacity: 0.3,
            filter: 'Alpha(Opacity = 30)',
            backgroundColor: '#000000'
        }).appendTo('body');

        var obj = $('#send-form');
        obj.css({
            left: ($(window).width() - obj.width()) / 2,
            top: $(document).scrollTop() + ($(window).height() - obj.height()) / 2
        }).fadeIn();
    });

    $('#close').click(function() {
        $('#send-form').fadeOut('slow',
        function() {
            $('#windowBG').remove();
        });
        return false;
    });

    $('textarea[name=content]').keyup(function() {
        var content = $(this).val();
        var lengths = check(content); //调用check函数取得当前字数
        //最大允许输入50个字
        if (lengths[0] >= 50) {
            $(this).val(content.substring(0, Math.ceil(lengths[1])));
        }

        var num = 50 - Math.ceil(lengths[0]);
        var msg = num < 0 ? 0 : num;
        //当前字数同步到显示提示
        $('#font-num').html(msg);
    });

    $('#phiz img').click(function() {
        var phiz = '[' + $(this).attr('alt') + ']';
        var obj = $('textarea[name=content]');
        obj.val(obj.val() + phiz);
    });

});

/**
* 元素拖拽
* @param  obj 拖拽的对象
* @param  element 触发拖拽的对象
*/
function drag(obj, element) {
    var DX, DY, moving;

    element.mousedown(function(event) {
        obj.css({
            zIndex: 1,
            opacity: 0.5,
            filter: 'Alpha(Opacity = 50)'
        });

        DX = event.pageX - parseInt(obj.css('left')); //鼠标距离事件源宽度
        DY = event.pageY - parseInt(obj.css('top')); //鼠标距离事件源高度
        moving = true; //记录拖拽状态
    });

    $(document).mousemove(function(event) {
        if (!moving) return;

        var OX = event.pageX,
        OY = event.pageY; //移动时鼠标当前 X、Y 位置
        var OW = obj.outerWidth(),
        OH = obj.outerHeight(); //拖拽对象宽、高
        var DW = $(window).width(),
        DH = $(window).height(); //页面宽、高
        var left, top; //计算定位宽、高
        left = OX - DX < 0 ? 0 : OX - DX > DW - OW ? DW - OW: OX - DX;
        top = OY - DY < 0 ? 0 : OY - DY > DH - OH ? DH - OH: OY - DY;

        obj.css({
            'left': left + 'px',
            'top': top + 'px'
        });

    }).mouseup(function() {
        moving = false; //鼠标抬起消取拖拽状态
        obj.css({
            opacity: 1,
            filter: 'Alpha(Opacity = 100)'
        });

    });

}

/**
 * 统计字数
 * @param  字符串
 * @return 数组[当前字数, 最大字数]
 */
function check(str) {
    var num = [0, 50];
    for (var i = 0; i < str.length; i++) {
        //字符串不是中文时
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
            num[0] = num[0] + 0.5; //当前字数增加0.5个
            num[1] = num[1] + 0.5; //最大输入字数增加0.5个
        } else { //字符串是中文时
            num[0]++; //当前字数增加1个
        }
    }
    return num;
}


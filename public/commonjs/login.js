/**
 * Created by z on 2017/7/28.
 */
$(function () {
    $(".submit").on("click",function () {
        $(".alert").hide();
        var name = $("input[name = username]").val();
        var pwd = $("input[name = pwd]").val();
        var check = $("input[name = check]:checked").val();
        if(name == ""){
            $(".alert").show().html("请输入用户名");
            return;
        }
        if(pwd == ""){
            $(".alert").show().html("请输入密码");
            return;
        }
        $.ajax({
            url:"/login",
            type:"get",
            data:{"ajax":true,"username":name,"password":pwd,"check":check},
            success:function (data) {
                if(data.result == 0){
                    $(".alert").show().html(data.text);
                }else{
                    window.location.href = "/";
                }
            },
            error:function () {
                alert("错误");
            }
        })
    })
})
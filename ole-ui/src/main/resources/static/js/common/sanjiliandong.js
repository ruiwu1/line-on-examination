$(function () {
        var html = "";
        $("#input_city").append(html); $("#input_area").append(html);
        $.each(pdata,function(idx,item){
            if (parseInt(item.level) == 0) {
                html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
            }
        });
        $("#input_province").append(html);
        $("#input_province").change(function(){
            if ($(this).val() == "") return;
            $("#input_city option").remove(); $("#input_area option").remove();
            var code = $(this).find("option:selected").attr("exid"); code = code.substring(0,2);
            var html = "<option value=''>--请选择--</option>"; $("#input_area").append(html);
            $.each(pdata,function(idx,item){
                if (parseInt(item.level) == 1 && code == item.code.substring(0,2)) {
                    html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
                }
            });
            $("#input_city").append(html);
        });
        $("#input_city").change(function(){
            if ($(this).val() == "") return;
            $("#input_area option").remove();
            var code = $(this).find("option:selected").attr("exid"); code = code.substring(0,4);
            var html = "<option value=''>--请选择--</option>";
            $.each(pdata,function(idx,item){
                if (parseInt(item.level) == 2 && code == item.code.substring(0,4)) {
                    html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
                }
            });
            $("#input_area").append(html);
        });
});
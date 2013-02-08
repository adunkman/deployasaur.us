(function() {
    function submit() {
        $("form#deploy_form").submit();

        return false;
    }

    function initialize() {
        if ($.client.os == "Mac") {
            $("*").bind("keydown", "meta+s", submit);
        } else {
            $("*").bind("keydown", "ctrl+s", submit);
        }
    }

    $(document).ready(function() {
        if($("body").hasClass("deploy-create") || $("body").hasClass("deploy-edit"))
            initialize();
    });
}());
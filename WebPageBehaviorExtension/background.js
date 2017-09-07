chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.cookies.get({url: "https://webpagebehaviorlogging.herokuapp.com", name: "userName"}, function(cookie) {
        var userName = cookie.value
        console.log("User Name: " + userName);

        var receviedAction = request.action;
        var receivedAdditionalInfo = request.addition_info;
        console.log("Action Received: " + receviedAction);
        makeAjaxCall(userName, receviedAction, receivedAdditionalInfo);
    });
    return true;
});


function makeAjaxCall(userName, receviedAction, receivedAdditionalInfo){
    if(userName != undefined && userName != null && receviedAction != undefined && receviedAction != null){
        var date = new Date();
        var dateStr = date.toString();
        $.ajax({
            url: "https://webpagebehaviorlogging.herokuapp.com/updateAction",
            type: "POST",
            data: {
                user_name: userName,
                action:receviedAction,
                action_time:dateStr,
                additional_info:receivedAdditionalInfo,
            },
            success: function(xhr){
                console.log("AJAX success");
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }
}
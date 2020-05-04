if( window.WebSocket ){
    //---------------------------------
    //  Variables
    //---------------------------------
    socket = null;
    var reconnectIntervalMs = 10000;
    var apiAvatarEndPoint = "https://decapi.me/twitch/avatar/"

    function Connect() {
        socket = new WebSocket(API_Socket);

        socket.onopen = function()
        {
            // Format your Authentication Information
            var auth = {
                author: "IsaacRF239",
                website: "https://isaacrf.com",
                api_key: API_Key,
                events: [
                    "EVENT_SMM2QS_LEVEL_UPDATE",
                ]
            }
            //Send your Data to the server
            socket.send(JSON.stringify(auth));
        };

        socket.onerror = function(error)
        {
            console.log("Error: " + error);
        }

        socket.onmessage = function (message)
        {
            var jsonObject = JSON.parse(message.data);

            if(jsonObject.event == "EVENT_SMM2QS_LEVEL_UPDATE")
            {
                //UI Update
                var data = JSON.parse(jsonObject.data);
                if (data.currentLevelCode != "") {
                    $("#current-level .userName").text(data.currentLevelUser);
                    $("#current-level .levelCode").text(data.currentLevelCode);
                    $("#current-level").removeClass('empty');
                } else {
                    $("#current-level").addClass('empty');
                }

                if (data.nextLevelCode != "") {
                    $("#next-level .userName").text(data.nextLevelUser);
                    $("#next-level .levelCode").text(data.nextLevelCode);
                    $("#next-level").removeClass('empty');
                } else {
                    $("#next-level").addClass('empty');
                }

                if (data.currentLevelCode != "" && data.nextLevelCode == "") {
                    $("#container").addClass('empty');
                } else {
                    $("#container").removeClass('empty');
                }

                $("#wins").text(data.wins);
                $("#skips").text(data.skips);

                if (data.currentLevelUser != "") {
                    $.get(apiAvatarEndPoint + data.currentLevelUser, function(response) {
                        $( "#current-level .userAvatar" ).attr('src', response);
                    });
                }

                if (data.nextLevelUser != "") {
                    $.get(apiAvatarEndPoint + data.nextLevelUser, function(response) {
                        $( "#next-level .userAvatar" ).attr('src', response);
                    });
                }
            }
        }

        socket.onclose = function ()
        {
            //  Connection has been closed by you or the server
            console.log("Connection Closed!");
            setTimeout(Connect, reconnectIntervalMs);
        }
    }

    Connect();
}
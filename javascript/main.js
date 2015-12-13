/* CURRENTLY IN: javascript/main.js */

(function() {
    /*
    activity	The activity scope includes activity data and exercise log related features, such as steps, distance, calories burned, and active minutes
    heartrate	The heartrate scope includes the continuous heart rate data and related analysis
    location	The location scope includes the GPS and other location data
    nutrition	The nutrition scope includes calorie consumption and nutrition related features, such as food/water logging, goals, and plans
    profile	The profile scope is the basic user information
    settings	The settings scope includes user account and device settings, such as alarms
    sleep	The sleep scope includes sleep logs and related sleep analysis
    social	The social scope includes friend-related features, such as friend list, invitations, and leaderboard
    weight	The weight scope includes weight and related information, such as body mass index, body fat percentage, and goals
    */

    // application can be permissioned to these scopes / permission.
    // once the scope is set, FitBit persists it and  can only be changed by change the scopes
    // eg. first run only used profile, now all users to this app can only share their profile.
    // if you want to get activity + profile, you must rekick off the app with both scopes
    // 
    var scopes = [
        'activity',
        'heartrate',
        'location',
        'nutrition',
        'profile',
        'settings',
        'sleep',
        'social',
        'weight'
    ];

    var auth = {
        client_key: 'b24a80679bb144fb3744355a405d89e6',
        client_id: '229X2L',
        client_secret: '79c2236825b44d21773a0fa6300d73d5',
        OAuthUri: 'https://www.fitbit.com/oauth2/authorize',
        OAuthTokenUri: 'https://api.fitbit.com/oauth2/token',
        redirect_uri: 'http%3A%2F%2Flocalhost%3A3000%2Findex.html' // <-- (THIS IS CALLED URL ENCODING) which equals https://localhost:3000 
    };

    var convertDayToMilliSeconds = function(days) {

        return days * 1000 * 60 * 60 * 24;

    }
    var buildURL = function(expiredDays) {

        var url = auth.OAuthUri + '?';

        url += 'response_type=token&'
        url += 'client_id=' + auth.client_id + '&'
        url += 'redirect_uri=' + auth.redirect_uri + '&'
        url += 'expires_in=' + convertDayToMilliSeconds(expiredDays) + '&'
        url += 'prompt=login' + '&'
            // url += 'scope=' + scopes[4] + '&'
            // adding all the scopes
        for (var i = 0; i < scopes.length; i++) {
            if (i === 0) {
                url += 'scope=' + scopes[i] + '%20';
            } else if (i !== scopes.length - 1) {
                url += scopes[i] + '%20';
            } else {
                url += scopes[i];
            }
        }

        return url;
    }

    var access_token;
    var user_id;

    
    function test() {
        // Check to see if this page is loaded in the popup we created
        if (window.opener != null && !window.opener.closed) {
            // Copy the hash (which includes the access token) received from the
            //    OAuth process to the main window for parsing and close the popup
            opener.location.hash = window.location.hash;
            window.close();
        } else {
            // Event listener for a hash change in the URI
            $(window).on('hashchange', function() {
                // If the URI hash changed and it's not empty ...
                if (window.location.hash != '') {
                    var string = window.location.hash.substr(1);
                    var query = string.split('&');
                    var param;
                    // Parse the URI hash to fetch the access token
                    for (var i = 0; i < query.length; i++) {
                        param = query[i].split('=');
                        if (param[0] == 'access_token') {
                            access_token = param[1];


                        } else if (param[0] === 'user_id') {
                            user_id = param[1];
                        }
                    }
                    // We now have the access token
                    if (access_token !== undefined) {
                        connectToFitBit();
                    }
                }
            });
        }
    };
    test();

    // need to figure out callback pattern to make this code cleaner
    // 

    $('.js-submit').on('click', function() {
        var conn = buildURL(1);

        var dialog = window.open(conn, 'oauth', 'height=560,width=1080');

    });


    function connectToFitBit() {

        var getProfile = 'https://api.fitbit.com/1/user/-/profile.json';

        superagent.get(getProfile)
            .set('Authorization', 'Bearer ' + access_token)
            .end(function(e, res) {

                console.log('what is res', res);
            })

    }


})()

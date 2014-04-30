$.getJSON("/access/login/user", function(jsonData, status, request)
{
  var accessControlLink = $("a.access_control_link");

  if (jsonData.loggedIn && (jsonData.loggedIn == true))
  {
    $("span.user_full_name").text(jsonData.fullName);
    accessControlLink.text("Log Out");
    accessControlLink.attr("title", "See only public data.");
    accessControlLink.attr("href", "/access/logout?target="
        + encodeURI(window.location.pathname));
  }
  else
  {
    // Don't alert them if they're just not logged in.
    if (jsonData.errorMessage && (jsonData.errorCode != 401))
    {
      alert(jsonData.errorMessage);
    }

    accessControlLink.text("Login");
    accessControlLink.attr("href", "/canfar/login.html?target="
        + encodeURI(window.location.pathname));
    accessControlLink.attr("title", "See more data that you have access to.");
  }
}).error(function(request, status, message)
         {
           if (message && ($.trim(message) != ""))
           {
             var accessControlLink = $("a.access_control_link");

             accessControlLink.text("Login");
             accessControlLink.attr("href", "/canfar/login.html?target="
                 + encodeURI(window.location.pathname));
             accessControlLink.attr("title",
                                    "See more data that you have access to.");
             alert("Unable to obtain user information.\n\nMessage: "
                   + message);
           }
         });

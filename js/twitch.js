var users = ["ESL_SC2", "Monstercat", "stefl1504", "malukah", "Viliciousness", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var URLendpoint = "https://wind-bow.gomix.me/twitch-api";
var counter = 0;

function makeURL(type, name) {
	return URLendpoint + "/" + type + "/" + name + "?callback=?";
}

function showUsers(user, display_name, logo, url, views, followers, game, streamStat, ol_status) {
	var html;

	html = "" + 
		"<div id='" + user.toLowerCase() + "' class='user " + (ol_status === "Online" ? "online-usr" : "offline-usr") + "'>" +
			"<a href='" + url + "' target='_blank'>" +
				"<div class='disp_name'>" + display_name + "</div>" +
				"<figure>" +
					"<img src='" + logo + "'>" +
					"<figcaption>" + game + "<br><br>" + streamStat + "</figcaption>" +
				"</figure>" +
				"<div class='" + (ol_status === "Online" ? "online'>" : "offline'>") + ol_status + "</div>" +
			"</a>" +
		"</div>";

	$("#users").append(html);
}

function getUsers() {
	users.forEach(function(user) {
		addUser(user);
	});
}

function addUser(user) {
	$.getJSON(makeURL("channels", user), function(channel) {
		 // console.log(channel);
		if (channel.error !== "Not Found") {
			// checking users online status
			$.getJSON(makeURL("streams", user), function(stream) {
				var display_name, logo, url, views, followers, ol_status, game, streamStat;	

				display_name = channel.display_name !== null ? channel.display_name : user;
				logo = channel.logo !== null ? channel.logo : "http://via.placeholder.com/300x300";
				url = channel.url !== null ? channel.url : "#";
				views = channel.views !== null ? channel.views : "";
				followers = channel.followers !== null ? channel.followers : "";

				// console.log(stream);
				if (stream.stream !== null) {
					ol_status = "Online";
					game = stream.stream.game !== null ? stream.stream.game : "";
					streamStat = stream.stream.channel.status !== null ? stream.stream.channel.status : "";
				} else {
					ol_status = "Offline";
					game = "Offline";
					streamStat = "";
				}

				// console.log(user + ", " + display_name + ", " + logo + ", " + game + ", " + streamStat);
				showUsers(user, display_name, logo, url, views, followers, game, streamStat, ol_status);
				counter += 1;
				if (counter > 12) {
					$.scrollTo("#" + $("#search-user").val().toLowerCase(), 800);
				}
			});
		}
	});
}

function setActive(event) {
	// console.log($(this).hasClass("active"));
	// console.log($(event.target).hasClass("active"));
	$(".all-opt, .online-opt, .offline-opt").removeClass("active");
	$(this).addClass("active");

	$(".online-usr, .offline-usr").css("display", "");
	if ($(event.target).hasClass("online-opt")) {
		$(".offline-usr").css("display", "none");
	} else if ($(event.target).hasClass("offline-opt")) {
		$(".online-usr").css("display", "none");
	}
}

$(".all-opt, .online-opt, .offline-opt").click(setActive);
// $(".online-opt").click(setActive);

$("#search-user").keydown(function(event) {
	if (event.keyCode === 13) {
		$("#search-btn").click();
	}
});

$("#search-btn").click(function() {
	// if (document.getElementById($("#search-user").val().toLowerCase())) {
	if ($("#"+$("#search-user").val().toLowerCase()).length) {
		$.scrollTo("#" + $("#search-user").val().toLowerCase(), 800);
	} else {
		addUser($("#search-user").val().toLowerCase());
	}
});

$(document).ready(function() {
	getUsers();
});



$(document).ready(function () {
    // Load the correct page
    move();

    $(".sidebar-nav a").click(function () {
        // Ajax load new page
        id = $(this).attr("id");
        page = id.concat(".html");
        $("#content").load(page);
        // Mark which page is active on the sidebar
        $(".sidebar-nav a").removeClass("picked");
        $(this).addClass("picked");
        // Store current scroll position so we don't get jumping behaviour
        var yScroll = $(window).scrollTop();
        window.location.hash = id;
        $(window).scrollTop(yScroll);
    });

    // So we have the clicky hand for the side menu bar tabs
    $(".sidebar-nav a").mouseover(function () {
        $(this).css("cursor", "pointer");
    });

    // So we have the clicky hand for the lecture collapsables
    $("body").on("mouseover", ".panel-title a", function () {
        $(this).css("cursor", "pointer");
    });

    // Make it a clicky mouse when we hover over the profiles
    $("body").on("mouseover", ".profiles img", function () {
        $(this).css('cursor', 'pointer');
    });

    $("body").on("click", ".profiles img", function () {
        var person = $(this).attr("id");
        var addr = "";
        switch (person) {
            case "ryan":
                addr = "http://www.seas.harvard.edu/directory/rpa";
                break;
            case "wray":
                addr = "http://infotech.monash.edu.au/research/profiles/profile.html?sid=6245956&pid=10352";
                break;
            case "bob":
                addr = "http://stat.columbia.edu/department-directory/name/bob-carpenter/";
                break;
            case "justin":
                addr = "http://users.cecs.anu.edu.au/~jdomke/";
                break;
            case "stephen":
                addr = "http://people.cecs.anu.edu.au/user/4271";
                break;
            case "alex_i":
                addr = "http://www.ics.uci.edu/~ihler/";
                break;
            case "mark_j":
                addr = "http://web.science.mq.edu.au/~mjohnson/";
                break;
            case "alex_k":
                addr = "http://www.ci.tuwien.ac.at/~alexis/About.html";
                break;
            case "neil":
                addr = "http://staffwww.dcs.shef.ac.uk/people/N.Lawrence/";
                break;
            case "frank":
                addr = "http://www.lix.polytechnique.fr/~nielsen/";
                break;
            case "richard":
                addr = "http://scholar.google.fr/citations?user=0J2s3YQAAAAJ&hl=fr&oi=ao";
                break;
            case "lizhen":
                addr = "http://people.cecs.anu.edu.au/user/5311";
                break;
            case "mark_r":
                addr = "http://people.cecs.anu.edu.au/user/2675";
                break;
            case "mark_s":
                addr = "http://www.cs.ubc.ca/~schmidtm/";
                break;
            case "chris":
                addr = "http://people.cecs.anu.edu.au/user/145";
                break;
        }
        window.open(addr);
    });

    // Make it obvious when the collapsables are open and closed
    $("body").on("click", "h4.panel-title a", function () {
        $(this).find(".glyphicon").toggleClass("glyphicon-menu-right");
        $(this).find(".glyphicon").toggleClass("glyphicon-menu-down");
    });

    $(window).on("hashchange", move);
});

function move() {
    // Get the sub page we want to load
    var id = location.hash;
    var id_with_hash = id;
    if (id) {
        // Remove the hash prefix
        id = id.substr(1);
        var page = id.concat(".html");
        $("#content").load(page);
    } else {
        // Go to the home page
        id_with_hash = "#home";
        $("#content").load("home.html");
    }

    // Remove the current selected sidebar element
    $(".sidebar-nav a").removeClass("picked");
    // Mark the correct section on the sidebar
    $(id_with_hash).addClass("picked");
}














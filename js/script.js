$(document).ready(function () {
    // Load the correct page
    move();

    $(".sidebar-nav a").click(function () {
        // Ajax load new page
        id = $(this).attr("id");
        if (id !== "photos") {
            var page = id.concat(".html");
        } else {
            var page = id.concat(".php");
        }
        $("#content").load(page);
        // Mark which page is active on the sidebar
        $(".sidebar-nav a").removeClass("picked");
        $(this).addClass("picked");
        // Store current scroll position so we don't get jumping behaviour
        var yScroll = $(window).scrollTop();
        window.location.hash = id;
        $(window).scrollTop(yScroll);
    });

    getClickyMouse(".sidebar-nav a");
    getClickyMouse(".panel-title a");
    getClickyMouse(".profiles img");
    getClickyMouse(".photoview img");

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
        if (id !== "photos") {
            var page = id.concat(".html");
        } else {
            var page = id.concat(".php");
        }
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

function getClickyMouse(element) {
    $("body").on("mouseover", element, function () {
        $(this).css('cursor', 'pointer');
        initPhotoSwipeFromDOM('.mlss-gallery');
    });
}

// Photoviewer stuff
function initPhotoSwipeFromDOM(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                childElements,
                linkEl,
                size,
                item;

        for (var i = 0; i < numNodes; i++) {


            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'DIV');
        });

        if (!clickedListItem) {
            return;
        }


        // find index of clicked item
        var clickedGallery = clickedListItem.parentNode,
                childNodes = clickedListItem.parentNode.childNodes,
                numChildNodes = childNodes.length,
                nodeIndex = 0,
                index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
                params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if (!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
                gallery,
                options,
                items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,
            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                        rect = thumbnail.getBoundingClientRect();

                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            },
            // No history
            history: false,
            focus: false

                    //,
                    //  showHideOpacity:true

        };

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe(hashData.pid - 1, galleryElements[ hashData.gid - 1 ], true);
    }


}
;




















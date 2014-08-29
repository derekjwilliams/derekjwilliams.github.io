window.onload=function() {
    // add ids on the tab pages
    $(".tabpage").each(function (index, element) {
        $(element).attr("id", "tabpage" + index);
    });
    // associate each tab with its cooresponding page
    $("li.tab").each(function (index, element) {
        $(element).data("contentsId", "#tabpage" + index);
    });
    // display the first tab and associated page
    displayPage($(".tab").first());
    
    // add click event handler to the tabs
    $("li.tab").on("click", function() {
        displayPage($(this));
    });
}

function displayPage(tab) {
    var tabpage = $(tab.data("contentsId"));
    $("li.tabActive").removeClass("tabActive");
    tab.addClass("tabActive");
    // $("li.tab").not(tab).removeClass("tabActive");
    $(".tabpage").not(tab.data("contentsId")).hide();
    tabpage.show();
    tab.addClass("tabActive");
    //$(tab.data("contentsId")).load(tabpage.data('content-url'));
    $(tab.data("contentsId") + " iframe").attr("src", tabpage.data('content-url'));
}


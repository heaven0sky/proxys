jQuery(document).ready(function(){
    console.log(window.location.href);

    window.scrollBy(0, Math.random() * 500);
    var links = jQuery('a[href]:not([href^="mailto\\:"], [href$="\\#"])');
    var num = Math.ceil(Math.random() * links.length - 1);
    links[num].click();
});
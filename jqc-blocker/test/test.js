$('.btn').on("click", function (e) {
    alert('ur blocker failed.');
});

var jqcBlocker = null;
$('.block').on("click", function (e) {
    jqcBlocker = new $.jqcBlocker();
    jqcBlocker.show();
});
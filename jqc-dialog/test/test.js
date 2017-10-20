var titile = 'hello world';
var content = '<div>hello world</div><div>hello world</div><div>hello world</div><div>hello world</div><div>hello world</div>';
$('.btn').on('click', function (e) {
    var dialog = new $.jqcDialog({
        title: titile,
        content: content,
        modal: false,
        width: Math.random() * 1000
    });
    dialog.open();
});

$('.modelBtn').on('click', function (e) {
    var dialog = new $.jqcDialog({
        title: titile,
        content: content
    });
    dialog.open();
});
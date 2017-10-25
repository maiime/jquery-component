$('#basic').on('click', function (e) {
    var dialog = new $.jqcDialog({
        title: 'hello world',
        content: '<p><h1>Hello world</h1></p>'
    });
    dialog.open();
});
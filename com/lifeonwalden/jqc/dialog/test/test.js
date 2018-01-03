$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('baseElement')
            .registerComponent('resizeable')
            .registerComponent('lang')
            .registerComponent('dialog')
            .registerComponent('blocker')
            .registerComponent('zindex')
            .registerComponent('draggable'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['dialog']).execute(function () {
            var titile = 'hello world';
            var content = '<div>hello world</div><div>hello world</div><div>hello world</div><div>hello world</div><div>hello world</div>';
            $('.btn').on('click', function (e) {
                var layers = Math.random() * 1000;
                var _content = '';
                for (var i = 0; i < layers; i++) {
                    _content = _content.concat(content);
                }
                var dialog = new $.jqcDialog({
                    title: titile,
                    content: _content,
                    modal: false,
                    width: Math.random() * 1000,
                    position: {
                        top: Math.random() * 100,
                        left: Math.random() * 1000
                    }
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
        });
    });
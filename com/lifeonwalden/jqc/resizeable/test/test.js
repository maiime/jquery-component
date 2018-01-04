$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/version.js')
    .importScript('../../../../../qunit/keycode.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('resizeable'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['resizeable']).execute(function () {
            new $.jqcResizeable({
                dragHandler: $('div'),
                resizeableBox: $('div'),
                minWidth: 800
            });
        });
    });
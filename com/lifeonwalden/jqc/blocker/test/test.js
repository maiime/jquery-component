$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('baseElement')
            .registerComponent('zindex')
            .registerComponent('blocker'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['blocker']).execute(function () {
            $('.btn').on("click", function (e) {
                alert('ur blocker failed.');
            });

            var jqcBlocker = null;
            $('.block').on("click", function (e) {
                jqcBlocker = new $.jqcBlocker();
                jqcBlocker.show();
            });
        });
    });
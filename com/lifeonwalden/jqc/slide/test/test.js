$JqcLoader.importScript('../../../../../qunit/jquery-3.1.1.js')
    .importScript('../../../../../qunit/version.js')
    .importScript('../../../../../qunit/keycode.js')
    .importScript('../../../../../qunit/qunit-2.1.1.js')
    .importCss('../../../../../qunit/qunit-2.1.1.css').execute(function () {
        $JqcLoader.registerModule($JqcLoader.newModule('com.lifeonwalden.jqc', '../../../../../')
            .registerComponent('baseElement')
            .registerComponent('uniqueKey')
            .registerComponent('slide'));

        $JqcLoader.importComponents('com.lifeonwalden.jqc', ['slide']).execute(function () {
            var slide = new $.jqcSlide({
                container: $('.slide'),
                mask: $('.mask'),
                slides: [{
                    type: 'img',
                    url: 'img/nature.jpg'
                }]
            });
        });
    });
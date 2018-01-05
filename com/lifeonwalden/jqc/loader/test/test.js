(function ($) {
    var outer = "Outer space";

    $JqcLoader.importScript('dynamicLoad.js').importCss('dynamicLoad.css').execute(function (param) {
        console.log('local '.concat(new Date()));
        console.log(outer);
        console.log(param.greeting);
        document.getElementsByTagName('p')[0].className = 'pclass';
    }, {
        greeting: 'hello inner'
    });
})(this);
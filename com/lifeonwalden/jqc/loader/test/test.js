(function ($) {
    var outer = "Outer space";

    $JqcLoader.importScript('dynamicLoad.js').importCss('dynamicLoad.css').execute(function () {
        console.log('local '.concat(new Date()));
        console.log(outer);
        document.getElementsByTagName('p')[0].className = 'pclass';
    });
})(this);
new $.jqcSelectBox({
    optionData: [{
        value: 'abc',
        label: 'abc'
    }, {
        value: 'def',
        label: 'edf'
    }, {
        value: 'abd',
        label: 'abd'
    }, {
        value: 'abe',
        label: 'abe'
    }, {
        value: 'abf',
        label: 'abf'
    }, {
        value: 'abfa',
        label: 'abfa'
    }, {
        value: 'abfb',
        label: 'abfb'
    }, {
        value: 'abfc',
        label: 'abfc'
    }, {
        value: 'abfd',
        label: 'abfd'
    }, {
        value: 'abfe',
        label: 'abfe'
    }, {
        value: 'abff',
        label: 'abff'
    }, {
        value: 'abfg',
        label: 'abfg'
    }, {
        value: 'abfh',
        label: 'abfh'
    }, {
        value: 'abfi',
        label: 'abfi'
    }, {
        value: 'abfj',
        label: 'abfj'
    }, {
        value: 'abfk',
        label: 'abfk'
    }], // data source
    width: 120, // option panel width
    element: $('#selectboxTest'),
    dataName: 'test',
    updateDataSource: function () {
        return [{
            value: 'fgc',
            label: 'fgc'
        }, {
            value: 'def',
            label: 'edf'
        }, {
            value: 'fgd',
            label: 'fgd'
        }, {
            value: 'fge',
            label: 'fge'
        }, {
            value: 'fgf',
            label: 'fgf'
        }, {
            value: 'fgfa',
            label: 'fgfa'
        }, {
            value: 'fgfb',
            label: 'fgfb'
        }, {
            value: 'fgfc',
            label: 'fgfc'
        }, {
            value: 'fgfd',
            label: 'fgfd'
        }, {
            value: 'fgfe',
            label: 'fgfe'
        }, {
            value: 'fgff',
            label: 'fgff'
        }, {
            value: 'fgfg',
            label: 'fgfg'
        }, {
            value: 'fgfh',
            label: 'fgfh'
        }, {
            value: 'fgfi',
            label: 'fgfi'
        }, {
            value: 'fgfj',
            label: 'fgfj'
        }, {
            value: 'fgfk',
            label: 'fgfk'
        }]
    }
});

new $.jqcSelectBox({
    width: 160, // option panel width,
    defaultVal: 'abfj',
    element: $('#selectboxTestRight'),
    dataName: 'test'
});

new $.jqcSelectBox({
    width: 160, // option panel width,
    element: $('#selectboxTestMulti'),
    dataName: 'test',
    supportMultiSelect: true
});

new $.jqcSelectBox({
    width: 160, // option panel width,
    element: $('#selectboxTestMultiRight'),
    dataName: 'test',
    supportMultiSelect: true
});
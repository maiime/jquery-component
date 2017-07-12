new $.jqcSelectBox({
    optionData: [{
        value: 'abc',
        label: 'abc'
    }, {
        value: 'def',
        label: 'edf'
    }], // data source
    width: 160, // option panel width
    element: $('#selectboxTest'),
    dataName: 'test'
});
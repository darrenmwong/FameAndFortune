define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

    var mainContext = Engine.createContext();

    var colors = [
        'lightgrey',
        'red'
    ];

    var initialRatios = [0, 1];

    var flex = new FlexibleLayout({
        ratios: initialRatios
    });

    var surfaces = [];
    for (var i = 1; i < 3; i++) {
        var size = [undefined, undefined];
        surfaces.push(new Surface({
            size: size,
            content: '<h1>Surface ' + i + '</h1>',
            properties: {
                backgroundColor: colors[i-1],
                textAlign: 'center'
            }
        }));
    }

    flex.sequenceFrom(surfaces);

    var finalRatios = [9, 1];
    var toggle = false;
    Engine.on('click', function() {
        var ratios = toggle ? initialRatios : finalRatios;
        flex.setRatios(ratios, {curve: 'easeOut', duration: 500});
        toggle = !toggle;
    });

    mainContext.add(flex);
});

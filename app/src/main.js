define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var GridLayout = require("famous/views/GridLayout");

    var mainContext = Engine.createContext();

    var contextSize = mainContext.getSize();

    var dimensions;

    if (contextSize[0] < 480 || contextSize[1] < 480) {
        dimensions = [2,8];
    } else {
        dimensions = [8,2];
    };
    
    var grid = new GridLayout({
        dimensions: dimensions
    });

    var surfaces = [];
    grid.sequenceFrom(surfaces);

    for(var i = 0; i < 8; i++) {
        surfaces.push(new Surface({
            content: "I am panel " + (i + 1),
            size: [undefined, undefined],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
                color: "black",
                lineHeight: window.innerHeight / 2 + 'px',
                textAlign: 'center'
            }
        }));
    }

    mainContext.add(grid);
});
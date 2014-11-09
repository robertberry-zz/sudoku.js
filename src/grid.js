var component = require('omniscient'),
    Immutable = require('immutable'),
    qwery = require('qwery'),
    React = require('react');

var CELL_SIZE = 30,
    BORDER_SIZE = 1;

function position(a) {
    return (Math.floor(a / 3) + 2) * BORDER_SIZE +
        a * (CELL_SIZE + BORDER_SIZE);
}

function gridSize(n) {
    return position(n) + BORDER_SIZE;
}

var Cell = component(function (props) {
    return React.DOM.rect({
        x: position(props.x),
        y: position(props.y),
        width: CELL_SIZE,
        height: CELL_SIZE,
        className: "sudoku__cell"
    });
});

var Grid = component(function () {
    var cells = Immutable.Range(0, 9).flatMap(function (x) {
        return Immutable.Range(0, 9).map(function (y) {
            return Cell(x + "_" + y, {
                x: x,
                y: y
            });
        });
    });

    var background = React.DOM.rect({
        x: 0,
        y: 0,
        width: gridSize(9),
        height: gridSize(9),
        className: "sudoku__background"
    });

    return React.DOM.svg({
        width: gridSize(9),
        height: gridSize(9)
    }, background, cells.toJS());
});

React.render(Grid(), qwery('.js-sudoku')[0]);


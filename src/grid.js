var component = require('omniscient');
var Immutable = require('immutable');
var React = require('react/addons');

var CELL_SIZE = 30,
    BORDER_SIZE = 1;

function position(a) {
    return (Math.floor(a / 3) + 2) * BORDER_SIZE +
        a * (CELL_SIZE + BORDER_SIZE);
}

var Cell = component(function (props) {
    var value = props.cursor.get('value');

    return React.DOM.rect({
        x: position(props.x),
        y: position(props.y),
        width: CELL_SIZE,
        height: CELL_SIZE,
        className: React.addons.classSet({
            "sudoku__cell": true,
            "sudoku__cell--editable": props.cursor.get('editable')
        })
    });
});

var Grid = component(function (props) {
    var cells = Immutable.Range(0, 9).flatMap(function (x) {
        return Immutable.Range(0, 9).map(function (y) {
            return Cell(x + "_" + y, {
                x: x,
                y: y,
                cursor: props.cursor.get(x).get(y)
            });
        });
    });

    var background = React.DOM.rect({
        x: 0,
        y: 0,
        width: position(9),
        height: position(9),
        className: "sudoku__background"
    });

    return React.DOM.svg({
        width: position(9),
        height: position(9)
    }, background, cells.toJS());
});

module.exports = Grid;


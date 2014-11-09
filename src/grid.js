var component = require('omniscient'),
    Immutable = require('immutable'),
    React = require('react/addons');

var CELL_SIZE = 30,
    BORDER_SIZE = 1,
    TEXT_X_OFFSET = 7,
    TEXT_Y_OFFSET = 25;

function position(a) {
    return (Math.floor(a / 3) + 2) * BORDER_SIZE +
        a * (CELL_SIZE + BORDER_SIZE);
}

var Cell = component(function (props) {
    var value = props.cursor.get('value');

    return React.DOM.g({}, 
        React.DOM.rect({
            x: position(props.x),
            y: position(props.y),
            width: CELL_SIZE,
            height: CELL_SIZE,
            className: React.addons.classSet({
                "sudoku__cell": true,
                "sudoku__cell--editable": props.cursor.get('editable'),
                "sudoku__cell--highlighted": props.isHighlighted
            })
        }), value ? [
            React.DOM.text({
                x: position(props.x) + TEXT_X_OFFSET,
                y: position(props.y) + TEXT_Y_OFFSET,
                className: "sudoku__cell-text"
            }, value)
        ] : []
    );
});

function highlights(focusX, focusY) {
    var focusSquareX = Math.floor(focusX / 3),
        focusSquareY = Math.floor(focusY / 3);

    return function (x, y) {
        var squareX = Math.floor(x / 3),
            squareY = Math.floor(y / 3);

        return x == focusX ||
            y == focusY ||
            squareX == focusSquareX && squareY == focusSquareY;
    };
}

function fConst(a) {
    return function () {
        return a;
    };
};

var Grid = component(function (props) {
    var isHighlighted = props.focus ? highlights(props.focus.get('x'), props.focus.get('y')) : fConst(false),
        cells = Immutable.Range(0, 9).flatMap(function (x) {
        return Immutable.Range(0, 9).map(function (y) {
            return Cell(x + "_" + y, {
                x: x,
                y: y,
                isHighlighted: isHighlighted(x, y),
                cursor: props.cells.get([x, y])
            });
        });
    });

    return React.DOM.svg({
        width: position(9),
        height: position(9)
    }, React.DOM.rect({
        x: 0,
        y: 0,
        width: position(9),
        height: position(9),
        className: "sudoku__background"
    }), cells.toJS());
});

module.exports = Grid;


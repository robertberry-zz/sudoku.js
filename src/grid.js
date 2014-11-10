var component = require('omniscient'),
    EventEmitter = require('events').EventEmitter,
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

var Cell = component(function (props, statics) {
    var x = props.cursor.get('x'),
        y = props.cursor.get('y'),
        value = props.cursor.get('value');

    function onClick(e) {
        statics.events.emit('click', {
            x: x,
            y: y
        });
    }

    return React.DOM.g({}, 
        React.DOM.rect({
            x: position(x),
            y: position(y),
            width: CELL_SIZE,
            height: CELL_SIZE,
            className: React.addons.classSet({
                "sudoku__cell": true,
                "sudoku__cell--editable": props.cursor.get('editable'),
                "sudoku__cell--highlighted": props.cursor.get('highlighted'),
                "sudoku__cell--focussed": props.cursor.get('focussed')
            }),
            onClick: onClick
        }), value ? [
            React.DOM.text({
                key: "text",
                x: position(x) + TEXT_X_OFFSET,
                y: position(y) + TEXT_Y_OFFSET,
                className: "sudoku__cell-text",
                onClick: onClick
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

var events = new EventEmitter();

function mapCells(grid, f) {
    return grid.map(function (column) {
        return column.map(f);
    });
}

var Grid = component({
    componentDidMount: function () {
        var self = this,
            cells = this.props.cells;

        function focusCell(position) {
            var isHighlighted = highlights(position.x, position.y);

            cells.update(function (state) {
                return mapCells(state, function (cell) {
                    return cell.merge({
                        focussed: cell.get('x') === position.x && cell.get('y') === position.y,
                        highlighted: isHighlighted(cell.get('x'), cell.get('y'))
                    });
                });
            });

            self.focus = cells.get([position.x, position.y]);
        }

        events.on('click', focusCell);
    },

    componentWillUnmount: function () {
        events.removeAllListeners();
    }
}, function (props) {
    var cells = props.cells.flatMap(function (column) {
        return column.map(function (cell) {
            return Cell(cell.get('x') + "_" + cell.get('y'), {
                cursor: cell,
                statics: {
                    events: events
                }
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


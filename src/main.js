var immstruct = require('immstruct');
var qwery = require('qwery');
var React = require('react/addons');
var Grid = require('./grid.js');

var puzzle = [
    [null, 2, null, 5, null, null, null, 4, null],
    [8, null, null, null, null, null, null, null, null],
    [null, null, 4, null, 7, null, null, null, null],
    [null, null, 3, null, 8, null, null, 2, null],
    [null, null, null, null, 6, null, 9, 5, null],
    [7, null, null, 4, 3, 5, 6, null, null],
    [null, null, null, 3, null, null, 1, 6, 9],
    [null, 3, null, null, 9, null, null, 8, null],
    [null, 1, null, 2, null, null, null, 7, 5]
];

var structure = immstruct({
    cells: puzzle.map(function (column) {
        return column.map(function (entry) {
            return {
                value: entry,
                editable: entry === null
            };
        });
    })
});

function render() {
    React.render(
        Grid(structure.cursor('cells')),
        qwery('.js-sudoku')[0]
    );
}


structure.on('swap', render);

render();

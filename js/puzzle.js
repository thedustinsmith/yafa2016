var Puzzle = (function () {
    var defaults = {
        pieceCount: 100
    };
    var X_COUNT = 10,
        Y_COUNT = 10;

    function fix(v, decimal) {
        return parseFloat(v).toFixed(decimal || 2);
    }

    function Puzzle (opts) {
        var self = this;
        self.url = opts.url;
        self.pieceCount = opts.pieceCount || 100;

        self.$el = $('<div class="puzzleboard" />').appendTo('body');
    }

    Puzzle.prototype.start = function () {
        var self = this;
        self.image = new Image;
        self.image.onload = self.imageLoaded.bind(self);
        self.image.src = self.url;
    };

    Puzzle.prototype.initDraggable = function () { 
        this.$el.find('canvas').draggable();
    };

    Puzzle.prototype.imageLoaded = function () {
        var self = this;
        self.piecesX = X_COUNT; //self.image.width / 10;
        self.piecesY = Y_COUNT; //self.image.height / 10;
        self.pieceW = self.image.width / self.piecesX;
        self.pieceH = self.image.height / self.piecesY;
        self.loadPieces();

        self.$el.css({
            'width': self.image.width,
            'height': self.image.height,
            'transformOrigin': 'top left',
            'transform': 'scale(' + ($(window).width() / self.image.width) + ')'
        });
        self.bindEvents();
    };

    Puzzle.prototype.bindEvents = function () {
        var LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40,
            ALLOWEDKEYS = [LEFT, UP, RIGHT, DOWN],
            self = this;

        self.initDraggable();
        $(window).on('click', function (ev) { 
            console.log(ev.target);
            if ($(ev.target).is('.piece')) {
                var $piece = $(ev.target);
                $piece.addClass('active').siblings().removeClass('active');
            }
            else {
                $('.piece.active').removeClass('active');
            }
        });
        $(window).on('keydown', function (ev) {
            var key = ev.which,
                $active = self.$el.find('.piece.active');

            if (!$active.length) return;
            if (ALLOWEDKEYS.indexOf(key) > -1) ev.preventDefault();

            if (key === LEFT) {
                $active.css('left', (parseInt($active.css('left'), 10) || 0) - 1);
            }
            if (key === RIGHT) {
                $active.css('left', (parseInt($active.css('left'), 10) || 0) + 1);
            }
            if (key === UP) {
                $active.css('top', (parseInt($active.css('top'), 10) || 0) - 1);
            }
            if (key === DOWN) {
                $active.css('top', (parseInt($active.css('top'), 10) || 0) + 1);
            }
        });
    }

    Puzzle.prototype.loadPieces = function () {
        var self = this;
        self.pieces = [];

        for (var y = 0; y < self.piecesY; y++) {
            var row = [],
                isLastRow = y === (self.piecesY - 1);

            for (var x = 0; x < self.piecesX; x++) {
                var edgeTypes = [0, 0, 0, 0],
                    isRightEdge = x === (self.piecesX - 1),
                    above,left;

                if (y > 0) {
                    above = self.pieces[y-1][x].edgeTypes[2];
                    edgeTypes[0] = above === -1 ? 1 : -1;
                }
                
                if (!isLastRow) {
                    edgeTypes[2] = Math.random() > .5 ? 1 : -1;
                }

                if (x > 0) {
                    left = row[x-1].edgeTypes[1];
                    edgeTypes[3] = left === -1 ? 1 : -1;
                }

                if (!isRightEdge) {
                    edgeTypes[1] = Math.random() > .5 ? 1 : -1;
                }

                var piece = new PuzzlePiece({
                    width: self.pieceW,
                    height: self.pieceH,
                    edgeTypes: edgeTypes,
                    top: fix(self.pieceH * y),
                    left: fix(self.pieceW * x),
                    image: self.image,
                    container: self.$el
                });
                // piece.$canvas.css('max-width', (100/X_COUNT) + '%');
                row.push(piece);
                // break;
            }
            self.pieces.push(row);
            // break;
        }
    };

    return Puzzle;
})();

var interpreter = (function(exports)
    {
        var self = exports;

        var _stack = [];
        var _commandChain = [];

        exports.stack = function() {
            return _stack;
        }

        exports.commandChain = function() {
            return _commandChain;
        }

        exports.start = function() {
            _stack = [];
            _commandChain = [];
        }

        exports.getTop = function() {
            return _stack[_stack.length-1];
        }

        // COMMANDS

        // push: Pushes the value of the colour block just exited on to the stack.
        // Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.
        // Hue: +0, Lightness: +1
        exports.push = function(n)
        {
            if (!isNaN(n)) {
                _commandChain.push("push(" + n + ")");
                _stack.push(n);
            }
        };

        // pop: Pops the top value off the stack and discards it.
        // Hue: +0, Lightness: +2
        exports.pop = function() {
            var top = self.getTop();
            _commandChain.push("pop(" + top + ")");
            _stack.pop();
            return top;
        }

        // add: Pops the top two values off the stack, adds them, and pushes the result back on the stack.
        // Hue: +1, Lightness: +0
        exports.add = function() {
            var a = self.pop();
            var b = self.pop();
            if (validate(a,b)) {
                _commandChain.push("add(" + a + "+" + b + ")");
                self.push(a + b);
            }
        }

        // subtract: Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.
        // Hue: +1, Lightness: +1
        exports.subtract = function() {
            var a = self.pop();
            var b = self.pop();
            if (validate(a,b)) {
                _commandChain.push("subtract(" + b + "-" + a + ")");
                self.push(b - a);
            }
        }

        // multiply: Pops the top two values off the stack, multiplies them, and pushes the result back on the stack
        // Hue: +1, Lightness: +2
        exports.multiply = function() {
            var a = self.pop();
            var b = self.pop();
            if (validate(a,b)) {
                _commandChain.push("multiply(" + a + "x" + b + ")");
                self.push(a * b);
            }
        }

        // divide: Pops the top two values off the stack, calculates the integer division of the second top value by the top value, and pushes the result back on the stack.
        // Hue: +2, Lightness: +0
        exports.divide = function() {
            var a = self.pop();
            var b = self.pop();
            if (validate(a,b) && b !== 0) {
                _commandChain.push("divide(" + b + "/" + a + ")");
                self.push(b / a);
            }
        }

        // out: Pops the top value off the stack and prints it to STDOUT as a number.
        // Hue: +5, Lightness: +1
        exports.outN = function() {
            var out = self.pop();
            _commandChain.push("outN(" + out + ")");
            return out;
        }

        // out: Pops the top value off the stack and prints it to STDOUT as a character.
        // Hue: +5, Lightness: +2
        exports.outC = function() {
            var out = String.fromCharCode(self.pop())
            _commandChain.push("outC(" + out + ")");
            return out;
        }

        function validate(a,b) {
            return !isNaN(a) && !isNaN(b);
        }

        return {
            stack: exports.stack,
            commandChain: exports.commandChain,
            start: exports.start,
            push: exports.push,
            pop: exports.pop,
            add: exports.add,
            subtract: exports.subtract,
            multiply: exports.multiply,
            divide: exports.divide,
            outN: exports.outN,
            outC: exports.outC
        }

})(typeof exports === 'undefined'? this['Interpreter']={}: exports);

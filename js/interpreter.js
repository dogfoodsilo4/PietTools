
var interpreter = (function(exports)
{
        var self = exports;

        var _stack = [];
        var _commandChain = [];
        var _dp = 1; // 1 = right, 2 = down, 3 = left, 4 = up;
        var _cc = 1; // 1 = left, 2 = right

        self._history = [];

        exports.stack = function() {
            return _stack;
        }

        exports.commandChain = function() {
            return _commandChain;
        }

        exports.DirectionPointer = function() {
            return self._dp;
        }

        exports.CodelChooser = function() {
            return self._cc;
        }

        exports.start = function() {
            _stack = [];
            _commandChain = [];
            self._dp = 1; // reset to right
            self._cc = 1; // reset to left
            self._history = [];
            self.saveState();
        }

        exports.saveState = function() {
            self._history.push({
                'stack': JSON.parse(JSON.stringify(_stack)),
                'commandChain': JSON.parse(JSON.stringify(_commandChain)),
                'dp': JSON.parse(JSON.stringify(self._dp)),
                'cc': JSON.parse(JSON.stringify(self._cc))
            });
        }

        exports.getState = function() {
            return self._history;
        }

        exports.restoreState = function() {
            if (self._history.length > 1) {
                self._history.pop();
                var previousState = JSON.parse(JSON.stringify(self._history[self._history.length-1]));
                _stack = previousState.stack;
                _commandChain = previousState.commandChain;
                self._dp = previousState.dp;
                self._cc = previousState.cc;
            }
        }

        exports.getTop = function() {
            return _stack[_stack.length-1];
        }

        // COMMANDS

        // push: Pushes the value of the colour block just exited on to the stack.
        // Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.
        // Hue: +0, Lightness: +1
        exports.push = function(n, isSubCmd)
        {
            if (!isNaN(n)) {
                _stack.push(n);
                logCmd("push", n, isSubCmd);
            }
        };

        // pop: Pops the top value off the stack and discards it.
        // Hue: +0, Lightness: +2
        exports.pop = function(isSubCmd) {
            var top = self.getTop();
            _stack.pop();
            logCmd("pop", top, isSubCmd);
            return top;
        }

        // add: Pops the top two values off the stack, adds them, and pushes the result back on the stack.
        // Hue: +1, Lightness: +0
        exports.add = function() {
            var a = self.pop(true);
            var b = self.pop(true);
            if (validate(a,b)) {
                self.push(a + b, true);
                logCmd("add", a + "+" + b);
            }
        }

        // subtract: Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.
        // Hue: +1, Lightness: +1
        exports.subtract = function() {
            var a = self.pop(true);
            var b = self.pop(true);
            if (validate(a,b)) {
                self.push(b - a, true);
                logCmd("subtract", b + "-" + a);
            }
        }

        // multiply: Pops the top two values off the stack, multiplies them, and pushes the result back on the stack
        // Hue: +1, Lightness: +2
        exports.multiply = function() {
            var a = self.pop(true);
            var b = self.pop(true);
            if (validate(a,b)) {
                self.push(a * b, true);
                logCmd("multiply", a + "x" + b);
            }
        }

        // divide: Pops the top two values off the stack, calculates the integer division of the second top value by the top value, and pushes the result back on the stack.
        // Hue: +2, Lightness: +0
        exports.divide = function() {
            var a = self.pop(true);
            var b = self.pop(true);
            if (validate(a,b) && b !== 0) {
                self.push(b / a, true);
                logCmd("divide", b + "/" + a);
            }
        }

        // mod: Pops the top two values off the stack, calculates the second top value modulo the top value, and pushes the result back on the stack.
        // The result has the same sign as the divisor (the top value).
        // If the top value is zero, this is a divide by zero error, which is handled as an implementation-dependent error, though simply ignoring the command is recommended.
        // Hue: +2, Lightness: +1
        exports.mod = function() {
            if (self.getTop() !== 0)
            {
                var a = self.pop(true);
                var b = self.pop(true);
                if (validate(a,b) && a !== 0) {
                    self.push(a % b, true);
                    logCmd("mod", b + "%" + a);
                }
            }
        }

        // not: Replaces the top value of the stack with 0 if it is non-zero, and 1 if it is zero.
        // Hue: +2, Lightness: +2
        exports.not = function() {
            var a = self.pop(true);
            var c = a === 0 ? 1 : 0;
            self.push(c, true);
            logCmd("not", c);
        }

        // greater: Pops the top two values off the stack, and pushes 1 on to the stack if the second top value is greater than the top value, and pushes 0 if it is not greater.
        // Hue: +3, Lightness: +0
        exports.greater = function() {
            var a = self.pop(true);
            var b = self.pop(true);
            if (validate(a,b)) {
                var c = b > a ? 1 : 0;
                self.push(c, true);
                logCmd("greater", c);
            }
        }

        // pointer: Pops the top value off the stack and rotates the DP clockwise that many steps (anticlockwise if negative).
        // Hue: +3, Lightness: +1
        exports.pointer = function() {
            var a = self.pop(true);
            var moves = a % 4;
            var b = self.DirectionPointer() + moves;
            b = b > 4 ? b - 4 : b <= 0 ? b + 4 : b;
            self._dp = b;
            logCmd("pointer", b);
        }

        // switch: Pops the top value off the stack and toggles the CC that many times (the absolute value of that many times if negative).
        // Hue: +3, Lightness: +2
        exports.switch = function() {
            var a = self.pop(true);
            var moves = Math.abs(a) % 2;
            var b = self.CodelChooser() + moves;
            b = b > 2 ? b - 2 : b;
            self._cc = b;
            logCmd("switch", b);
        }


        // duplicate: Pushes a copy of the top value on the stack on to the stack.
        // Hue: +4, Lightness: +0
        exports.duplicate = function() {
            var top = self.getTop();
            _stack.push(top);
            logCmd("duplicate", top);
        }

        // roll: Pops the top two values off the stack and "rolls" the remaining stack entries
        // to a depth equal to the second value popped, by a number of rolls equal to the first value popped.
        // A single roll to depth n is defined as burying the top value on the stack n deep and bringing all values above it up by 1 place.
        // A negative number of rolls rolls in the opposite direction.
        // A negative depth is an error and the command is ignored.
        // Hue: +4, Lightness: +1
        exports.roll = function() {
            var rolls = self.pop(true);
            var depth = self.pop(true);

            if (rolls < 0) { rolls = Math.abs(rolls); }
            // TODO: n rolls, assume 1 for now
            if (depth >= 0) {
                for (var roll = 0; roll < rolls; roll++) {
                    var iTop = _stack.length - 1;
                    var top = self.getTop();
                    for (var i = iTop; i > iTop - depth; i--) {
                        _stack[i] = _stack[i-1];
                    }
                    _stack[iTop - depth] = top;
                }
                logCmd("roll", rolls + ":" + depth);
            }
        }

        // out: Pops the top value off the stack and prints it to STDOUT as a number.
        // Hue: +5, Lightness: +1
        exports.outN = function() {
            var out = self.pop(true);
            logCmd("outN", out);
            return out;
        }

        // out: Pops the top value off the stack and prints it to STDOUT as a character.
        // Hue: +5, Lightness: +2
        exports.outC = function() {
            var out = String.fromCharCode(self.pop(true))
            logCmd("outC", out);
            return out;
        }

        function logCmd(cmd, value, isSubCmd)
        {
          // TODO: build this as a full object
          if (!isSubCmd) {
            _commandChain.push(cmd + "(" + value + ")");
          }
        //   else {
        //     _commandChain.push("- " + cmd + "(" + value + ")");
        //   }
        }

        function validate(a,b) {
            return !isNaN(a) && !isNaN(b);
        }

        return {
            stack: exports.stack,
            commandChain: exports.commandChain,
            DirectionPointer: exports.DirectionPointer,
            CodelChooser: exports.CodelChooser,
            saveState: exports.saveState,
            getState: exports.getState,
            restoreState: exports.restoreState,
            start: exports.start,
            push: exports.push,
            pop: exports.pop,
            add: exports.add,
            subtract: exports.subtract,
            multiply: exports.multiply,
            divide: exports.divide,
            mod: exports.mod,
            not: exports.not,
            greater: exports.greater,
            pointer: exports.pointer,
            switch: exports.switch,
            duplicate: exports.duplicate,
            roll: exports.roll,
            outN: exports.outN,
            outC: exports.outC
        }

})(typeof exports === 'undefined'? this['Interpreter']={}: exports);

var assert          = require("chai").assert;
var itpr            = require("../Interpreter.js");

describe("Piet Tools", function () {

    describe("Interpreter", function () {

        beforeEach(function() {
            itpr.start();
          });

        it("push() should push a value on to the stack", function() {

            itpr.push(1);
            itpr.push(2);
            assert.equal(itpr.stack().toString(), [1, 2]);
        });

        it("pop() should pop a value of the stack", function() {

            itpr.push(3);
            itpr.push(4);
            itpr.push(5);
            var removed = itpr.pop();

            assert.equal(itpr.stack().toString(), [ 3, 4 ]);
            assert.equal(removed, 5);
            assert.equal(itpr.getTop(), 4);
        });

        it("add() should pop the top two values off the stack, adds them and push the result back on the stack", function() {

            itpr.push(6);
            itpr.push(7);
            itpr.push(8);
            itpr.add();

            assert.equal(itpr.stack().toString(), [ 6, 15 ]);
        });

        // Should ignore strings in the stack??

        it("subtract() should pop the top two values off the stack, calculate the second top value minus the top value, and push the result back on the stack", function() {

            itpr.push(3);
            itpr.push(9);
            itpr.push(6);
            itpr.subtract();

            assert.equal(itpr.stack().toString(), [ 3, 3 ]);
        });

        it("multiply() should pop the top two values off the stack, multiply them, and push the result back on the stack", function() {
            itpr.push(7);
            itpr.push(5);
            itpr.push(6);
            itpr.multiply();

            assert.equal(itpr.stack().toString(), [ 7, 30 ]);
        });

        it("divide() should pop the top two values off the stack, calculate the integer division of the second top value by the top value, and push the result back on the stack", function() {
            itpr.push(7);
            itpr.push(10);
            itpr.push(5);
            itpr.divide();

            assert.equal(itpr.stack().toString(), [ 7, 2 ]);
        });

        it("mod() should pop the top two values off the stack, calculate the second top value modulo the top value, and push the result back on the stack", function() {
            itpr.push(7);
            itpr.push(5);
            itpr.push(13);
            itpr.mod();

            // The result has the same sign as the divisor (the top value).
            itpr.push(-5);
            itpr.push(-13);
            itpr.mod();

            // If the top value is zero, this is a divide by zero errorabd the command should be ignored.
            itpr.push(5);
            itpr.push(0);
            itpr.mod();

            assert.equal(itpr.stack().toString(), [ 7, 3, -3, 5, 0 ]);
        });

        it("greater() should pop the top two values off the stack, and push 1 on to the stack if the second top value is greater than the top value, and push 0 if it is not greater.", function() {
            itpr.push(3);
            itpr.push(8);
            itpr.push(9);
            itpr.greater();

            itpr.push(7);
            itpr.push(5);
            itpr.greater();

            assert.equal(itpr.stack().toString(), [ 3, 0, 1 ]);
        });

        it("pointer() should pop the top value off the stack and rotate the DP clockwise that many steps (anticlockwise if negative).", function() {
            itpr.push(2);
            itpr.pointer();

            assert.equal(itpr.DirectionPointer(), 3);

            itpr.push(-1);
            itpr.pointer();

            assert.equal(itpr.DirectionPointer(), 2);

            itpr.push(-10);
            itpr.pointer();

            assert.equal(itpr.DirectionPointer(), 4);

            itpr.push(17);
            itpr.pointer();

            assert.equal(itpr.DirectionPointer(), 1);
        });

        it("duplicate() should push a copy of the top value on the stack on to the stack", function() {
            itpr.push(8);
            itpr.push(9);
            itpr.duplicate();

            assert.equal(itpr.stack().toString(), [ 8, 9, 9 ]);
        });

        it("roll() should pop the top two values off the stack and roll the remaining stack entries to a depth equal to the second value popped", function() {
            itpr.push(3);
            itpr.push(2);
            itpr.push(1);
            itpr.push(2);
            itpr.push(1);
            itpr.roll();

            assert.equal(itpr.stack().toString(), [ 1, 3, 2 ]);
        });

        it("roll() should pop the top two values off the stack and roll the remaining stack entries to a depth equal to the second value popped, by a number of rolls equal to the first value popped", function() {
            itpr.push(3);
            itpr.push(2);
            itpr.push(1);
            itpr.push(2);
            itpr.push(2);
            itpr.roll();

            assert.equal(itpr.stack().toString(), [ 2, 1, 3 ]);
        });

        it("outN() should pop the top value off the stack and print to STDOUT as a number", function() {

            itpr.push(3);
            itpr.push(65);

            assert.equal(itpr.outN(), 65);
        });

        it("outC() should pop the top value off the stack and print to STDOUT as a character", function() {

            itpr.push(3);
            itpr.push(65);

            assert.equal(itpr.outC(), "A");
        });

        it("should build the commandChain", function() {
            itpr.push(3);
            itpr.push(5);
            itpr.push(8);
            itpr.add();
            itpr.subtract();
            itpr.push(68);
            itpr.outC();
            assert.equal(itpr.commandChain().toString(),
                "push(3),push(5),push(8),- pop(8),- pop(5),- push(13),add(8+5),- pop(13),- pop(3),push(-10),subtract(3-13),push(68),- pop(68),outC(D)")
        });

        // Should ignore -values??
    });
});

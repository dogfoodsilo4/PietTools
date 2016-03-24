var assert          = require("chai").assert;
var itpr            = require("../Interpreter.js");

describe("Piet Tools tests", function () {

    describe("Interpreter tests", function () {

        beforeEach(function() {
            itpr.start();
          });

        it("should push a value on to the stack", function() {

            itpr.push(1);
            itpr.push(2);
            assert.equal(itpr.stack().toString(), [1, 2]);
        });

        it("should pop a value of the stack", function() {

            itpr.push(3);
            itpr.push(4);
            itpr.push(5);
            var removed = itpr.pop();

            assert.equal(itpr.stack().toString(), [ 3, 4 ]);
            assert.equal(removed, 5);
            assert.equal(itpr.getTop(), 4);
        });

        it("should pop the top two values off the stack, adds them and push the result back on the stack", function() {

            itpr.push(6);
            itpr.push(7);
            itpr.push(8);
            itpr.add();

            assert.equal(itpr.stack().toString(), [ 6, 15 ]);
        });

        // Should ignore strings in the stack??

        it("should pop the top two values off the stack, calculate the second top value minus the top value, and push the result back on the stack", function() {

            itpr.push(3);
            itpr.push(9);
            itpr.push(6);
            itpr.subtract();

            assert.equal(itpr.stack().toString(), [ 3, 3 ]);
        });

        it("should pop the top two values off the stack, multiply them, and push the result back on the stack", function() {
            itpr.push(7);
            itpr.push(5);
            itpr.push(6);
            itpr.multiply();

            assert.equal(itpr.stack().toString(), [ 7, 30 ]);
        });

        it("should pop the top two values off the stack, calculate the integer division of the second top value by the top value, and push the result back on the stack", function() {
            itpr.push(7);
            itpr.push(5);
            itpr.push(6);
            itpr.multiply();

            assert.equal(itpr.stack().toString(), [ 7, 30 ]);
        });

        it("should pop the top value off the stack and print to STDOUT as a number", function() {

            itpr.push(3);
            itpr.push(65);

            assert.equal(itpr.outN(), 65);
        });

        it("should pop the top value off the stack and print to STDOUT as a character", function() {

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
                "push(3),push(5),push(8),pop(8),pop(5),add(8+5),push(13),pop(13),pop(3),subtract(3-13),push(-10),push(68),pop(68),outC(D)")
        });

        // Should ignore -values??
    });
});

var ptApp = angular.module('ptApp', []);

ptApp.controller('ptCtrl', ['$scope', 'Data', function ($scope, Data) {

	$scope.data = Data.vm;

    var itpr = interpreter;

    $scope.start = function() {
        itpr.start();
        $scope.output = "";
        angular.element('#input').focus();
		$scope.state = {
	        colour: 1,
	        dp: 1,
	        cc: 'left',
			lastState: null
	    };
		updateState();
    }

    $scope.start();

    $scope.action = function(command) {

		var err = null;

		// TODO: check if we have anything on the stack. greater with empty stack pushes null to stack, that's bad.

        switch (command.action) {
            case "push":
				var input = getInputValue()
				if (input != 0) {
	                itpr.push(input);
				} else {
					err = "Piet images have no way to push 0, try 1 subtract 1 ";
					// TODO: output validation error.
				}
                break;
            case "pop":
                itpr.pop();
                break;
            case "add":
                itpr.add();
                break;
            case "subtract":
                itpr.subtract();
                break;
            case "multiply":
                itpr.multiply();
                break;
            case "divide":
                itpr.divide();
                break;
			case "mod":
                itpr.mod();
                break;
			case "not":
                itpr.not();
                break;
			case "greater":
                itpr.greater();
                break;
			case "pointer":
                itpr.pointer();
                break;
            case "duplicate":
                itpr.duplicate();
                break;
            case "roll":
                itpr.roll();
                break;
            case "outN":
                STDOUT(itpr.outN());
                break;
            case "outC":
                STDOUT(itpr.outC());
                break;
            default:
                break;
        }
		if (err === null) {
			saveState();
			$scope.state.colour = getColour(command.index);
		}
		updateState();
    };

    function updateState() {


		$scope.state.dp = itpr.DirectionPointer();

		updateCommandColours();

		printStack();
        printCommandChain();

        angular.element('#input').focus();
        $scope.input = "";

		$scope.itprState = itpr.getState();
	};

	function saveState() {
		$scope.state.lastState = JSON.parse(JSON.stringify($scope.state));
		itpr.saveState();
	}

	$scope.undo = function() {
		if ($scope.state.lastState != null) {
			$scope.state = JSON.parse(JSON.stringify($scope.state.lastState));
			itpr.restoreState();
			updateState();
		}
	}

    function getInputValue() {
        // Get input value
        var n = $scope.input;

        // Read characters as ascii char code
        if (isNaN(n)) {
            if (n.length === 1) {
                n = n.charCodeAt(0);
            }
            else if (n === "\\n") {
                n = 10;
            }
        }

        return parseInt(n);
    }

    function printStack() {
        $scope.stackText = "";
        var stack = itpr.stack();
        for (var i = stack.length - 1; i > -1; i--)
        {
            $scope.stackText += i + ": " + stack[i] + "\n";
        }

    };

    function printCommandChain() {
        $scope.commandChainText = "";
        var commandChain = itpr.commandChain();
        for (var i = commandChain.length - 1; i > -1; i--)
        {
            $scope.commandChainText += i + ": " + commandChain[i] + "\n";
        }
    };

    function STDOUT(value) {
		if (value != null) {
	        $scope.output += value;
		}
    }

	function updateCommandColours() {
		for (var i = 0; i < $scope.data.commands.length; i++) {
			var c = getColour($scope.data.commands[i].index);
			$scope.data.commands[i].colour = $scope.data.colours[c].hex;
		}
	}

	function getColour(index) {
		var c = $scope.state.colour + index;
		return c > 17 ? c - 18 : c;
	};

}]);

ptApp.service('Data', ['$rootScope', function ($rootScope) {

		var scope = $rootScope.$new(true);

		scope.vm = {
			commands: [
                  {'action': 'push',       'index': 1, 'hueChange': 0, 'lightnessChange': 1, 'colour': '', 'description': 'Pushes the value of the colour block just exited on to the stack. Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.'}
                , {'action': 'pop',        'index': 2, 'hueChange': 0, 'lightnessChange': 2, 'colour': '', 'description': 'Pops the top value off the stack and discards it.'}
                , {'action': 'add',        'index': 3, 'hueChange': 1, 'lightnessChange': 0, 'colour': '', 'description': 'Pops the top two values off the stack, adds them, and pushes the result back on the stack.'}
                , {'action': 'subtract',   'index': 4, 'hueChange': 1, 'lightnessChange': 1, 'colour': '', 'description': 'Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.'}
                , {'action': 'multiply',   'index': 5, 'hueChange': 1, 'lightnessChange': 2, 'colour': '', 'description': 'Pops the top two values off the stack, multiplies them, and pushes the result back on the stack.'}
                , {'action': 'divide',     'index': 6, 'hueChange': 2, 'lightnessChange': 0, 'colour': '', 'description': 'Pops the top two values off the stack, calculates the integer division of the second top value by the top value, and pushes the result back on the stack. If a divide by zero occurs, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
                , {'action': 'mod',        'index': 7, 'hueChange': 2, 'lightnessChange': 1, 'colour': '', 'description': 'Pops the top two values off the stack, calculates the second top value modulo the top value, and pushes the result back on the stack. The result has the same sign as the divisor (the top value). If the top value is zero, this is a divide by zero error, which is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
                , {'action': 'not',        'index': 8, 'hueChange': 2, 'lightnessChange': 2, 'colour': '', 'description': 'Replaces the top value of the stack with 0 if it is non-zero, and 1 if it is zero.'}
                , {'action': 'greater',    'index': 9, 'hueChange': 3, 'lightnessChange': 0, 'colour': '', 'description': 'Pops the top two values off the stack, and pushes 1 on to the stack if the second top value is greater than the top value, and pushes 0 if it is not greater.'}
                , {'action': 'pointer',    'index': 10, 'hueChange': 3, 'lightnessChange': 1, 'colour': '', 'description': 'Pops the top value off the stack and rotates the DP clockwise that many steps (anticlockwise if negative).'}
                , {'action': 'switch',     'index': 11, 'hueChange': 3, 'lightnessChange': 2, 'colour': '', 'description': 'Pops the top value off the stack and toggles the CC that many times (the absolute value of that many times if negative).'}
                , {'action': 'duplicate',  'index': 12, 'hueChange': 4, 'lightnessChange': 0, 'colour': '', 'description': 'Pushes a copy of the top value on the stack on to the stack.'}
                , {'action': 'roll',       'index': 13, 'hueChange': 4, 'lightnessChange': 1, 'colour': '', 'description': 'Pops the top two values off the stack and "rolls" the remaining stack entries to a depth equal to the second value popped, by a number of rolls equal to the first value popped. A single roll to depth n is defined as burying the top value on the stack n deep and bringing all values above it up by 1 place. A negative number of rolls rolls in the opposite direction. A negative depth is an error and the command is ignored. If a roll is greater than an implementation-dependent maximum stack depth, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
                , {'action': 'inN',        'index': 14, 'hueChange': 4, 'lightnessChange': 2, 'colour': '', 'description': 'Reads a value from STDIN as a number and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.'}
                , {'action': 'inC',        'index': 15, 'hueChange': 5, 'lightnessChange': 0, 'colour': '', 'description': 'Reads a value from STDIN as a character and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.'}
                , {'action': 'outN',       'index': 16, 'hueChange': 5, 'lightnessChange': 1, 'colour': '', 'description': 'Pops the top value off the stack and prints it to STDOUT as a number.'}
                , {'action': 'outC',       'index': 17, 'hueChange': 5, 'lightnessChange': 2, 'colour': '', 'description': 'Pops the top value off the stack and prints it to STDOUT as a character.'}
            ],

            colours: [
                  {'name': 'light red',      'hex': 'FFC0C0', 'hue': '0', 'lightness': '0'}
                , {'name': 'red',            'hex': 'FF0000', 'hue': '0', 'lightness': '1'}
                , {'name': 'dark red',       'hex': 'C00000', 'hue': '0', 'lightness': '2'}
                , {'name': 'light yellow',   'hex': 'FFFFC0', 'hue': '1', 'lightness': '0'}
                , {'name': 'yellow',         'hex': 'FFFF00', 'hue': '1', 'lightness': '1'}
                , {'name': 'dark yellow',    'hex': 'C0C000', 'hue': '1', 'lightness': '2'}
                , {'name': 'light green',    'hex': 'C0FFC0', 'hue': '2', 'lightness': '0'}
                , {'name': 'green',          'hex': '00FF00', 'hue': '2', 'lightness': '1'}
                , {'name': 'dark green',     'hex': '00C000', 'hue': '2', 'lightness': '2'}
                , {'name': 'light cyan',     'hex': 'C0FFFF', 'hue': '3', 'lightness': '0'}
                , {'name': 'cyan',           'hex': '00FFFF', 'hue': '3', 'lightness': '1'}
                , {'name': 'dark cyan',      'hex': '00C0C0', 'hue': '3', 'lightness': '2'}
                , {'name': 'light blue',     'hex': 'C0C0FF', 'hue': '4', 'lightness': '0'}
                , {'name': 'blue',           'hex': '0000FF', 'hue': '4', 'lightness': '1'}
                , {'name': 'dark blue',      'hex': '0000C0', 'hue': '4', 'lightness': '2'}
                , {'name': 'light magenta',  'hex': 'FFC0FF', 'hue': '5', 'lightness': '0'}
                , {'name': 'magenta',        'hex': 'FF00FF', 'hue': '5', 'lightness': '1'}
                , {'name': 'dark magenta',   'hex': 'C000C0', 'hue': '5', 'lightness': '2'}
        	],

            controlColours: {
                 'white': {'name': 'white',          'hex': '#FFFFFF', 'hue': '', 'lightness': ''}
                , 'black': {'name': 'black',          'hex': '#000000', 'hue': '', 'lightness': ''}
            },

            execution: [
                  {'dp': 'right', 'cc': 'left',  'codelChosen': 'uppermost'}
                , {'dp': 'right', 'cc': 'right', 'codelChosen': 'lowermost'}
                , {'dp': 'down',  'cc': 'left',  'codelChosen': 'rightmost'}
                , {'dp': 'down',  'cc': 'right', 'codelChosen': 'leftmost'}
                , {'dp': 'left',  'cc': 'left',  'codelChosen': 'lowermost'}
                , {'dp': 'left',  'cc': 'right', 'codelChosen': 'uppermost'}
                , {'dp': 'up',    'cc': 'left',  'codelChosen': 'leftmost'}
                , {'dp': 'up',    'cc': 'right', 'codelChosen': 'rightmost'}
            ]
		}

		return scope;
}]);
//
// var app = (function() {
//
//     var self = this;
//
//     var itpr = interpreter;
//     var input = document.getElementById("input");
//     var stackView = document.getElementById("stackView");
//     var commandView = document.getElementById("commandView");
//     var output = document.getElementById("output");
//
//     itpr.start();
//
//     //dasdasd
//     input.focus();
//
//     function command(type) {
//
//
//         switch (type) {
//             case "start":
//                 itpr.start();
//                 output.value = "";
//                 break;
//             case "push":
//                 itpr.push(getInputValue());
//                 break;
//             case "pop":
//                 itpr.pop();
//                 break;
//             case "add":
//                 itpr.add();
//                 break;
//             case "subtract":
//                 itpr.subtract();
//                 break;
//             case "multiply":
//                 itpr.multiply();
//                 break;
//             case "divide":
//                 itpr.divide();
//                 break;
//             case "duplicate":
//                 itpr.duplicate();
//                 break;
//             case "roll":
//                 itpr.roll();
//                 break;
//             case "outN":
//                 STDOUT(itpr.outN());
//                 break;
//             case "outC":
//                 STDOUT(itpr.outC());
//                 break;
//             default:
//                 break;
//         }
//         printStack();
//         printCommandChain();
//
//         self.input.focus();
//         self.input.value = "";
//     };
//
//     function getInputValue() {
//         // Get input value
//         var n = self.input.value;
//
//         // Read characters as ascii char code
//         if (isNaN(n)) {
//             if (n.length === 1) {
//                 n = n.charCodeAt(0);
//             }
//             else if (n === "\\n") {
//                 n = 10;
//             }
//         }
//
//         return parseInt(n);
//     }
//
//     function printStack() {
//         var stackText = "";
//         var stack = itpr.stack();
//         for (var i = stack.length - 1; i > -1; i--)
//         {
//             stackText += i + ": " + stack[i] + "\n";
//         }
//         self.stackView.innerText = stackText;
//     };
//
//     function printCommandChain() {
//         var commandChainText = "";
//         var commandChain = itpr.commandChain();
//         for (var i = commandChain.length - 1; i > -1; i--)
//         {
//             commandChainText += i + ": " + commandChain[i] + "\n";
//         }
//         self.commandView.innerText = commandChainText;
//     };
//
//     function STDOUT(value) {
//         self.output.value += value;
//     }
//
//     return {
//         action: command
//     };
//
// })();

var Data = (function(exports)
{
    export.commands = {
          {'name': 'push',      'hueChange': '0', 'lightnessChange': '1', 'description': 'Pushes the value of the colour block just exited on to the stack. Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.'}
        , {'name': 'pop',       'hueChange': '0', 'lightnessChange': '2', 'description': 'Pops the top value off the stack and discards it.'}
        , {'name': 'add',       'hueChange': '1', 'lightnessChange': '0', 'description': 'Pops the top two values off the stack, adds them, and pushes the result back on the stack.'}
        , {'name': 'subtract',  'hueChange': '1', 'lightnessChange': '1', 'description': 'Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.'}
        , {'name': 'multiply',  'hueChange': '1', 'lightnessChange': '2', 'description': 'Pops the top two values off the stack, multiplies them, and pushes the result back on the stack.'}
        , {'name': 'divide',    'hueChange': '2', 'lightnessChange': '0', 'description': 'Pops the top two values off the stack, calculates the integer division of the second top value by the top value, and pushes the result back on the stack. If a divide by zero occurs, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
        , {'name': 'mod',       'hueChange': '2', 'lightnessChange': '1', 'description': 'Pops the top two values off the stack, calculates the second top value modulo the top value, and pushes the result back on the stack. The result has the same sign as the divisor (the top value). If the top value is zero, this is a divide by zero error, which is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
        , {'name': 'not',       'hueChange': '2', 'lightnessChange': '2', 'description': 'Replaces the top value of the stack with 0 if it is non-zero, and 1 if it is zero.'}
        , {'name': 'greater',   'hueChange': '3', 'lightnessChange': '0', 'description': 'Pops the top two values off the stack, and pushes 1 on to the stack if the second top value is greater than the top value, and pushes 0 if it is not greater.'}
        , {'name': 'pointer',   'hueChange': '3', 'lightnessChange': '1', 'description': 'Pops the top value off the stack and rotates the DP clockwise that many steps (anticlockwise if negative).'}
        , {'name': 'switch',    'hueChange': '3', 'lightnessChange': '2', 'description': 'Pops the top value off the stack and toggles the CC that many times (the absolute value of that many times if negative).'}
        , {'name': 'duplicate', 'hueChange': '4', 'lightnessChange': '0', 'description': 'Pushes a copy of the top value on the stack on to the stack.'}
        , {'name': 'roll',      'hueChange': '4', 'lightnessChange': '1', 'description': 'Pops the top two values off the stack and "rolls" the remaining stack entries to a depth equal to the second value popped, by a number of rolls equal to the first value popped. A single roll to depth n is defined as burying the top value on the stack n deep and bringing all values above it up by 1 place. A negative number of rolls rolls in the opposite direction. A negative depth is an error and the command is ignored. If a roll is greater than an implementation-dependent maximum stack depth, it is handled as an implementation-dependent error, though simply ignoring the command is recommended.'}
        , {'name': 'inN',       'hueChange': '4', 'lightnessChange': '2', 'description': 'Reads a value from STDIN as a number and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.'}
        , {'name': 'inC',       'hueChange': '5', 'lightnessChange': '0', 'description': 'Reads a value from STDIN as a character and pushes it on to the stack. If no input is waiting on STDIN, this is an error and the command is ignored. If an integer read does not receive an integer value, this is an error and the command is ignored.'}
        , {'name': 'outN',      'hueChange': '5', 'lightnessChange': '1', 'description': 'Pops the top value off the stack and prints it to STDOUT as a number.'}
        , {'name': 'outC',      'hueChange': '5', 'lightnessChange': '2', 'description': 'Pops the top value off the stack and prints it to STDOUT as a character.'}
    }

    export.colours = {
          {'name': 'light red',      'hex': '#FFC0C0', 'hue': '0', 'lightness': '0'}
        , {'name': 'red',            'hex': '#FF0000', 'hue': '0', 'lightness': '1'}
        , {'name': 'dark red',       'hex': '#C00000', 'hue': '0', 'lightness': '2'}
        , {'name': 'light yellow',   'hex': '#FFFFC0', 'hue': '1', 'lightness': '0'}
        , {'name': 'yellow',         'hex': '#FFFF00', 'hue': '1', 'lightness': '1'}
        , {'name': 'dark yellow',    'hex': '#C0C000', 'hue': '1', 'lightness': '2'}
        , {'name': 'light green',    'hex': '#C0FFC0', 'hue': '2', 'lightness': '0'}
        , {'name': 'green',          'hex': '#00FF00', 'hue': '2', 'lightness': '1'}
        , {'name': 'dark green',     'hex': '#00C000', 'hue': '2', 'lightness': '2'}
        , {'name': 'light cyan',     'hex': '#C0FFFF', 'hue': '3', 'lightness': '0'}
        , {'name': 'cyan',           'hex': '#00C0C0', 'hue': '3', 'lightness': '1'}
        , {'name': 'dark cyan',      'hex': '#C00000', 'hue': '3', 'lightness': '2'}
        , {'name': 'light blue',     'hex': '#C0C0FF', 'hue': '4', 'lightness': '0'}
        , {'name': 'blue',           'hex': '#0000FF', 'hue': '4', 'lightness': '1'}
        , {'name': 'dark blue',      'hex': '#0000C0', 'hue': '4', 'lightness': '2'}
        , {'name': 'light magenta',  'hex': '#FFC0FF', 'hue': '5', 'lightness': '0'}
        , {'name': 'magenta',        'hex': '#FF00FF', 'hue': '5', 'lightness': '1'}
        , {'name': 'dark magenta',   'hex': '#C000C0', 'hue': '5', 'lightness': '2'}
        , {'name': 'white',          'hex': '#FFFFFF', 'hue': '', 'lightness': ''}
        , {'name': 'black',          'hex': '#000000', 'hue': '', 'lightness': ''}
    }

    export.directions = ['right', 'down', 'left', 'up'];

    export.execution = {
          {'dp': 'right', 'cc': 'left',  'codelChosen': 'uppermost'}
        , {'dp': 'right', 'cc': 'right', 'codelChosen': 'lowermost'}
        , {'dp': 'down',  'cc': 'left',  'codelChosen': 'rightmost'}
        , {'dp': 'down',  'cc': 'right', 'codelChosen': 'leftmost'}
        , {'dp': 'left',  'cc': 'left',  'codelChosen': 'lowermost'}
        , {'dp': 'left',  'cc': 'right', 'codelChosen': 'uppermost'}
        , {'dp': 'up',    'cc': 'left',  'codelChosen': 'leftmost'}
        , {'dp': 'up',    'cc': 'right', 'codelChosen': 'rightmost'}
    }

    return {
        commands: export.commands,
        colours: export.colours,
        execution: export.execution
    }

})(typeof exports === 'undefined'? this['Data']={}: exports);

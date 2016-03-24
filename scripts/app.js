var stack = [];

// push: Pushes the value of the colour block just exited on to the stack.
// Note that values of colour blocks are not automatically pushed on to the stack - this push operation must be explicitly carried out.
// Hue: +0, Lightness: +1
var push = function() {
    // TODO: limit to numeric
    var n = parseInt(document.getElementById("input").value);
    stack.push(n);

}

// pop: Pops the top value off the stack and discards it.
// Hue: +0, Lightness: +2
var pop = function() {
    var top = stack[0];
    stack.pop();
    return top;
}

// add: Pops the top two values off the stack, adds them, and pushes the result back on the stack.
// Hue: +1, Lightness: +0
var add = function() {
    var a = pop();
    var b = pop();
    stack.push(a + b);
}

// subtract: Pops the top two values off the stack, calculates the second top value minus the top value, and pushes the result back on the stack.
// Hue: +1, Lightness: +1
var subtract = function() {
    var a = pop();
    var b = pop();
    stack.push(b - a);
}

var printStack = function() {
    // TODO: replace with Anglular bindings
    var stackText = "";
    for (var i = stack.length - 1; i > -1; i--)
    {
        stackText += i + ": " stack[i] + "\n";
    }
    document.getElementById("stackView").innerText = stackText;
}

var app = (function() {

    var self = this;

    var itpr = interpreter;
    var input = document.getElementById("input");
    var stackView = document.getElementById("stackView");
    var commandView = document.getElementById("commandView");
    var output = document.getElementById("output");

    itpr.start();

    //dasdasd
    input.focus();

    function command(type) {
        var n = parseInt(self.input.value);

        switch (type) {
            case "start":
                itpr.start();
                output.value = "";
                break;
            case "push":
                itpr.push(n);
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
            case "outN":
                STDOUT(itpr.outN());
                break;
            case "outC":
                STDOUT(itpr.outC());
                break;
            default:
                break;
        }
        printStack();
        printCommandChain();

        self.input.focus();
        self.input.value = "";
    };

    function printStack() {
        var stackText = "";
        var stack = itpr.stack();
        for (var i = stack.length - 1; i > -1; i--)
        {
            stackText += i + ": " + stack[i] + "\n";
        }
        self.stackView.innerText = stackText;
    };

    function printCommandChain() {
        var commandChainText = "";
        var commandChain = itpr.commandChain();
        for (var i = commandChain.length - 1; i > -1; i--)
        {
            commandChainText += i + ": " + commandChain[i] + "\n";
        }
        self.commandView.innerText = commandChainText;
    };

    function STDOUT(value) {
        self.output.value += value;
    }

    return {
        action: command
    };

})();

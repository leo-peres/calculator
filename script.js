/*
************************************************************************************************
HTML elements
*/

const display = document.querySelector(".display");

const buttonContainer = document.querySelector(".button-container");

/*
************************************************************************************************
*/

/*
************************************************************************************************
Button event listeners
*/

buttonContainer.addEventListener("click", (evt) => {
    let target = evt.target;
    if(target.classList.contains("number-button")) {
        let number_pressed = parseInt(target.innerText);
        displayUpdate(number_pressed);
    }
    else if(target.classList.contains("op-button")) {
        let operator = target.innerText;
        handleOpButton(operator);
    }
    else if(target.classList.contains("eq-button")) {
        handleEqButton();
    }
    else if(target.classList.contains("clear-button")) {
        clearCalculator();
    }
});


/*
************************************************************************************************
*/

const maxDigits = 12;

const operation = {
    operand1: 0,
    operand2: null,
    operand1Ready: false,
    operand2Ready: false,
    newOperand: false,
    operator: '=',
    operate: function () {
        let op1 = this.operand1;
        let op2 = this.operand2;
        if(op1 !== undefined && op2 !== undefined) {
            let op = this.operator;
            switch(op) {
                case '+':
                    this.result = this.sum(op1, op2);
                    break;
                case '-':
                    this.result = this.sum(op1, -op2);
                    break;
                case '*':
                    this.result = this.product(op1, op2);
                    break;
                case '/':
                    this.result = this.divide(op1, op2);
                    break;
                case '=':
                    this.result = op2;
            }
        }
    },
    sum: (op1, op2) => op1 + op2,
    product: (op1, op2) => op1*op2,
    divide: (op1, op2) => op1/op2
};

function displayUpdate(input) {

    let currentNumber = parseInt(display.innerText);
    if(operation.newOperand) {
        operation.operand1 = currentNumber;
        operation.operand1Ready = true;
        display.innerText = input;
        operation.newOperand = false;
        operation.operand2Ready = true;
    }
    else if(currentNumber < (10**(maxDigits - 1))) {
        currentNumber = 10*currentNumber + input;
        display.innerText = currentNumber;
    }

}

function handleOpButton(operator) {

    if(!operation.operand1Ready) {
        operation.newOperand = true;
    }
    else if(operation.operand2Ready) {
        operation.operand2 = parseInt(display.innerText);
        operation.operate();
        display.innerText = operation.result;
        operation.operand1 = operation.result;
        operation.operand2Ready = false;
        operation.newOperand = true;
    }

    operation.operator = operator;

}

function clearCalculator() {
    operation.operand1 = 0;
    operation.operand2 = null;
    operation.operand1Ready = false;
    operation.operand2Ready = false;
    operation.newOperand = false;
    operation.operator = '=';
    display.innerText = '0';
}
/*
************************************************************************************************
HTML elements
*/

const display = document.querySelector(".display");

const scientificNotationBase = document.querySelector(".scientific-notation-base");
const scientificNotationExponent = document.querySelector(".scientific-notation-exponent");

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
        let number_pressed = parseFloat(target.innerText);
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
    else if(target.classList.contains("del-button")) {
        if(display.innerText !== '0' && !operation.newOperand) {
            display.innerText = display.innerText.slice(0, -1) || '0';
            operation.operand2 = parseDisplayText(display.innerText);
        }
    }
});


/*
************************************************************************************************
*/

const displayCapacity = 9;

const operation = {
    operand1: null,
    operand2: 0,
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

    //let currentNumber = operation.operand2;
    let displayText = display.innerText;
    if(operation.newOperand) {

        //operation.operand1 = currentNumber;
        //operation.operand1 = parseDisplayText(displayText);
        operation.operand1 = operation.operand2;
        operation.operand2 = input;
        operation.operand1Ready = true;
        display.innerText = input;
        operation.newOperand = false;
        operation.operand2Ready = true;

        clearScientificNotation();

    }
    else if(!displayFull()) {
        //currentNumber = 10*currentNumber + input;
        displayText = displayText === '0' ? input : displayText + input;
        //operation.operand2 = currentNumber;
        operation.operand2 = parseDisplayText(displayText);
        display.innerText = displayText;
    }

}

function handleOpButton(operator) {

    if(operation.operand1Ready) {
        operation.operate();
        display.innerText = roundNumberToDisplay(operation.result);
        operation.operand2 = operation.result;
        operation.operand1Ready = false;
        operation.newOperand = true;
    }
    else {
        operation.newOperand = true;
    }

    operation.operator = operator;

}

function clearCalculator() {

    operation.operand1 = null;
    operation.operand2 = 0;
    operation.operand1Ready = false;
    operation.operand2Ready = false;
    operation.newOperand = false;
    operation.operator = '=';
    display.innerText = '0';

    clearScientificNotation();

}

/*
************************************************************************************************
*/

function parseDisplayText(displayText) {

    if(displayText == '-.' || displayText == '.')
        return 0;
    else {

        let exponent = Number(scientificNotationExponent.innerText);

        return Number(displayText)

    }

}

function displayFull() {
    return display.innerText.length >= displayCapacity;
}

function roundNumberToDisplay(x) {

    let xString = String(x);
    const xArr = xString.split('');

    let dotIndex = xArr.indexOf('.');
    let eIndex = xArr.indexOf('e');
    if(eIndex != -1) {

        let exponent = xArr.slice(eIndex+1);

        if(exponent[0] == '+')
            exponent.shift();

        scientificNotationBase.innerText = "x10";
        scientificNotationExponent.innerText = exponent.join('');

        //too lazy to properly round the number
        //might do it later
        let coefficient = xArr.slice(0, eIndex).slice(0, displayCapacity);    

        coefficient = removeTrailingZeros(coefficient)
        if(coefficient[coefficient.length - 1] == '.')
            coefficient.pop();

        return coefficient.join('');

    }

    displayScientificNotation(x);

    if(dotIndex != - 1) {

        if(dotIndex > displayCapacity)
            return largeMagnitudeToDisplay(x);

        const truncArr = xArr.slice(0, displayCapacity);
        if(!truncArr.includes('.'))
            return truncArr.join('');
        else
            return removeTrailingZeros(truncArr).join('');

    }
    else {

        if(xArr.length > displayCapacity)
            return largeMagnitudeToDisplay(x);

        return xArr.join('');

    }

}

function largeMagnitudeToDisplay(x) {

    let xString = String(x);
    let xArr = xString.split('');

    let negativeSign = xArr[0] == '-' ? 1 : 0;

    let decimals = removeTrailingZeros(xArr.slice(1 + negativeSign, (displayCapacity - 1) - negativeSign));
    if(decimals.length > 0)
        return xArr.slice(0, negativeSign + 1).concat('.', decimals).join('');
    else
        return xArr.slice(0, negativeSign + 1).join('');

}

function displayScientificNotation(x) {

    if(x == 0) {
        clearScientificNotation();
        return;
    }

    let exponent = Math.trunc(Math.log10(Math.abs(x)));

    let negative = x < 0 ? 1 : 0;

    if(exponent <= 1 - (displayCapacity - negative) || exponent >= displayCapacity - negative) {
        scientificNotationBase.innerText = "x10";
        scientificNotationExponent.innerText = exponent;  
    }
    else
        clearScientificNotation();

}

function removeTrailingZeros(arr) {
    return arr.filter((x, i, arr) => !arr.slice(i).every(y => y === '0'));
}

function clearScientificNotation() {
    scientificNotationBase.innerText = "";
    scientificNotationExponent.innerText = "";
}
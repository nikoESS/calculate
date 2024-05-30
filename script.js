document.addEventListener('DOMContentLoaded', function () {
    const calculator = document.querySelector('.calculator');
    const keys = calculator.querySelector('.calculator-keys');
    const display = calculator.querySelector('.calculator-screen');

    keys.addEventListener('click', event => {
        const { target } = event;
        const { value } = target;
        if (!target.matches('button')) {
            return;
        }

        if (displayValue === "Error" && value !== 'all-clear') {
            return;
        }

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
                handleOperator(value);
                break;
            case '=':
                calculate();
                break;
            case 'all-clear':
                clear();
                break;
            case '.':
                inputDecimal(value);
                break;
            case 'sqrt':
                calculateSqrt();
                break;
            case '±':
                toggleSign();
                break;
            case 'backspace':
                backspace();
                break;
            default:
                if (Number.isInteger(parseFloat(value))) {
                    inputNumber(value);
                }
        }

        updateDisplay();
    });

    let displayValue = '0';
    let firstOperand = null;
    let secondOperand = false;
    let currentOperator = null;
    const maxDigits = 15;

    function updateDisplay() {
        display.value = displayValue;
    }

    function clear() {
        displayValue = '0';
        firstOperand = null;
        secondOperand = false;
        currentOperator = null;
    }

    function inputNumber(number) {
        if (displayValue.length >= maxDigits) {
            return;
        }
        if (secondOperand) {
            displayValue = number;
            secondOperand = false;
        } else {
            displayValue = displayValue === '0' ? number : displayValue + number;
        }
    }

    function inputDecimal(dot) {
        if (displayValue.length >= maxDigits) {
            return;
        }
        if (secondOperand) {
            displayValue = '0.';
            secondOperand = false;
            return;
        }
        if (!displayValue.includes(dot)) {
            displayValue += dot;
        }
    }

    function toggleSign() {
        if (displayValue === '0') {
            return;
        }
        displayValue = (displayValue.charAt(0) === '-') ? displayValue.slice(1) : '-' + displayValue;
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);

        if (currentOperator && secondOperand) {
            currentOperator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (currentOperator) {
            const result = operate(firstOperand, inputValue, currentOperator);

            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }

        secondOperand = true;
        currentOperator = nextOperator;
    }

    function calculate() {
        if (currentOperator && secondOperand !== null) {
            const secondOperandValue = parseFloat(displayValue);
            if (currentOperator === '/' && secondOperandValue === 0) {
                displayValue = "Error";
            } else {
                displayValue = `${parseFloat(operate(firstOperand, secondOperandValue, currentOperator).toFixed(7))}`;
                firstOperand = parseFloat(displayValue);
            }
            currentOperator = null;
            secondOperand = false;
        }
    }

    function calculateSqrt() {
        const inputValue = parseFloat(displayValue);
        if (inputValue >= 0) {
            displayValue = `${Math.sqrt(inputValue).toFixed(7)}`;
            firstOperand = parseFloat(displayValue);
            currentOperator = null;
            secondOperand = false;
        } else {
            displayValue = "Error";
        }
    }

    function operate(first, second, operator) {
        switch (operator) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                return first / second;
            case '^':
                return Math.pow(first, second);
            default:
                return second;
        }
    }

    function backspace() {
        displayValue = displayValue.slice(0, -1); // Удаляем последний символ
        if (displayValue === '') {
            displayValue = '0'; // Если больше символов нет, устанавливаем значение 0
        }
    }
});

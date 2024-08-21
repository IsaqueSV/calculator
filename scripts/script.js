let previousAnswer = 0;
let initialAction = false;

const arraySpecialKeys = ["(", ")", "Backspace", ",", ".", "Ans", "Enter", "NumpadEnter", "="]; // IDs = [0, 1, 2, 3, 3, 4, 5, 5, 5]
const arrayNumericOperators = ["+", "-", "x", "X", "*", "/"]; // IDs = [0, 1, 2, 2, 2, 3]

let calculatorKeys = document.querySelectorAll(".calculatorKey");
let acCeButton = document.querySelector("#specialKey2");
let pPreviousAnswerScreen = document.querySelector("#screenPreviousAnswer p");

calculatorKeys.forEach(function(calculatorKey) {
    calculatorKey.onclick = function() { clickedButton(this);  }
});

function clickedButton(button) {
    button.classList.add("keyPressed");
    setTimeout(() => { button.classList.remove("keyPressed"); }, "100");

    if (button.classList.contains("socialMediaKey")) {
        switch (button.id) {
            case "linkedin":
                window.location.href = "https://www.linkedin.com/in/isaque-venancio"; break;
            case "github":
                window.location.href = "https://github.com/isaquesv"; break;
            case "instagram":
                window.location.href = "https://www.instagram.com/isaquesv05/"; break;
        }
    }
    else {
        calculatorAction(button);
    }
}

document.addEventListener("keydown", function(event) {
    keyPressAction(event.key);
});

function keyPressAction(keyPressed) {
    const acceptedKeys = {
        numericKeys(keyPressedId) {
            clickedButton(document.querySelector(`#numericKey${keyPressedId}`));
        },
        specialKeys(keyPressedId) {
            clickedButton(document.querySelector(`#specialKey${keyPressedId}`));
        },
        numericOperators(keyPressedId) {
            clickedButton(document.querySelector(`#numericOperator${keyPressedId}`));
        }
    }

    switch (true) {
        case !isNaN(keyPressed):
            acceptedKeys.numericKeys(keyPressed);
            break;

        case arraySpecialKeys.includes(keyPressed):
            let specialKeyId;

            switch (keyPressed) {
                case "(":
                    specialKeyId = 0; break;
                case ")":
                    specialKeyId = 1; break;
                case "Backspace":
                    specialKeyId = 2; break;
                case ",": case ".":
                    specialKeyId = 3; break;
                case "Enter": case "NumpadEnter": case "=":
                    specialKeyId = 5; break;
            }
            acceptedKeys.specialKeys(specialKeyId);
            break;

        case arrayNumericOperators.includes(keyPressed):
            let numericOperatorsId;

            switch (keyPressed) {
                case "+":
                    numericOperatorsId = 0; break;
                case "-":
                    numericOperatorsId = 1; break;
                case "x": case "X": case "*":
                    numericOperatorsId = 2; break;
                case "/":
                    numericOperatorsId = 3; break;
            }
            acceptedKeys.numericOperators(numericOperatorsId);
            break;
    }
}

function calculatorAction(button) {
    let buttonValue = button.innerHTML;

    if (initialAction == false) {
        document.querySelector("#screenPreviousAnswer p").textContent = "Ans = " + previousAnswer;
        acCeButton.textContent = "CE";
        initialAction = true;
    }

    let pCurrentCalculationScreen = document.querySelector("#screenCurrentCalculation p");
    let pPreviousAnswerScreen = document.querySelector("#screenPreviousAnswer p");
    let lastValueEntered = pCurrentCalculationScreen.textContent.slice(-1);
    let penultimateValueEntered = pCurrentCalculationScreen.textContent.slice(-2, -1);
    let fourthLastValueEntered = pCurrentCalculationScreen.textContent.slice(-4, -3);

    if (buttonValue != "Enter")
        acCeButton.textContent = "CE";
    
    // Para casos onde o ultimo valor é "NaN", "Infinity" ou "-Infinity"
    if (lastValueEntered == "N" || lastValueEntered == "y") {
        pCurrentCalculationScreen.textContent = 0;
        pPreviousAnswerScreen.textContent = "Ans = 0";
        previousAnswer = 0;
    }

    const allActions = {
        addingValue(displayValue) {
            pCurrentCalculationScreen.textContent += displayValue;
        },
        removingValue(displayValue) {
            pCurrentCalculationScreen.textContent = displayValue;
        },
        clearingCalculatorScreen() {
            pCurrentCalculationScreen.textContent = 0;
            pPreviousAnswerScreen.textContent = `Ans = ${previousAnswer}`;
        },
        replacingValues(previousAnswer) {
            pCurrentCalculationScreen.textContent = pCurrentCalculationScreen.textContent.replace(/\s/g, "");
            pCurrentCalculationScreen.textContent = pCurrentCalculationScreen.textContent.replace(/x/g, "*");
            pCurrentCalculationScreen.textContent = pCurrentCalculationScreen.textContent.replace(/Ans/g, previousAnswer);
            pCurrentCalculationScreen.textContent = pCurrentCalculationScreen.textContent.replace(/(\d)\(/g, "$1*(");

            allActions.evalAction(eval(pCurrentCalculationScreen.textContent));
        },
        evalAction(resultOfCalculation) {
            resultOfCalculation = resultOfCalculation.toString();

            if (resultOfCalculation.includes(".")) {
                let decimalQuantity;
            
                if (resultOfCalculation.split(".")[1].length >= 4)
                    decimalQuantity = 4;
                else
                    decimalQuantity = resultOfCalculation.split(".")[1].length;
            
                const scaleFactor  = Math.pow(10, decimalQuantity);
                resultOfCalculation = Math.round(parseFloat(resultOfCalculation) * scaleFactor ) / scaleFactor ;
            }
            
            if (resultOfCalculation < 0) {
                resultOfCalculation = resultOfCalculation.toString();
                resultOfCalculation = `${resultOfCalculation.slice(0, 1)} ${resultOfCalculation.slice(1)}`;
            }

            allActions.updatingValues(resultOfCalculation);
        },
        updatingValues(resultOfCalculation) {
            lastValueEntered = pCurrentCalculationScreen.textContent.slice(-1);
            penultimateValueEntered = pCurrentCalculationScreen.textContent.slice(-2, -1);
            
            pCurrentCalculationScreen.textContent = resultOfCalculation;
            if (pCurrentCalculationScreen.textContent != "")
                previousAnswer = resultOfCalculation;

            allActions.loggingCalculation(calculationFormula, resultOfCalculation)
        },
        loggingCalculation(calculationFormula, resultOfCalculation) {
            const noCalculationWarningSpan = document.querySelector("#historyContainer div span");
            let hasNumericOperator = false;
            
            for (let i = 0; i < arrayNumericOperators.length; i++) {
                if (calculationFormula.indexOf(arrayNumericOperators[i]) > -1) {
                    hasNumericOperator = true;
                    break;
                }
            }

            if (hasNumericOperator) {
                if (!noCalculationWarningSpan.classList.contains("d-none"))
                    noCalculationWarningSpan.classList.add("d-none");
    
                allActions.creatingCalculationLogElement(calculationFormula, resultOfCalculation, previousAnswer);
            }
            else {
                pPreviousAnswerScreen.textContent = "Ans = " + previousAnswer;
                acCeButton.textContent = "CE";
            }
        },
        creatingCalculationLogElement(calculationFormula, resultOfCalculation, previousAnswer) {
            let divHistoryEntry = document.createElement("div");
            divHistoryEntry.classList.add("divHistoryEntry", "pe-2", "ps-2", "mb-3");
            divHistoryEntry.textContent = calculationFormula + " = " + resultOfCalculation;

            divHistoryEntry.onclick = function() {
                if (!isNaN(resultOfCalculation) && resultOfCalculation != "Infinity" && resultOfCalculation != "-Infinity") {
                    if (pCurrentCalculationScreen.textContent.split(" ").length - 1 > 1) {
                        if (eval(resultOfCalculation) < 0)
                            allActions.addingValue(` (${resultOfCalculation})`);
                        else if (pCurrentCalculationScreen.textContent.slice(-1) == " " || pCurrentCalculationScreen.textContent.substring(pCurrentCalculationScreen.textContent.lastIndexOf(" ") + 1).includes(".") || pCurrentCalculationScreen.textContent.substring(pCurrentCalculationScreen.textContent.lastIndexOf(" ") + 1) > 0)
                            allActions.addingValue(resultOfCalculation);
                    }
                    else if (lastValueEntered == "(")
                        allActions.addingValue(resultOfCalculation);
                    else
                        allActions.removingValue(resultOfCalculation);
                }
            }

            document.querySelector("#historyContainer div").appendChild(divHistoryEntry);
            document.querySelector("#historyContainer div").scrollTop = document.querySelector("#historyContainer div").scrollHeight;
        
            pPreviousAnswerScreen.textContent = "Ans = " + previousAnswer;
            acCeButton.textContent = "AC";
        }
    }

    if (buttonValue == "AC" || buttonValue == "CE") buttonValue = "Backspace";

    switch (true) {
        case !isNaN(buttonValue):
            switch (buttonValue) {
                case 0:
                    if (lastValueEntered == "y")
                        allActions.addingValue(` ${buttonValue}`);
                    else if (lastValueEntered == " " || (pCurrentCalculationScreen.textContent.split(" ").length - 1 == 0 && (pCurrentCalculationScreen.textContent.includes(".") || pCurrentCalculationScreen.textContent > 0)) || pCurrentCalculationScreen.textContent.split(" ").length - 1 > 0 && (pCurrentCalculationScreen.textContent.substring(pCurrentCalculationScreen.textContent.lastIndexOf(" ") + 1).includes(".") || pCurrentCalculationScreen.textContent.substring(pCurrentCalculationScreen.textContent.lastIndexOf(" ") + 1) > 0))
                        allActions.addingValue(buttonValue);
                    break;

                default:
                    if (((pCurrentCalculationScreen.textContent.length == 1 && pCurrentCalculationScreen == 0) && lastValueEntered != ".") || (pCurrentCalculationScreen.textContent.length == 1 && lastValueEntered == 0))
                        allActions.removingValue(buttonValue);
                    else if (lastValueEntered != "s")
                        allActions.addingValue(buttonValue);
                    else
                        allActions.addingValue(` x ${buttonValue}`);
                    break;
            }
            break;

        case arraySpecialKeys.includes(buttonValue):
            switch (buttonValue) {
                case "(":
                    if (pCurrentCalculationScreen.textContent.length == 1 && lastValueEntered == 0)
                        allActions.removingValue(buttonValue);
                    else if (arrayNumericOperators.includes(penultimateValueEntered))
                        allActions.addingValue(` ${buttonValue}`);
                    else if ((!isNaN(lastValueEntered) && pCurrentCalculationScreen.textContent != 0) || lastValueEntered == "s")                        
                        allActions.addingValue(" x (");
                    break;
                
                case ")":
                    var openingParenthesisCounter = pCurrentCalculationScreen.textContent.split("(").length - 1;
                    var closingParenthesisCounter = pCurrentCalculationScreen.textContent.split(")").length - 1;

                    if (openingParenthesisCounter > 0 && openingParenthesisCounter > closingParenthesisCounter && (lastValueEntered != buttonValue))
                        allActions.addingValue(buttonValue);
                    break;

                case "Backspace":
                    if (button.innerHTML == "AC")
                        allActions.clearingCalculatorScreen();
                    else if (button.innerHTML == "CE") {
                        if (lastValueEntered == "" || lastValueEntered == " " || lastValueEntered == "s" || lastValueEntered == "N" || arrayNumericOperators.includes(lastValueEntered))
                            allActions.removingValue(pCurrentCalculationScreen.textContent.substring(0, pCurrentCalculationScreen.textContent.length - 3));
                        else if (lastValueEntered == "y")
                            allActions.removingValue(pCurrentCalculationScreen.textContent.substring(0, pCurrentCalculationScreen.textContent.length - 8));
                        // Se o ultimo valor presente no resultado tiver um tamanho de caracteres maior que 12
                        else if (pCurrentCalculationScreen.textContent.split(" ")[pCurrentCalculationScreen.textContent.split(" ").length - 1].includes("e"))
                        // Substitui o ultimo valor por ""
                            allActions.removingValue(pCurrentCalculationScreen.textContent.replace(/\b\d+(\.\d+)?e[+-]?\d+\b\s*$/, ""));
                        else
                            allActions.removingValue(pCurrentCalculationScreen.textContent.substring(0, pCurrentCalculationScreen.textContent.length - 1));
                
                        if (pCurrentCalculationScreen.textContent == "")
                            pCurrentCalculationScreen.textContent = 0;
                    }
                    break;

                case ".":
                    let emptySpacesCounter;
                    let decimalPointCounter = pCurrentCalculationScreen.textContent.split(".").length - 1;
                
                    if (lastValueEntered != " ") {
                        if (pCurrentCalculationScreen.textContent.split(" ").length - 1 == 0)
                            emptySpacesCounter = 1;
                        else
                            emptySpacesCounter = 1 + pCurrentCalculationScreen.textContent.split(" ").length - 1;
                
                        if (emptySpacesCounter > 0 && emptySpacesCounter > decimalPointCounter && (lastValueEntered != "(" && lastValueEntered >= 0))
                            allActions.addingValue(buttonValue);
                    }
                    break;

                case "Ans":
                    if (pCurrentCalculationScreen == 0 && lastValueEntered != "." && arrayNumericOperators.includes(penultimateValueEntered))
                        allActions.removingValue(buttonValue);
                    else if (lastValueEntered == "s" || (lastValueEntered != "." && lastValueEntered != "(" && !arrayNumericOperators.includes(penultimateValueEntered)))
                        allActions.addingValue(` x ${buttonValue}`);
                    else
                        allActions.addingValue(buttonValue);
                    break;

                case "=":
                    if (lastValueEntered != " " && lastValueEntered != "(") {
                        if (pCurrentCalculationScreen.textContent != 0) {
                            var openingParenthesisCounter = pCurrentCalculationScreen.textContent.split("(").length - 1;
                            var closingParenthesisCounter = pCurrentCalculationScreen.textContent.split(")").length - 1;
            
                            if (openingParenthesisCounter > closingParenthesisCounter) {
                                openingParenthesisCounter - closingParenthesisCounter;
                                for (i = 0; i < openingParenthesisCounter; i++) {
                                    allActions.addingValue(")");
                                }
                            }
            
                            var calculationFormula = pCurrentCalculationScreen.textContent;
                            pPreviousAnswerScreen.textContent = calculationFormula;
                            allActions.replacingValues(previousAnswer);
                        }
                    }
                    break;   
            }    
        
        case arrayNumericOperators.includes(buttonValue):
            switch (buttonValue) {
                case "+":
                    if (pCurrentCalculationScreen.textContent.length > 0 && lastValueEntered != "." && lastValueEntered != "(" && !arrayNumericOperators.includes(penultimateValueEntered))
                        allActions.addingValue(` ${buttonValue} `);
                    else if (pCurrentCalculationScreen.textContent.length > 0 && lastValueEntered != "(" && fourthLastValueEntered != "(" && penultimateValueEntered == "-" && penultimateValueEntered != "/" && penultimateValueEntered != "x") {
                    // Remove os últimos 3 caracteres
                        allActions.addingValue(pCurrentCalculationScreen.textContent.substring(0, pCurrentCalculationScreen.textContent.length - 3), 0);
                        allActions.addingValue(` ${buttonValue} `);
                    }
                    else if (lastValueEntered == "y")
                        allActions.addingValue(` ${buttonValue} `);
                    break;

                case "-":
                    if (pCurrentCalculationScreen.textContent.length == 1 && lastValueEntered == 0)
                        allActions.removingValue(` ${buttonValue} `);
                    else if (lastValueEntered != "." && penultimateValueEntered != "+" && penultimateValueEntered != "-")
                        allActions.addingValue(` ${buttonValue} `);
                    else if (penultimateValueEntered == "+") {
                        allActions.addingValue(pCurrentCalculationScreen.textContent.substring(0, pCurrentCalculationScreen.textContent.length - 3), 0);
                        allActions.addingValue(` ${buttonValue} `);
                    }
                    else if (lastValueEntered == "y")
                        allActions.addingValue(` ${buttonValue} `);
                    break;

                case "x":
                case "/":
                    if (lastValueEntered != "." && pCurrentCalculationScreen.textContent.length > 0 && lastValueEntered != "(" && !arrayNumericOperators.includes(penultimateValueEntered))
                        allActions.addingValue(` ${buttonValue} `);
                    else if (pCurrentCalculationScreen.textContent.length == 0)
                        allActions.addingValue(`0 ${buttonValue} `);
                    else if (lastValueEntered == "y")
                        allActions.addingValue(` ${buttonValue} `);
                    break;
            }
            
            document.querySelector("#screenPreviousAnswer").scrollLeft = document.querySelector("#screenPreviousAnswer p").offsetWidth;
            document.querySelector("#screenCurrentCalculation").scrollLeft = document.querySelector("#screenCurrentCalculation p").offsetWidth;
            break;
    }
}

function removingClasses() {
    if (calculatorKeys[20].classList.contains("mb-1")) {
        calculatorKeys[20].classList.remove("mb-1");
        calculatorKeys[21].classList.remove("mb-1");
    }

    if (document.querySelector("#calculatorKeyboardContainer").classList.contains("p-2"))
        document.querySelector("#calculatorKeyboardContainer").classList.remove("p-2");
    else if (document.querySelector("#calculatorKeyboardContainer").classList.contains("p-3"))
        document.querySelector("#calculatorKeyboardContainer").classList.remove("p-3");

    if (document.querySelector("#calculatorKeyboardContainer").classList.contains("pb-1"))
        document.querySelector("#calculatorKeyboardContainer").classList.remove("pb-1");

    if (calculatorKeys[0].classList.contains("p-1")) {
        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.add("p-1")
        });
    }

    if (calculatorKeys[0].classList.contains("p-2")) {
        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.remove("p-2");
        });
    }
    else if (calculatorKeys[0].classList.contains("p-3")) {
        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.remove("p-3");
        });
    }
}

function addingClasses() {
    if (document.body.clientWidth <= 375 && document.body.clientWidth > 280) {
        document.querySelector("#calculatorKeyboardContainer").classList.add("p-2", "pb-1");

        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.add("p-2");
        });
    }
    else if ((document.body.clientWidth <= 280 && document.body.clientWidth >= 260) || document.body.clientWidth <= 915) {
        calculatorKeys[20].classList.add("mb-2");
        calculatorKeys[21].classList.add("mb-2");

        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.add("p-2")
        });
    }
    else if (document.body.clientWidth <= 250) {
        document.querySelector("#calculatorKeyboardContainer").classList.add("pb-1");

        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.add("p-1")
        });
    }
    else {
        document.querySelector("#calculatorKeyboardContainer").classList.add("p-3", "pb-1");

        calculatorKeys.forEach(function(calculatorKey) {
            calculatorKey.classList.add("p-3")
        });
    }
}

removingClasses();
addingClasses();

window.addEventListener("resize", function() {
    removingClasses();
    addingClasses();
});
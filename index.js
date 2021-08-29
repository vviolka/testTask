const path = 'https://gist.githubusercontent.com/jvlad/4152daaf2a9c5c0d74cee6fe23bbc4b1/raw/8f901e58d8a1ea658f8405e94b94cc81b0bb9821/csv_exercise.csv';
const defaultTokens = ['+', '-'];
const dictionary = {};

fetch(path)
    .then((r) => {
        r.text()
            .then((d) => {
                const array = d.split(/[,\n]/).filter(x => x);
                fillDictionary(array);
                countAllValues();
                writeTable();
            })
    })

function fillDictionary(array) {
    array.forEach(condition => {
        condition = condition.trim();
        dictionary[condition[0]] = {value: condition.slice(4), isCounted: false};
    })
}

function countAllValues() {
    for (const [key, value] of Object.entries(dictionary)) {
        if (!value.isCounted) {
            value.value = (countValueOfVariable(key));
            value.isCounted = true;
        }
    }
}

function getSign(token) {
    return token === '-' ? -1 : 1;
}

function countValueOfVariable(variable) {
    let array = dictionary[variable].value.split(' ');
    let tokens = array.filter(x => defaultTokens.includes(x));
    let digits = array.filter(x => !defaultTokens.includes(x));
    let result = 0;

    for (let i = 0; i < digits.length; i++) {
        let a = digits[digits.length - i - 1]
        result += getValueOfVariable(a) * getSign(tokens[tokens.length - i - 1])
    }
    return result;
}

function getValueOfVariable(digit) {
    if (isNaN(digit)) {
        if (dictionary[digit].isCounted)
            return dictionary[digit].value;
        return countValueOfVariable(digit);
    }
    return digit;
}

function writeTable() {
    let table = '<table>';
    for (const [key, value] of Object.entries(dictionary)) {
        table += writeTablesLine(key, value.value)
    }
    table += '</table>';
    document.body.innerHTML += table;
}

function writeTablesLine(variable, value) {
    return `<tr>
<td>${variable}</td>
<td>${value}</td>
</tr>`;
}

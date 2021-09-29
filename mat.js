//const
const rAssembler = ['add', 'addu', 'sub', 'subu', 'and', 'or', 'xor', 'nor',
              'sll', 'srl', 'sra', 'sllv', 'srlv', 'srav', 'slt', 'sltu',
              'mult', 'multu', 'div', 'divu', 'mfhi', 'mflo', 'jr', 'jalr'];
const rDict = {'sll': 0, 'srl': 2, 'sra': 3, 'sllv': 4, 'srlv': 6,
            'srav': 7, 'mfhi': 16, 'mflo': 18, 'mult': 24, 'multu': 25,
            'div': 26, 'divu': 27, 'add': 32, 'addu': 33, 'sub': 34, 'subu': 35,
            'and': 36, 'or': 37, 'xor': 38, 'nor': 39, 'slt': 42, 'sltu': 43,
            'jr': 8, 'jalr': 9};
const rType = rAssembler.length;

const iAssembler = ['addi', 'addiu', 'andi', 'ori', 'xori', 'slti', 'sltiu', 'lui',
                'lb', 'lh', 'lw', 'lbu', 'lhu', 'sb', 'sh', 'sw', 'beq', 'bne'];
const iDict = {'beq': 4, 'bne': 5, 'addi': 8, 'addiu': 9, 'slti': 10, 'sltiu': 11,
            'andi': 12, 'ori': 13, 'xori': 14, 'lui': 15,
            'lb': 32, 'lh': 33, 'lw': 35, 'lbu': 36, 'lhu': 37, 'sb': 40,
            'sh': 41, 'sw': 43};
const iType = iAssembler.length;

const jAssembler = ['j', 'jal'];
const jDict = {'j': 2, 'jal': 3};
const jType = jAssembler.length;

const dToH = {0: '0', 1: '1', 2: '2', 3: '3',  4: '4',  5: '5',  6: '6', 7: '7',
             8: '8', 9: '9', 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'};

//variable
let currentType = '';

let assembly = '';
let instruction = '';
let binary = '';
let hexadecimal = '';

let record = [];
let num = 1;

/* render type button display text */
const setTypeButton = () => {
    document.getElementById('typeButton').innerText = currentType;
}

/* render dropdown list */
const showDropdown = (option) => {
    let content = "<div";
    content += (option === 1)?'':" style='display:none'";
    content += "<!--Select type (dropdownlist)-->";
    content += "<button id='a'>Assembly</button><button id='b'>Machine (Binary)</button>"
            + "<button id='c'>Machine (Hexadecimal)</button></div>";
    document.getElementById('dropdown').innerHTML = content;
}

const renderResult = () => {
    let result = '';
    for (let i = 0; i < instruction.length; i++) {
        result += "<a>" + instruction[i] + " </a>";
    }
    document.getElementById('output').innerHTML = result;

    let recording = '';
    for (let i = 1; i < num; i++) {
        recording += "<div class='result'><div style='margin-right:20px; width: 100px'>" + record[i][0] + "</div>"
            + "<div style='margin-right:20px; width: 150px'>" + record[i][1] + "</div>"
            + "<div style='margin-right:20px; width: 150px'>" + record[i][2] + "</div>"
            + "<div style='margin-right:20px; width: 400px'>" + record[i][3][0] + "</div>"
            + "<div style='width: auto'>" + record[i][4] + "</div></div>"
            + "<div class='result2'><div style='width: 460px'></div>"
            + "<div style='margin-right:20px; width: 400px'>" + record[i][3][1] + "</div></div>";
    }
    document.getElementById('record').innerHTML = recording;
}

/* check if the clicked component's id match the id obtained from path */
const isOnId = (path,id) => path.some(element => element.id == id);

/* check which component is clicked */
const checkClick = (e) => {
    // check if clicked typeButton
    if (isOnId(e.path, ('typeButton'))) {
        showDropdown(1);
    }
    else {
        showDropdown(0);
    }

    //check if clicked droplists
    if (isOnId(e.path, ('a'))) {
        currentType = document.getElementById('a').innerText;
        setTypeButton();
    }
    else if (isOnId(e.path, ('b'))) {
        currentType = document.getElementById('b').innerText;
        setTypeButton();
    }
    else if (isOnId(e.path, ('c'))) {
        currentType = document.getElementById('c').innerText;
        setTypeButton();
    }

    // check if clicked submit button
    if (isOnId(e.path, 'submit')) {
        let input = document.getElementById('input').value;
        getResult(currentType, input);
        renderResult();
    }
}

/* check if assembler is in R-type */
const isR = (assembler) => {
    for (let i = 0; i < rType; i++) {
        if (assembler === rAssembler[i]) {
            return true;
        }
    }
    return false;
}

/* check if assembler is in I-type */
const isI = (assembler) => {
    for (let i = 0; i < iType; i++) {
        if (assembler === iAssembler[i]) {
            return true;
        }
    }
    return false;
}

/* check if assembler is in J-type */
const isJ = (assembler) => {
    for (let i = 0; i < jType; i++) {
        if (assembler === jAssembler[i]) {
            return true;
        }
    }
    return false;
}

/* convert decimal to binary (unsigned) and fill 0s to match up the length */
const dToBu = (string, length) => {
    let intD = parseInt(string);
    let result = '';

    while (intD > 0) {
        result = intD%2 + result;
        intD = Math.floor(intD/2);
    }

    let currentLength = result.length;
    for (let i = length - currentLength; i > 0; i--) {
        result = '0' + result;
    }

    return result;
}

/* convert decimal to binary (two's complement) */
const dToB = (string, length) => {
    let result = '';
    let sign = (parseInt(string) >= 0)? false : true;
    let intD = (sign)? string.split('-')[1] : string;

    result = dToBu(intD, length);

    if (sign) {
        let temp = '';
        for (let i = 0; i < result.length; i++) {
            temp += (result[i] === '0')? '1' : '0';
        }
        result = temp;

        let currentBit = result.length - 1;
        let passBit;
        do {
            if (result[currentBit] === '0') {
                let firstpart = result.substr(0, currentBit);
                let secondpart = (currentBit === result.length - 1)? '' : result.substr(currentBit + 1);
                result = firstpart + '1' + secondpart;
                passBit = 0;
            }
            else {
                let firstpart = result.substr(0, currentBit);
                let secondpart = (currentBit === result.length - 1)? '' : result.substr(currentBit + 1);
                result = firstpart + '0' + secondpart;
                currentBit--;
                passBit = 1;
            }
        } while (passBit === 1 && currentBit >= 0);
    }
    return result;
}

/* convert binary(format: type) to binary(format: 4 bits) */
const format4 = (input) => {
    let concat = '';
    let result = [];

    for (let i = 0; i < input.length; i++) {
        concat += input[i];
    }

    for (let i = 0; i < 8; i++) {
        let halfByte = '';
        halfByte += concat[i*4];
        halfByte += concat[i*4+1];
        halfByte += concat[i*4+2];
        halfByte += concat[i*4+3];
        
        result[i] = halfByte;
    }
    return result;
}

/* translate assembly to instruction */
const assemblyToInstruction = (string) => {
    let assembler = string.split(' ')[0];
    let leftover = string.split(' ')[1];

    // R-type: op, rs, rt, rd, shamt, func
    // I-type: op, rs, rd, imm
    // J-type: op, value
    let op = 0;    // length 6
    let rs = 0;    // length 5
    let rt = 0;    // length 5
    let rd = 0;    // length 5
    let shamt = 0; // length 5
    // func is in rDict: length 6
    let imm = 0;   // length 16
    let value = 0; // length 26

    let result = [];

    if (isR(assembler)) {
        switch (assembler) {
            case 'add':
            case 'addu':
            case 'sub':
            case 'subu':
            case 'and':
            case 'or':
            case 'xor':
            case 'nor':
                rd = leftover.split(',')[0];
                rs = leftover.split(',')[1];
                rt = leftover.split(',')[2];
                break;
            case 'sll':
            case 'srl':
            case 'sra':
                rd = leftover.split(',')[0];
                rt = leftover.split(',')[1];
                shamt = leftover.split(',')[2];
                break;
            case 'sllv':
            case 'srlv':
            case 'srav':
                rd = leftover.split(',')[0];
                rt = leftover.split(',')[1];
                rs = leftover.split(',')[2];
                break;
            case 'slt':
            case 'sltu':
                rd = leftover.split(',')[0];
                rs = leftover.split(',')[1];
                rt = leftover.split(',')[2];
                break;
            case 'mult':
            case 'multu':
            case 'div':
            case 'divu':
                rs = leftover.split(',')[0];
                rt = leftover.split(',')[1];
                break;
            case 'mfhi':
            case 'mflo':
                rd = leftover;
                break;
            case 'jr':
            case 'jalr':
                rs = leftover;
                break;
        }
        result[0] = 0;
        result[1] = rs;
        result[2] = rt;
        result[3] = rd;
        result[4] = shamt;
        result[5] = rDict[assembler];
    }

    if (isI(assembler)) {
        op = iDict[assembler];
        switch (assembler) {
            case 'addi':
            case 'addiu':
            case 'andi':
            case 'ori':
            case 'xori':
            case 'slti':
            case 'sltiu':
                rd = leftover.split(',')[0];
                rs = leftover.split(',')[1];
                imm = leftover.split(',')[2];
                break;
            case 'lui':
                rd = leftover.split(',')[0];
                imm = leftover.split(',')[1];
                break;
            case 'lb':
            case 'lh':
            case 'lw':
            case 'lbu':
            case 'lhu':
            case 'sb':
            case 'sh':
            case 'sw':
                rd = leftover.split(',')[0];
                rs = leftover.split(',')[1].split('(')[1].split(')')[0];
                imm = leftover.split(',')[1].split('(')[0];
                break;
            case 'beq':
            case 'bne':
                rs = leftover.split(',')[0];
                rd = leftover.split(',')[1];
                imm = leftover.split(',')[2];
                break;
        }
        result[0] = op;
        result[1] = rs;
        result[2] = rd;
        result[3] = imm;
    }

    if (isJ(assembler)) {
        op = jDict[assembler];
        switch (assembler) {
            case 'j':
            case 'jal':
                imm = leftover;
                break;
        }
        result[0] = op;
        result[1] = imm;
    }
    return result;
}

/* translate instruction to binary */
const instructionToB = (input) => {
    // R-type: 6, 5, 5, 5, 5, 6
    // I-type: 6, 5, 5, 16
    // J-type: 6, 26

    let output = [];
    let result = [];
    if (input[0] === 0) {
        let rs, rt, rd = '0';

        if (input[5] !== 8 && input[5] !== 9) {
            rs = input[1].split('$')[1];
            rt = input[2].split('$')[1];
            rd = input[3].split('$')[1];
        }
        else {
            rs = input[1].split('$')[1];
        }
        output[0] = '000000';
        output[1] = dToBu(rs, 5);
        output[2] = dToBu(rt, 5);
        output[3] = dToBu(rd, 5);
        output[4] = dToBu(input[4], 5);
        output[5] = dToBu(input[5], 6);
    }
    else if (input[0] === 2 || input[0] === 3) {
        let op = input[0];
        let imm = input[1];

        output[0] = dToBu(op, 6);
        output[1] = dToBu(parseInt(imm, 16), 26);
    }
    else {
        let op = input[0];
        let rs = input[1].split('$')[1];
        let rd = input[2].split('$')[1];
        let imm = input[3];

        output[0] = dToBu(op, 6);
        output[1] = dToBu(rs, 5);
        output[2] = dToBu(rd, 5);
        
        if (op === iDict['addi'] || op === iDict['addiu']
        || op === iDict['slti'] || op === iDict['sltiu']) {
            output[3] = dToB(imm, 16);
        }
        else {
            output[3] = dToBu(parseInt(imm, 16), 16);
        }
    }
    result[0] = output;
    result[1] = format4(output);
    return result;
}

/* translate binary to hexadecimal */
const bToH = (input) => {
    let result = '0x';
    for (let i = 0; i < 8; i++) {
        result += dToH[parseInt(input[i], 2)];
    }
    return result;
}

/* translate to result */
const getResult = (type, string) => {
    if (type === 'Assembly') {
        assembly = string;
        instruction = assemblyToInstruction(string);
        binary = instructionToB(instruction);
        hexadecimal = bToH(binary[1]);
        record[num] = [num, assembly, instruction, binary, hexadecimal];
        num++;
    }
    else if (type === 'Machine (Binary)') {

    }
    else if (type === 'Machine (Hexadecimal)') {

    }
}

window.addEventListener('click', function (e) {
    checkClick(e);

    // let test = '-2';
    // console.log(test, dToB(test, 16));
})
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

//variable
let currentType = '';

let assembly = '';
let instruction = '';
let binary = '';
let Hexadecimal = '';

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
        console.log(input);
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

/* translate assembly to binary */
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

/* translate to result */
const getResult = (type, string) => {
    if (type === 'Assembly') {
        assembly = string;
        instruction = assemblyToInstruction(string);
        // binary = formatToB(instruction);
        // Hexadecimal = bToH(binary);
    }
    else if (type === 'Machine (Binary)') {

    }
    else if (type === 'Machine (Hexadecimal)') {

    }
}

window.addEventListener('click', function (e) {
    checkClick(e);

    // let a = 'a, b,c';
    // console.log(a.split(',')[1].trim().length);
    // let testAssembly = 'jr $31';
    // console.log(testAssembly, assemblyToInstruction(testAssembly));
    // let testAssembly1 = 'bne $8,$9,0x18';
    // console.log(testAssembly1, assemblyToInstruction(testAssembly1));
    // let testAssembly2 = 'jal 0x800';
    // console.log(testAssembly2, assemblyToInstruction(testAssembly2));
})

        // // this is for instruction to binary
        // for (let i = 0; i < result.length; i++) {
        //     let maxBits = (i === 0 || i === 5)? 6 : 5;
        //     result[i] = intToB(result[i], maxBits);
        // }
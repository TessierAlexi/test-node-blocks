#!/usr/bin/env ts-node

const input: string = process.argv[2];
if (!input) {
  console.error('Usage: ts-node cli.ts <input>');
  process.exit(1);
}
console.log(`Your input: ${input}`);


handleInput(["10",
"move 9 onto 1",
"move 8 over 1",
"move 7 over 1",
"move 6 over 1",
"pile 8 over 6",
"pile 8 over 5",
"move 2 over 1",
"move 4 over 9",
"move 1 onto 9",
"move 2 over 9",
"pile 1 onto 5",
"quit"]);

function handleInput(commands: Array<string>) {
    let length = 0;
    let pile : number[][];
    pile = [];
    for(let i = 0; i < commands.length; i++) {       
        if (i == 0) {
            length = parseInt(commands[i]);
            console.log(length);
            for (let j = 0; j < length; j++) {
                pile[j] = [j];
            }

            console.log(pile);
            continue;
        }
        if (commands[i] != "quit") {
            // assume its move
            console.log(commands[i]);
            const commandSplitByWord = commands[i].split(" ");
            if (commandSplitByWord[0] === "move") {
                console.log("Moving");
                if (commandSplitByWord[2] == "onto" ) {
                   moveOnto(parseInt(commandSplitByWord[1]), parseInt(commandSplitByWord[3]), pile);
                } else
                if (commandSplitByWord[2] == "over") {
                    moveOver(parseInt(commandSplitByWord[1]), parseInt(commandSplitByWord[3]), pile);
                }
            } else if (commandSplitByWord[0] === "pile") {
                console.log("Piling");
                if (commandSplitByWord[2] == "onto" ) {
                    pileOnto(parseInt(commandSplitByWord[1]), parseInt(commandSplitByWord[3]), pile);
                } else
                if (commandSplitByWord[2] == "over") {
                    // TODO: implement pile over
                    pileOver(parseInt(commandSplitByWord[1]), parseInt(commandSplitByWord[3]), pile);
                }
            }
        }
        console.log(pile);

    }
}

function moveOnto(a: number, b: number, pile: number[][]) {
    console.log(`Moving ${a} onto ${b}`);
    // unstack whats on both a and b
    pile[a].length > 1 ? unstack(a, pile) : console.log(`${a} is clear`);
    pile[b].length > 1 ? unstack(b, pile) : console.log(`${b} is clear`); 
    // stack a on b
    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[b].push(blockA);
        console.log(`Moved ${a} on ${b}`);
    }
}

function moveOver(a: number, b: number, pile: number[][]) {
    console.log(`Moving ${a} over ${b}`);
    // unstack whats on both a and b
    pile[a].length > 1 ? unstack(a, pile) : console.log(`${a} is clear`);
    // stack a on b
    const pileIndex = findStackContaining(b, pile);


    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[pileIndex].push(blockA);
        console.log(`Moved ${a} over to ${b}`);
    }
}

function pileOnto(a: number, b: number, pile: number[][]) {
    console.log(`Piling ${a} onto ${b}`);
    // unstack whats on both a and b
    pile[b].length > 1 ? unstack(b, pile) : console.log(`${b} is clear`); 
     
    // stack a pile on b
    const aPileStack = popStackOnTopOf(a, pile);
    for (let k = 0; k < aPileStack.length; k++) {
        const block = aPileStack[k];
        pile[b].push(block);
    }

    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[b].push(blockA);
        console.log(`Piled ${a} on ${b}`);
    }
}

function pileOver(a: number, b: number, pile: number[][]) {
    console.log(`Piling ${a} over ${b}`);
    // unstack whats on both a and b
    pile[a].length > 1 ? unstack(a, pile) : console.log(`${a} is clear`);
    // stack a on b
    const pileIndex = findStackContaining(b, pile);


    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[pileIndex].push(blockA);
        console.log(`Piled ${a} over to ${b}`);
    }
}

function unstack(a: number, pile: number[][]) {
    console.log(`Unstacking ${a}`);
    while (pile[a][pile[a].length - 1] != a) {
        const top = pile[a].pop();
        if (top !== undefined) {
            pile[top].push(top);
            console.log(`Moved ${top} back to its position`);
        }
    }
}

function findStackContaining(target: number, pile: number[][]): number {
     for (let j = 0; j < pile.length; j++) {
        if (pile[j].includes(target)) {
            console.log(`Found ${target} in pile ${j}`);
            return j;
        }
    }
    throw new Error(`Block ${target} not found in any pile`);
}

function popStackOnTopOf(target: number, pile: number[][]): number[] {
    let returnPile: number[] = []; 
    for (let j = 0; j < pile.length; j++) {
        if (pile[j].includes(target)) {
            console.log(`Found ${target} in pile ${j}`);
            // Get the index of target in pile[j]
            const index = pile[j].indexOf(target);
            return pile[j].splice(index); 
        }
    }
    throw new Error(`Block ${target} not found in any pile`);
}
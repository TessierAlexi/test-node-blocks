#!/usr/bin/env ts-node
export { };

// TODO: With more time, I would refactor this code for better clarity and maintainability:
// 1. Add type definitions for commands to improve type safety and avoid magic strings.
//    Define interfaces like:
//    type CommandAction = 'move' | 'pile';
//    type CommandDirection = 'onto' | 'over';
//    interface ParsedCommand { action: CommandAction; a: number; direction: CommandDirection; b: number; }
//    And a parseCommand function to convert string commands to this structured type.
// 2. Refactor handleInput into smaller, more focused functions:
//    - Extract pile initialization into initializePiles(numBlocks: number): number[][].
//    - Create processCommand(cmd: string, pile: number[][]) to handle individual commands.
//    - Use early returns and reduce nesting in the main loop.
//    This would make the code more modular, easier to test, and less prone to errors.

/**
 * Processes a sequence of block manipulation commands for the UVa 101 problem.
 * @param commands Array of strings: first is n (number of blocks), then commands, ends with 'quit'.
 * @returns The final state of piles as number[][].
 */
export function handleInput(commands: Array<string>) {
    let length = 0;
    let pile: number[][];
    pile = [];
    for (let i = 0; i < commands.length; i++) {
        if (i == 0) {
            length = parseInt(commands[i]);
            for (let j = 0; j < length; j++) {
                pile[j] = [j];
            }
            continue;
        }
        if (commands[i] == "quit") {
            break;
        }
        const commandSplitByWord = commands[i].split(" ");
        const a = parseInt(commandSplitByWord[1]);
        const b = parseInt(commandSplitByWord[3]);
        if (findStackContaining(a, pile) === findStackContaining(b, pile)) {
            continue; // Ignore illegal commands
        }
        if (commandSplitByWord[0] === "move") {
            if (commandSplitByWord[2] == "onto") {
                moveOnto(a, b, pile);
            } else if (commandSplitByWord[2] == "over") {
                moveOver(a, b, pile);
            }
        } else if (commandSplitByWord[0] === "pile") {
            if (commandSplitByWord[2] == "onto") {
                pileOnto(a, b, pile);
            } else if (commandSplitByWord[2] == "over") {
                pileOver(a, b, pile);
            }
        }
    }
    return pile;
}

function moveOnto(a: number, b: number, pile: number[][]) {
    // unstack whats on both a and b
    pile[a].length > 1 ? unstack(a, pile) : null;
    pile[b].length > 1 ? unstack(b, pile) : null;
    // stack a on b
    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[b].push(blockA);
    }
}

function moveOver(a: number, b: number, pile: number[][]) {
    // unstack whats on both a and b
    pile[a].length > 1 ? unstack(a, pile) : null;
    // stack a on b
    const pileIndex = findStackContaining(b, pile);
    const blockA = pile[a].pop();
    if (blockA !== undefined) {
        pile[pileIndex].push(blockA);
    }
}

function pileOnto(a: number, b: number, pile: number[][]) {
    // unstack whats on both a and b
    pile[b].length > 1 ? unstack(b, pile) : null;
    const aPileStack = popStackOnTopOf(a, pile);
    for (let k = 0; k < aPileStack.length; k++) {
        const block = aPileStack[k];
        pile[b].push(block);
    }
}

function pileOver(a: number, b: number, pile: number[][]) {
    // stack a on b
    const aPileStack = popStackOnTopOf(a, pile);
    for (let k = 0; k < aPileStack.length; k++) {
        const block = aPileStack[k];
        pile[b].push(block);
    }
}

function unstack(a: number, pile: number[][]) {
    // Return all blocks stacked above block 'a' to their initial positions.
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
            return j;
        }
    }
    throw new Error(`Block ${target} not found in any pile`);
}

function popStackOnTopOf(target: number, pile: number[][]): number[] {
    // Extract the subpile consisting of 'target' and all blocks above it, removing them from the pile.
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

export function printState(pile: number[][], n: number): string {
    return Array.from({ length: n }, (_, i) =>
        `${i}:${pile[i] && pile[i].length > 0 ? ' ' + pile[i].join(' ') : ''}`
    ).join('\n');
}

// vibe coded CLI input handling to test it with custom inputs and default to an example

// CLI input handling function
export function runCLI(input: string): string {
    const lines = input.trim().split('\n');
    const pile = handleInput(lines);
    return printState(pile, parseInt(lines[0]));
}

// Run inline: use CLI args as input lines if provided, else sample
const input = process.argv.length > 2 ? process.argv.slice(2).join('\n') : '10\nmove 9 onto 1\npile 8 over 1\npile 7 over 1\npile 6 over 1\npile 5 over 1\nmove 3 over 1\npile 2 over 1\nmove 4 over 9\nquit';
if (process.argv[1] && process.argv[1].endsWith('index.ts')) {
    console.log(runCLI(input));
}
// example usage : 
// ts-node --esm index.ts 10 "move 9 onto 1" "pile 8 over 1" "pile 7 over 1" "pile 6 over 1" "pile 5 over 1" "move 3 over 1" "pile 2 over 1" "move 4 over 9" quit
//results in : 
// "0: 0
// 1: 1 9 8 7 6 5 3 2 4
// 2:
// 3:
// 4:
// 5:
// 6:
// 7:
// 8:
// 9:"
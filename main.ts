
import { handleInput } from './index.ts';

/**
 * Describes the structure of a parsed command.
 */
export type ParsedCommand = {
  action: 'move' | 'pile';
  source: number;
  verb: 'onto' | 'over';
  destination: number;
} | { action: 'quit' } | { action: 'invalid' };


/**
 * Formats the final state of the piles for printing.
 * @param pile The final state of the piles.
 * @param n The total number of blocks.
 * @returns A formatted string representing the world state.
 */
export function formatWorldState(pile: number[][], n: number): string {
    return Array.from({ length: n }, (_, i) =>
        `${i}:${pile[i] && pile[i].length > 0 ? ' ' + pile[i].join(' ') : ''}`
    ).join('\n');
}

/**
 * Main CLI execution function.
 * @param input A single string containing all commands, separated by newlines.
 */
function runCLI(input: string): void {
    const lines = input.trim().split('\n');
    if (lines.length === 0 || lines[0] === '') {
        console.error("Input is empty. Please provide the number of blocks and commands.");
        return;
    }

    const numBlocks = parseInt(lines[0], 10);
    if (isNaN(numBlocks) || numBlocks <= 0 || numBlocks >= 25) {
        console.error("Invalid number of blocks. Must be between 1 and 24.");
        return;
    }
    
    const pile = handleInput(lines);
    const output = formatWorldState(pile, numBlocks);
    console.log(output);
}

// Execute the CLI logic.
// Use CLI args as input lines if provided, otherwise use a default sample.
const input = process.argv.length > 2 
    ? process.argv.slice(2).join('\n') 
    : '10\nmove 9 onto 1\nmove 8 over 1\nmove 7 over 1\nmove 6 over 1\npile 8 over 6\npile 8 over 5\nmove 2 over 1\nmove 4 over 9\nquit';

runCLI(input);

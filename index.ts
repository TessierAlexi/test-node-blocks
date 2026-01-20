
/**
 * @file Core logic for the Blocks Problem (UVa 101).
 */

// #region Type Definitions

/** The action to perform, either 'move' or 'pile'. */
export type CommandAction = 'move' | 'pile';

/** The preposition determining the destination behavior, 'onto' or 'over'. */
export type CommandVerb = 'onto' | 'over';

/** Represents a valid, parsed command from the input. */
export interface ParsedCommand {
    action: CommandAction;
    source: number;
    verb: CommandVerb;
    destination: number;
}

// #endregion

// #region Core Logic

/**
 * Processes a sequence of block manipulation commands.
 * @param commands An array of strings, where the first element is the number of blocks
 *                 and subsequent elements are commands, ending with 'quit'.
 * @returns The final state of the block piles.
 */
export function handleInput(commands: string[]): number[][] {
    if (commands.length === 0) {
        return [];
    }

    const numBlocks = parseInt(commands[0], 10);
    if (isNaN(numBlocks) || numBlocks <= 0) {
        return [];
    }

    const pile = initializePiles(numBlocks);

    for (let i = 1; i < commands.length; i++) {
        const commandStr = commands[i];
        if (commandStr === 'quit') {
            break;
        }

        const command = parseCommand(commandStr);
        if (!command) {
            continue; // Ignore syntactically incorrect commands
        }
        
        // An illegal command is one where source and destination are the same
        // or they are already in the same stack.
        if (command.source === command.destination || findStackContaining(command.source, pile) === findStackContaining(command.destination, pile)) {
            continue;
        }
        
        processCommand(command, pile);
    }

    return pile;
}

/**
 * Initializes the world with n blocks, each in its own pile.
 * @param numBlocks The number of blocks.
 * @returns A 2D array representing the initial state of the piles.
 */
function initializePiles(numBlocks: number): number[][] {
    const pile: number[][] = [];
    for (let i = 0; i < numBlocks; i++) {
        pile[i] = [i];
    }
    return pile;
}

/**
 * Executes a single, parsed command to manipulate the piles.
 * @param command The parsed command object.
 * @param pile The current state of the piles.
 */
function processCommand(command: ParsedCommand, pile: number[][]): void {
    const { action, source, verb, destination } = command;

    if (action === 'move') {
        if (verb === 'onto') {
            moveOnto(source, destination, pile);
        } else { // 'over'
            moveOver(source, destination, pile);
        }
    } else if (action === 'pile') {
        if (verb === 'onto') {
            pileOnto(source, destination, pile);
        } else { // 'over'
            pileOver(source, destination, pile);
        }
    }
}

// #endregion

// #region Command Implementations

/**
 * Moves block `a` onto block `b`, clearing any blocks above both.
 * @param a The block to move.
 * @param b The block to move onto.
 * @param pile The current state of piles.
 */
function moveOnto(a: number, b: number, pile: number[][]): void {
    unstack(a, pile);
    unstack(b, pile);
    const aPileIndex = findStackContaining(a, pile);
    const bPileIndex = findStackContaining(b, pile);
    const blockA = pile[aPileIndex].pop();
    if (blockA !== undefined) {
        pile[bPileIndex].push(blockA);
    }
}

/**
 * Moves block `a` over the stack containing `b`, clearing blocks above `a`.
 * @param a The block to move.
 * @param b A block in the destination stack.
 * @param pile The current state of piles.
 */
function moveOver(a: number, b: number, pile: number[][]): void {
    unstack(a, pile);
    const aPileIndex = findStackContaining(a, pile);
    const bPileIndex = findStackContaining(b, pile);
    const blockA = pile[aPileIndex].pop();
    if (blockA !== undefined) {
        pile[bPileIndex].push(blockA);
    }
}

/**
 * Piles block `a` and everything above it onto block `b`, clearing `b` first.
 * @param a The base of the pile to move.
 * @param b The block to pile onto.
 * @param pile The current state of piles.
 */
function pileOnto(a: number, b: number, pile: number[][]): void {
    unstack(b, pile);
    const aPileStack = popStackOnTopOf(a, pile);
    const bPileIndex = findStackContaining(b, pile);
    pile[bPileIndex].push(...aPileStack);
}

/**
 * Piles block `a` and everything above it over the stack containing `b`.
 * @param a The base of the pile to move.
 * @param b A block in the destination stack.
 * @param pile The current state of piles.
 */
function pileOver(a: number, b: number, pile: number[][]): void {
    const aPileStack = popStackOnTopOf(a, pile);
    const bPileIndex = findStackContaining(b, pile);
    pile[bPileIndex].push(...aPileStack);
}

// #endregion

// #region Helper Functions

/**
 * Parses a command string into a structured ParsedCommand object.
 * Assumes valid command format per problem spec.
 * @param commandStr The raw command string (e.g., "move 9 onto 1").
 * @returns A ParsedCommand object, or null if the command is invalid.
 */
export function parseCommand(commandStr: string): ParsedCommand | null {
    const parts = commandStr.split(' ');
    if (parts.length !== 4) return null;

    const action = parts[0] as CommandAction;
    const source = parseInt(parts[1], 10);
    const verb = parts[2] as CommandVerb;
    const destination = parseInt(parts[3], 10);

    if (
        (action !== 'move' && action !== 'pile') ||
        (verb !== 'onto' && verb !== 'over') ||
        isNaN(source) || isNaN(destination)
    ) {
        return null;
    }

    return { action, source, verb, destination };
}


/**
 * Returns all blocks stacked above a given block `a` to their initial positions.
 * @param a The block whose toppers should be unstacked.
 * @param pile The current state of piles.
 */
function unstack(a: number, pile: number[][]): void {
    const aPileIndex = findStackContaining(a, pile);
    if (aPileIndex === -1) return;

    while (pile[aPileIndex][pile[aPileIndex].length - 1] !== a) {
        const top = pile[aPileIndex].pop();
        if (top !== undefined) {
            pile[top].push(top); // Return to initial pile
        } else {
            break; // Should not happen in a valid state
        }
    }
}

/**
 * Finds the index of the pile that contains the target block.
 * @param target The block number to find.
 * @param pile The current state of piles.
 * @returns The index of the stack containing the target, or -1 if not found.
 */
function findStackContaining(target: number, pile: number[][]): number {
    for (let i = 0; i < pile.length; i++) {
        if (pile[i].includes(target)) {
            return i;
        }
    }
    // In a valid state, a block should always be found.
    // Throwing an error is appropriate for this unexpected state.
    throw new Error(`Critical Error: Block ${target} not found in any pile.`);
}

/**
 * Extracts and removes the stack of blocks starting from `target` upwards.
 * @param target The block at the bottom of the stack to extract.
 * @param pile The current state of piles.
 * @returns An array of the extracted blocks, including the target.
 */
function popStackOnTopOf(target: number, pile: number[][]): number[] {
    const targetPileIndex = findStackContaining(target, pile);
    const index = pile[targetPileIndex].indexOf(target);
    return pile[targetPileIndex].splice(index);
}

// #endregion
# 101 The Blocks Problem

This project provides a solution to the classic "101 The Blocks Problem" (UVa 101), simulating a robotic arm manipulating blocks on a table according to a specific set of commands.

## Installation

To get started with this project, ensure you have Node.js and npm (or npx) installed on your system.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TessierAlexi/test-node-blocks.git # (replace with your actual repo URL if different)
    cd test-node
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Execution Instructions

The project can be run directly from the command line using `ts-node`. The `main.ts` file handles command-line input and output.

To run the program with the sample input provided in the problem description:

```bash
node --loader ts-node/esm main.ts 10 "move 9 onto 1" "move 8 over 1" "move 7 over 1" "move 6 over 1" "pile 8 over 6" "pile 8 over 5" "move 2 over 1" "move 4 over 9" quit
```

**To provide custom input:**
You can pass your commands as separate string arguments after `main.ts`. The first argument after `main.ts` should be the number of blocks (`n`), followed by your block commands, and finally the `quit` command.

Example for `n=3` and a single command:
```bash
node --loader ts-node/esm main.ts 3 "move 0 onto 1" quit
```

## Test Instructions

The project uses Jest for testing.

1.  **Run all tests:**
    To execute the entire test suite and verify the core logic:
    ```bash
    npx jest
    ```

2.  **Run tests with coverage report:**
    To see a detailed report on code coverage:
    ```bash
    npx jest --coverage
    ```

## Code Structure

*   `index.ts`: Contains the core block manipulation logic and helper functions. This file is designed as a reusable library.
*   `main.ts`: The command-line interface (CLI) entry point. It parses arguments, calls the core logic from `index.ts`, and formats the output.
*   `block.test.ts`: The test suite for the core logic in `index.ts`.

## Configuration Details

This project is configured to run as an ES Module (ESM) environment using TypeScript.

*   `package.json`: Includes `"type": "module"` and necessary development dependencies like `ts-node`, `typescript`, and `jest`.
*   `tsconfig.json`: Configures the TypeScript compiler with `"moduleResolution": "nodenext"` and `"allowImportingTsExtensions": true` to support ESM and explicit `.ts` import paths.
*   `jest.config.cjs`: Configures Jest to work with TypeScript ESM, ensuring tests run correctly with these settings.

## AI / Vibe coding usage
- AI was mostly used to generate additionnal tests after I wrote some up myself, as well as helping me test the solution as I never used jest in my typescript experience.
- I also used it to generate some docblocs, but ended up writing a lot of that myself.
- Then you'll notice the last 2 commits are marked as "vibe coded", I basically let the Gemini agent run with the instructions of what I would do if given more time, and double checked the result myself.
- Finally, I let Gemini handle a lot of the configuration for this project, as I am more familiar with TS configs for Angular & Vue, and did not make a lot of CLI Node apps in the past.
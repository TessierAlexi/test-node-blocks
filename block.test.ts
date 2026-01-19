import { handleInput, printState } from './index';

describe('Blocks Problem (UVa 101)', () => {
  test('initializes n blocks correctly', () => {
    const pile = handleInput(['3']);
    expect(pile).toEqual([[0], [1], [2]]);
  });

  test('sample input full run', () => {
    const commands = [
      '10',
      'move 9 onto 1',
      'move 8 over 1',
      'move 7 over 1',
      'move 6 over 1',
      'pile 8 over 6',
      'pile 8 over 5',
      'move 2 over 1',
      'move 4 over 9',
      'quit'
    ];
    const pile = handleInput(commands);
    expect(pile).toEqual([
      [0],
      [1, 9, 2, 4],
      [],
      [3],
      [],
      [5, 8, 7, 6],
      [],
      [],
      [],
      []
    ]);
  });

  test('move onto clears both and stacks', () => {
    const pile = handleInput([
      '5',
      'move 3 onto 1',  // 1:[1,3] others single/clear
      'quit'
    ]);
    expect(pile).toEqual([[0], [1,3], [2], [], [4]]);
  });

  test('move over clears src only, stacks on target pile', () => {
    const pile = handleInput([
      '4',
      'move 2 over 0',  // 0:[0,2]
      'quit'
    ]);
    expect(pile).toEqual([[0,2], [1], [], [3]]);
  });

  test('pile onto moves subpile to cleared dst', () => {
    const pile = handleInput([
      '6',
      'move 4 over 1',  // 1:[1,4]
      'move 5 over 1',  // 1:[1,4,5]
      'pile 1 onto 2',  // moves [1,4,5] to 2 (cleared)
      'quit'
    ]);
    expect(pile).toEqual([[0], [], [2,1,4,5], [3], [], []]);
  });

  test('pile over moves subpile to target pile top', () => {
    const pile = handleInput([
      '5',
      'pile 3 over 0',  // [0,3]
      'pile 4 over 0',  // [0,3,4]
      'quit'
    ]);
    expect(pile).toEqual([[0,3,4], [1], [2], [], []]);
  });

  test('ignores illegal: a==b', () => {
    const pile = handleInput(['3', 'move 1 onto 1', 'quit']);
    expect(pile).toEqual([[0], [1], [2]]);  // unchanged
  });

  test('ignores illegal: same stack', () => {
    const pile = handleInput([
      '3',
      'move 1 over 0',  // 0:[0,1]
      'move 1 over 0',  // ignore
      'quit'
    ]);
    expect(pile).toEqual([[0,1], [], [2]]);
  });

  test('n=25 max, complex sequence', () => {
    // Add a long test with many ops ensuring no index errors
    const pile = handleInput(['25', 'move 0 over 1', 'quit']);
    expect(pile.length).toBe(25);
  });

  test('quit early stops processing', () => {
    const pile = handleInput(['5', 'move 3 over 1', 'quit', 'ignore this']);
    expect(pile).toEqual([[0], [1,3], [2], [], [4]]);
  });

  test('printState helper matches output format', () => {
    const pile = [[0,2], [], [1]];  // n=3
    const output = printState(pile, 3);
    expect(output).toBe('0: 0 2\n1:\n2: 1');
  });

  test('printState with single block per pile', () => {
    const pile = [[0], [1], [2]];  // n=3
    const output = printState(pile, 3);
    expect(output).toBe('0: 0\n1: 1\n2: 2');
  });

  test('printState with empty piles', () => {
    const pile = [[], [], []];  // n=3
    const output = printState(pile, 3);
    expect(output).toBe('0:\n1:\n2:');
  });

  test('n=1 edge case', () => {
    const pile = handleInput(['1', 'quit']);
    expect(pile).toEqual([[0]]);
  });

  test('n=2 simple moves', () => {
    const pile = handleInput(['2', 'move 1 onto 0', 'quit']);
    expect(pile).toEqual([[0,1], []]);
  });

  test('complex pile over', () => {
    const pile = handleInput([
      '4',
      'move 2 over 1',  // 1:[1,2]
      'move 3 over 1',  // 1:[1,2,3]
      'pile 1 over 0',  // pile [1,2,3] over 0: 0:[0,1,2,3]
      'quit'
    ]);
    expect(pile).toEqual([[0,1,2,3], [], [], []]);
  });

  test('multiple illegal commands ignored', () => {
    const pile = handleInput([
      '3',
      'move 1 onto 1',  // illegal
      'move 1 over 1',  // illegal
      'move 2 over 1',  // 1:[1,2]
      'move 2 over 1',  // same stack, illegal
      'quit'
    ]);
    expect(pile).toEqual([[0], [1,2], []]);
  });

  test('all command types in sequence', () => {
    const pile = handleInput([
      '6',
      'move 3 onto 1',  // move onto: 1:[1,3]
      'move 4 over 2',  // move over: 2:[2,4]
      'pile 1 onto 5',  // pile onto: 5:[5,1,3]
      'pile 2 over 0',  // pile over: 0:[0,2,4]
      'quit'
    ]);
    expect(pile).toEqual([[0,2,4], [], [], [], [], [5,1,3]]);
  });
});


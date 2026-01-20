import { handleInput } from './index.ts';

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

  test('move onto clears blocks on top of a and b', () => {
    const pile = handleInput([
      '5',
      'move 1 over 0', // 0: [0, 1]
      'move 3 over 2', // 2: [2, 3]
      'move 0 onto 2', // should return 1 and 3 to their initial positions
      'quit'
    ]);
    expect(pile).toEqual([[], [1], [2, 0], [3], [4]]);
  });

  test('move over clears src only, stacks on target pile', () => {
    const pile = handleInput([
      '4',
      'move 2 over 0',  // 0:[0,2]
      'quit'
    ]);
    expect(pile).toEqual([[0,2], [1], [], [3]]);
  });

  test('pile onto clears blocks on top of b', () => {
    const pile = handleInput([
      '6',
      'move 4 over 1',  // 1:[1,4]
      'move 5 over 1',  // 1:[1,4,5]
      'move 3 over 2',  // 2:[2,3]
      'pile 1 onto 2',  // should return 3 to its initial position
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

  test('n=24 max, complex sequence', () => {
    // Add a long test with many ops ensuring no index errors
    const pile = handleInput(['24', 'move 0 over 1', 'quit']);
    expect(pile.length).toBe(24);
  });

  test('quit early stops processing', () => {
    const pile = handleInput(['5', 'move 3 over 1', 'quit', 'ignore this']);
    expect(pile).toEqual([[0], [1,3], [2], [], [4]]);
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

  // New test cases to expose the bug
  test('should move block onto a block that has been moved', () => {
    const commands = [
      '10',
      'move 1 onto 2',
      'move 3 onto 1',
      'quit'
    ];
    const pile = handleInput(commands);
    expect(pile[2]).toEqual([2, 1, 3]);
  });

  test('should pile blocks over a block that has been moved', () => {
    const commands = [
        '10',
        'move 1 onto 2',
        'move 3 over 4',
        'pile 5 over 1',
        'quit'
    ];
    const pile = handleInput(commands);
    expect(pile[2]).toEqual([2, 1, 5]);
  });

  test('should ignore piling over a block in the same pile', () => {
    const commands = [
      '4',
      'move 1 over 0',
      'move 2 over 0',
      'move 3 over 0',
      'pile 0 over 1',
      'quit'
    ];
    const pile = handleInput(commands);
    expect(pile[0]).toEqual([0, 1, 2, 3]);
    expect(pile[1]).toEqual([]);
  });

  test('piling a single block is equivalent to moving', () => {
    const pile = handleInput([
      '3',
      'pile 1 over 0',
      'quit'
    ]);
    expect(pile).toEqual([[0, 1], [], [2]]);
  });

  test('a block is not moved back to its initial position by an illegal move', () => {
    const pile = handleInput([
      '3',
      'move 1 over 0',
      'move 1 over 1',
      'quit'
    ]);
    expect(pile).toEqual([[0, 1], [], [2]]);
  });
});

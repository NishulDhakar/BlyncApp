export type GameSymbol = string;

export interface Puzzle {
    grid: (GameSymbol | null)[][];
    emptyCells: { row: number; col: number }[];
    targetCell: { row: number; col: number };
    answer: GameSymbol;
    options: GameSymbol[];
}

const SYMBOLS: GameSymbol[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

function shuffle<T>(arr: T[]) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export interface SwitchPuzzle extends Puzzle {
    input: GameSymbol[];
    output: GameSymbol[];
    operators: number[][];
    correctOperatorIndex: number;
    layers: number;
    switchOptions: string[];
}

function randomOperator(): number[] {
    return shuffle([1, 2, 3, 4]);
}

function applyOperator(input: GameSymbol[], operator: number[]): GameSymbol[] {
    return operator.map(idx => input[idx - 1]);
}

export function generateSwitchPuzzle(level: number): SwitchPuzzle {
    const layers = level < 8 ? 1 : 2;
    const input = shuffle(SYMBOLS).slice(0, 4);
    const operator1 = randomOperator();
    let output = applyOperator(input, operator1);

    let operator2: number[] | null = null;
    if (layers === 2) {
        operator2 = randomOperator();
        output = applyOperator(output, operator2);
    }

    const correctOperator = layers === 1 ? operator1 : operator2!;
    let options: number[][] = [correctOperator];
    while (options.length < 4) {
        const op = randomOperator();
        if (!options.some(o => o.join() === op.join())) options.push(op);
    }
    options = shuffle(options);

    return {
        grid: [],
        emptyCells: [],
        targetCell: { row: 0, col: 0 },
        answer: correctOperator.map(String).join(" "),
        options: [], // legacy inherited but unused
        switchOptions: options.map(op => op.map(String).join(" ")),
        input,
        output,
        operators: layers === 1 ? [] : [operator1],
        correctOperatorIndex: options.findIndex(op => op.join() === correctOperator.join()),
        layers,
    };
}

export function checkSwitchAnswer(puzzle: SwitchPuzzle, selected: string): boolean {
    return selected === puzzle.answer;
}

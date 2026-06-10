import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Entity, LevelDef, checkWinPattern, isValidMove } from './logic';
import MotionEntity from './MotionEntity';

interface MotionBoardProps {
    levelDef: LevelDef;
    onLevelComplete: () => void;
}

export default function MotionBoard({ levelDef, onLevelComplete }: MotionBoardProps) {
    const [entities, setEntities] = useState<Entity[]>(levelDef.entities);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        setEntities(levelDef.entities);
        setSelectedId(null);
    }, [levelDef]);

    const handleMoveEnd = (id: string, dx: number, dy: number) => {
        const stepX = dx !== 0 ? Math.sign(dx) : 0;
        const stepY = dy !== 0 ? Math.sign(dy) : 0;

        let currentEntities = [...entities];
        let moved = false;
        let finalDx = 0;
        let finalDy = 0;

        // Step-by-step collision check to allow partial slides
        const maxSteps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let step = 1; step <= maxSteps; step++) {
            const testDx = finalDx + stepX;
            const testDy = finalDy + stepY;

            if (isValidMove(levelDef, currentEntities, id, testDx, testDy)) {
                moved = true;
                finalDx = testDx;
                finalDy = testDy;
            } else {
                break; // Hit a wall or block
            }
        }

        if (moved) {
            const updatedEntities = currentEntities.map(e =>
                e.id === id ? { ...e, x: e.x + finalDx, y: e.y + finalDy } : e
            );
            setEntities(updatedEntities);
            setSelectedId(id); // keep selected after moving

            if (checkWinPattern(levelDef, updatedEntities)) {
                setTimeout(onLevelComplete, 300); // Small delay for visual satisfaction
            }
        }
    };

    const boardWidth = Dimensions.get('window').width * 0.85;
    const cellSize = boardWidth / levelDef.cols;
    const boardHeight = cellSize * levelDef.rows;

    return (
        <View
            style={{
                width: boardWidth,
                height: boardHeight,
                backgroundColor: '#FCF6D7',
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 4,
                borderColor: '#332A24',
            }}
        >
            {/* Draw Hole */}
            <View style={{
                position: 'absolute',
                left: levelDef.hole.x * cellSize + 4,
                top: levelDef.hole.y * cellSize + 4,
                width: cellSize - 8,
                height: cellSize - 8,
                backgroundColor: 'rgba(51,42,36,0.1)',
                borderWidth: 3,
                borderColor: '#332A24',
                borderStyle: 'dashed',
                borderRadius: 12,
            }} />

            {/* Draw Entities */}
            {entities.map(ent => {
                let bounds = { up: 0, down: 0, left: 0, right: 0 };
                if (ent.type !== 'obstacle') {
                    bounds.up = 0; while (isValidMove(levelDef, entities, ent.id, 0, -(bounds.up + 1))) bounds.up++;
                    bounds.down = 0; while (isValidMove(levelDef, entities, ent.id, 0, bounds.down + 1)) bounds.down++;
                    bounds.left = 0; while (isValidMove(levelDef, entities, ent.id, -(bounds.left + 1), 0)) bounds.left++;
                    bounds.right = 0; while (isValidMove(levelDef, entities, ent.id, bounds.right + 1, 0)) bounds.right++;
                }
                return (
                    <MotionEntity
                        key={`${levelDef.id}-${ent.id}`}
                        entity={ent}
                        cellSize={cellSize}
                        bounds={bounds}
                        isSelected={selectedId === ent.id}
                        onSelect={() => setSelectedId(ent.id)}
                        onMoveEnd={handleMoveEnd}
                    />
                );
            })}
        </View>
    );
}

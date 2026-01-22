import { MONSTERS, ITEMS } from '../lib/constants';

// Probabilities based on depth
export function generateEvent(depth) {
    const chance = Math.random();

    // 30% Monster Encounter
    if (chance < 0.3) {
        // Filter monsters by power/depth (simplified for now)
        const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        return {
            type: 'COMBAT',
            data: monster,
            text: `Um ${monster.name} apareceu das sombras!`
        };
    }

    // 20% Item Discovery
    if (chance < 0.5) {
        const item = ITEMS.filter(i => i.type === 'loot' || i.type === 'material')[Math.floor(Math.random() * 3)];
        return {
            type: 'LOOT',
            data: item,
            text: `Você encontrou ${item.name} entre as rochas.`
        };
    }

    // 10% Relic (Rare)
    if (chance < 0.55 && depth > 2000) {
        return {
            type: 'RELIC',
            data: { name: 'Artefato Desconhecido' },
            text: "Um brilho estranho emite calor..."
        };
    }

    // 45% Nothing, just atmosphere
    const atmos = [
        "O silêncio é ensurdecedor.",
        "Você ouve gritos distantes.",
        "A pressão aumenta.",
        "Sua lanterna pisca."
    ];
    return {
        type: 'FLAVOR',
        text: atmos[Math.floor(Math.random() * atmos.length)]
    };
}

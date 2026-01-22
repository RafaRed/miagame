import { MONSTERS, ITEMS } from '../lib/constants';

// Probabilities based on depth
export function generateEvent(depth) {
    const chance = Math.random();

    // 10% Monster Encounter (Reduced for chill flow)
    if (chance < 0.1) {
        // Filter monsters by power/depth (simplified for now)
        const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
        return {
            type: 'COMBAT',
            data: monster,
            text: `Um ${monster.name} apareceu das sombras!`
        };
    }

    // 30% Item Discovery (Increased)
    if (chance < 0.4) {
        // Fix: Select from all valid items, not just the first 3
        const possibleItems = ITEMS.filter(i =>
            i.type === 'loot' ||
            i.type === 'material' ||
            (i.type === 'consumable' && i.price <= 50) // Allow finding basic food/meds
        );
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];

        return {
            type: 'LOOT',
            data: item,
            text: `Você encontrou ${item.name} escondido.`
        };
    }

    // 5% NPC Encounter (New)
    if (chance < 0.45) {
        const potentialNPCs = NPCS.filter(npc => depth >= npc.minDepth && depth <= npc.maxDepth);
        if (potentialNPCs.length > 0) {
            const npc = potentialNPCs[Math.floor(Math.random() * potentialNPCs.length)];
            return {
                type: 'INTERACTION',
                data: npc,
                text: npc.dialogue // Initial flavor text
            };
        }
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
        "Sua lanterna pisca.",
        "Você sente que está sendo observado.",
        "O cheiro de ozônio preenche o ar."
    ];
    return {
        type: 'FLAVOR',
        text: atmos[Math.floor(Math.random() * atmos.length)]
    };
}

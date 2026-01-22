import { MONSTERS, ITEMS, NPCS } from '../lib/constants'; // Added NPCS import

// Probabilities based on depth
export function generateEvent(depth) {
    const chance = Math.random();

    // 15% Monster Encounter (Increased for risk)
    if (chance < 0.15) {
        // Filter monsters by power/depth
        let validMonsters = MONSTERS;
        if (depth < 1350) validMonsters = MONSTERS.filter(m => m.power <= 40); // Layer 1
        else if (depth < 2600) validMonsters = MONSTERS.filter(m => m.power >= 30 && m.power <= 80); // Layer 2
        else if (depth < 7000) validMonsters = MONSTERS.filter(m => m.power >= 50 && m.power <= 150); // Layer 3
        else validMonsters = MONSTERS.filter(m => m.power >= 100); // Deep layers

        // Fallback default if filter fails
        if (validMonsters.length === 0) validMonsters = [MONSTERS[0]];

        const monster = validMonsters[Math.floor(Math.random() * validMonsters.length)];
        return {
            type: 'COMBAT',
            data: monster,
            text: `Inimigo: ${monster.name}`
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
            text: `Item: ${item.name}` // Direct text
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
                text: npc.name // Just name for context
            };
        }
    }

    // 10% Relic (Rare)
    if (chance < 0.55 && depth > 2000) {
        return {
            type: 'RELIC',
            data: { ...ITEMS.find(i => i.id === 'dirty_relic'), name: 'Relíquia Suja' }, // Give actual item
            text: "Item Raro: Relíquia Suja"
        };
    }

    // Rest is silence (No event)
    return { type: 'NONE' };
}

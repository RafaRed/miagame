import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
    player: {
        name: "Explorador",
        depth: 0,
        maxDepth: 0,
        hp: 100,
        maxHp: 100,
        hunger: 100,
        maxHunger: 100,
        xp: 0,
        level: 1,
        canAscend: true,
    },
    resources: {
        gold: 100,
        humanity: 0,
    },
    inventory: [{ id: 'ration', count: 2 }],
    equipment: {
        weapon: null,
        body: null,
        charm: null
    },
    machines: {
        excavator: 0,
        refinery: 0,
        balloon: 0,
        kitchen: 0,
        generator: 0,
        bank: 0,
    },
    stats: {
        monstersKilled: 0,
        relicsFound: 0,
        foundRelicIds: [],
    },
    status: {
        inCombat: false,
        combatId: null,
        isDead: false,
        combatLog: [],
        curseIntensity: 0,
        logs: ["Bem-vindo a Orth. Construa sua reputação e explore o desconhecido."],
    },
};

// Helper for stacking
const addToStack = (inv, itemId, qty = 1) => {
    const existingIdx = inv.findIndex(i => i.id === itemId);
    if (existingIdx > -1) {
        const newStack = { ...inv[existingIdx], count: inv[existingIdx].count + qty };
        const newInv = [...inv];
        newInv[existingIdx] = newStack;
        return newInv;
    }
    return [...inv, { id: itemId, count: qty }];
};

// Helper for removing
const removeFromStack = (inv, index, qty = 1) => {
    const item = inv[index];
    const newInv = [...inv];
    if (item.count > qty) {
        newInv[index] = { ...item, count: item.count - qty };
    } else {
        newInv.splice(index, 1);
    }
    return newInv;
};

// Reducer
function gameReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, player: { ...state.player, name: action.payload } };

        case 'DESCEND': {
            const cost = action.payload.cost || 2;
            const currentHunger = state.player.hunger;
            let newHunger = currentHunger - cost;
            let hpPenalty = 0;
            let newLogs = state.status.logs || [];

            if (newHunger < 0) {
                hpPenalty = Math.abs(newHunger) * 2; // 2 HP per missing hunger point
                newHunger = 0;
                newLogs = ["Você está faminto! A saúde está se deteriorando.", ...newLogs].slice(0, 50);
            }

            const newHp = Math.max(0, state.player.hp - hpPenalty);

            return {
                ...state,
                player: {
                    ...state.player,
                    depth: state.player.depth + action.payload.amount,
                    maxDepth: Math.max(state.player.maxDepth, state.player.depth + action.payload.amount),
                    hunger: newHunger,
                    hp: newHp
                },
                status: {
                    ...state.status,
                    isDead: newHp <= 0,
                    logs: newHp < state.player.hp ? newLogs : state.status.logs
                }
            };
        }

        case 'ASCEND': {
            const cost = action.payload.cost || 2;
            const currentHunger = state.player.hunger;
            let newHunger = currentHunger - cost;
            let hpPenalty = 0;
            let newLogs = state.status.logs || [];

            if (newHunger < 0) {
                hpPenalty = Math.abs(newHunger) * 3; // Climbing while starving is harder
                newHunger = 0;
                newLogs = ["A subida exige energia! Você está morrendo de fome.", ...newLogs].slice(0, 50);
            }

            const newHp = Math.max(0, state.player.hp - hpPenalty);

            return {
                ...state,
                player: {
                    ...state.player,
                    depth: Math.max(0, state.player.depth - action.payload.amount),
                    hunger: newHunger,
                    hp: newHp
                },
                status: {
                    ...state.status,
                    isDead: newHp <= 0,
                    curseIntensity: 100, // Trigger full visual curse
                    logs: newHp < state.player.hp ? newLogs : state.status.logs
                }
            };
        }

        case 'TAKE_DAMAGE':
            const newHp = Math.max(0, state.player.hp - action.payload);
            return {
                ...state,
                player: { ...state.player, hp: newHp },
                status: { ...state.status, isDead: newHp === 0 }
            };

        case 'HEAL':
            return {
                ...state,
                player: { ...state.player, hp: Math.min(state.player.maxHp, state.player.hp + action.payload) }
            };

        case 'EAT':
            return {
                ...state,
                player: { ...state.player, hunger: Math.min(state.player.maxHunger, state.player.hunger + action.payload) }
            };

        case 'ADD_GOLD':
            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold + action.payload }
            };

        case 'TICK_PASSIVE':
            // Handle passive regeneration or other time-based updates
            // This might be complex, so we pass the calculated deltas
            const currentCurse = state.status.curseIntensity || 0;
            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold + (action.payload.gold || 0) },
                status: { ...state.status, curseIntensity: Math.max(0, currentCurse - 5) }
            };

        case 'ADD_LOG':
            return {
                ...state,
                status: { ...state.status, logs: [action.payload, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'LOOT_FOUND':
            const lootItem = action.payload.item;
            const knownById = state.stats.foundRelicIds || [];
            if (!knownById.includes(lootItem.id)) knownById.push(lootItem.id);

            return {
                ...state,
                inventory: addToStack(state.inventory, lootItem.id, 1),
                stats: { ...state.stats, foundRelicIds: knownById },
                status: { ...state.status, logs: [`Você encontrou ${lootItem.name}.`, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'TRIGGER_EVENT':
            return {
                ...state,
                status: { ...state.status, currentEvent: action.payload }
            };

        case 'CLEAR_EVENT':
            return {
                ...state,
                status: { ...state.status, currentEvent: null }
            };

        case 'BUY_UPGRADE':
            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold - action.payload.cost },
                machines: { ...state.machines, [action.payload.id]: (state.machines[action.payload.id] || 0) + 1 }
            };

        case 'BUY_ITEM':
            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold - action.payload.cost },
                inventory: addToStack(state.inventory, action.payload.item.id, 1)
            };

        case 'SELL_ITEM':
            return {
                ...state,
                inventory: removeFromStack(state.inventory, action.payload.index, 1),
                resources: { ...state.resources, gold: state.resources.gold + action.payload.gold }
            };

        case 'INTERACT_NPC': {
            const { cost, reward } = action.payload;
            const updates = { ...state.player };
            const resources = { ...state.resources };
            let inventory = [...state.inventory];
            let logs = state.status.logs || [];

            // Pay Costs
            if (cost.gold && resources.gold < cost.gold) {
                logs = ["Dinheiro insuficiente!", ...logs];
                return { ...state, status: { ...state.status, logs } };
            }
            if (cost.hp && updates.hp <= cost.hp) {
                logs = ["Vida insuficiente para pagar o preço!", ...logs];
                return { ...state, status: { ...state.status, logs } };
            }
            if (cost.hunger && updates.hunger < cost.hunger) {
                logs = ["Fome excessiva para treinar!", ...logs];
                return { ...state, status: { ...state.status, logs } };
            }

            if (cost.gold) resources.gold -= cost.gold;
            if (cost.hp) updates.hp -= cost.hp;
            if (cost.hunger) updates.hunger -= cost.hunger;
            if (cost.maxHp_percent) updates.maxHp = Math.floor(updates.maxHp * (1 - cost.maxHp_percent));
            if (cost.humanity === 'all') resources.humanity = 0;

            // Grant Rewards
            let msg = "Troca realizada.";
            if (reward.type === 'buff_str') {
                // Assuming stats struct or simple damage mod. For now adding to a hidden stat or base power if exists.
                // MIA prototype used weapon damage. I'll add a 'baseAtk' to player or just log it for now.
                // Actually, let's update a new 'stats' object in player.
                updates.baseAtk = (updates.baseAtk || 0) + reward.val;
                msg = "Você se sente mais forte.";
            }
            if (reward.type === 'item') {
                inventory = addToStack(inventory, reward.id, 1);
                msg = "Item recebido.";
            }
            if (reward.type === 'restore_all') {
                updates.hp = updates.maxHp;
                updates.hunger = updates.maxHunger;
                msg = "Vigor restaurado.";
            }
            if (reward.type === 'reveal_map') {
                // Feature to implement later, for now just log
                msg = "Segredos do abismo revelados (Bônus de XP).";
                updates.xp += 1000;
            }

            return {
                ...state,
                player: updates,
                resources: resources,
                inventory: inventory,
                status: {
                    ...state.status,
                    logs: [msg, ...logs].slice(0, 50)
                }
            };
        }

        case 'APPRAISE_ITEM':
            const appIndex = action.payload.index;
            const appCost = 50;
            // Remove 1 dirty relic
            const afterAppraiseInv = removeFromStack(state.inventory, appIndex, 1);

            // Roll for result (simplified copy of logic to avoid massive diff)
            const roll = Math.random();
            let resultId = 'stone';
            if (roll > 0.99) resultId = 'reg_arm';
            else if (roll > 0.95) {
                const legendary = ['white_whistle', 'abyss_map', 'sun_sphere', 'blaze_reap'];
                resultId = legendary[Math.floor(Math.random() * legendary.length)];
            }
            else if (roll > 0.80) {
                const rare = ['thousand_men_wedge', 'life_stone', 'star_compass'];
                resultId = rare[Math.floor(Math.random() * rare.length)];
            }
            else if (roll > 0.50) {
                const uncommon = ['star_compass_broken', 'fog_weave', 'relic_fragment'];
                resultId = uncommon[Math.floor(Math.random() * uncommon.length)];
            }
            else {
                const common = ['eternal_torch', 'hollow_vessel', 'stone', 'scrap'];
                resultId = common[Math.floor(Math.random() * common.length)];
            }

            // Update Catalog
            const appKnownById = state.stats.foundRelicIds || [];
            if (!appKnownById.includes(resultId)) appKnownById.push(resultId);

            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold - appCost },
                inventory: addToStack(afterAppraiseInv, resultId, 1),
                stats: { ...state.stats, relicsFound: state.stats.relicsFound + 1, foundRelicIds: appKnownById },
                status: { ...state.status, logs: [`Avaliação completa! Item identificado.`, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'CRAFT_ITEM':
            const recipe = action.payload.recipe;
            // Check resources (simplified validation, caller should check too)
            let currentInventory = [...state.inventory];

            // Consume materials
            Object.entries(recipe.req).forEach(([matId, count]) => {
                // Find index of material
                for (let i = 0; i < count; i++) {
                    const idx = currentInventory.findIndex(item => item.id === matId);
                    if (idx > -1) {
                        currentInventory = removeFromStack(currentInventory, idx, 1);
                    }
                }
            });

            // Add result
            currentInventory = addToStack(currentInventory, recipe.res, 1);
            return { ...state, inventory: currentInventory };

        case 'USE_ITEM':
            const uItem = action.payload.item;
            let uPlayer = { ...state.player };
            if (uItem.effect) {
                if (uItem.effect.hp) uPlayer.hp = Math.min(uPlayer.maxHp, uPlayer.hp + uItem.effect.hp);
                if (uItem.effect.hunger) uPlayer.hunger = Math.min(uPlayer.maxHunger, uPlayer.hunger + uItem.effect.hunger);
            }

            return {
                ...state,
                inventory: removeFromStack(state.inventory, action.payload.index, 1),
                player: uPlayer,
                status: { ...state.status, combatLog: [...(state.status.combatLog || []), `Usou ${uItem.name}.`] }
            };

        case 'EQUIP_ITEM':
            const eItem = action.payload.item;
            // Remove 1 from stack
            const eInv = removeFromStack(state.inventory, action.payload.index, 1);

            // Unequip current if exists (Add back to inventory)
            const slot = eItem.slot || 'weapon'; // default to weapon if missing
            const currentEquip = state.equipment[slot];

            let finalInv = eInv;
            if (currentEquip) {
                finalInv = addToStack(eInv, currentEquip.id, 1);
            }

            return {
                ...state,
                inventory: finalInv,
                equipment: {
                    ...state.equipment,
                    [slot]: eItem
                },
                status: { ...state.status, logs: [`Equipou ${eItem.name}.`, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'COMBAT_START':
            return {
                ...state,
                status: {
                    ...state.status,
                    inCombat: true,
                    currentMonster: { ...action.payload, maxHp: action.payload.power * 5, hp: action.payload.power * 5 },
                    combatLog: [`Um ${action.payload.name} bloqueia o caminho!`]
                }
            };

        case 'COMBAT_ROUND':
            const monster = state.status.currentMonster;
            let log = [];
            let pDmg = 0;
            let mDmg = 0;
            let playerHp = state.player.hp;
            let monsterHp = monster.hp;

            if (action.payload.action === 'ATTACK') {
                // Calculate Player Damage
                // Weapon Atk + Charm Str or Atk
                const weapon = state.equipment.weapon;
                const charm = state.equipment.charm;
                const baseStat = state.player.baseAtk || 0;

                const weaponAtk = weapon?.effect?.atk || 0;
                const charmStr = charm?.effect?.str || 0;
                const charmAtk = charm?.effect?.atk || 0;

                const totalBonus = weaponAtk + charmAtk + (charmStr * 2) + baseStat; // 1 Str = 2 Atk value

                // Base damage 5-15 + Bonuses
                pDmg = Math.floor(Math.random() * 10) + 5 + totalBonus;

                monsterHp -= pDmg;
                log.push(`Você causou ${pDmg} de dano${totalBonus > 0 ? ` (+${totalBonus} bônus)` : ''}.`);
            }

            if (monsterHp > 0) {
                if (action.payload.action !== 'FLEE') {
                    mDmg = Math.floor(Math.random() * monster.power * 0.5);
                    playerHp = Math.max(0, playerHp - mDmg);
                    log.push(`${monster.name} atacou! -${mDmg} HP.`);
                }
            } else {
                log.push(`${monster.name} foi derrotado!`);
                return {
                    ...state,
                    player: { ...state.player, hp: playerHp },
                    status: { ...state.status, currentMonster: { ...monster, hp: 0 }, combatLog: [...state.status.combatLog, ...log] }
                };
            }

            return {
                ...state,
                player: { ...state.player, hp: playerHp },
                status: {
                    ...state.status,
                    currentMonster: { ...monster, hp: monsterHp },
                    combatLog: [...state.status.combatLog, ...log],
                    isDead: playerHp === 0
                }
            };

        case 'COMBAT_WIN':
            return {
                ...state,
                status: { ...state.status, inCombat: false, currentMonster: null, currentEvent: null },
                resources: { ...state.resources, gold: state.resources.gold + (action.payload.gold || 0) },
            };

        case 'COMBAT_FLEE':
            return {
                ...state,
                status: { ...state.status, inCombat: false, currentMonster: null, currentEvent: null, combatLog: [] }
            };

        case 'RESPAWN':
            return {
                ...state,
                player: {
                    ...state.player,
                    hp: state.player.maxHp,
                    depth: 0,
                    hunger: 100
                },
                resources: {
                    ...state.resources,
                    gold: Math.floor(state.resources.gold * 0.5) // 50% gold penalty
                },
                inventory: [], // Lose all backpack items
                status: {
                    ...state.status,
                    isDead: false,
                    inCombat: false, // Force exit combat
                    currentMonster: null,
                    currentEvent: null,
                    logs: ["Você acordou na superfície. Sua mochila ficou para trás...", ...state.status.logs]
                }
            };

        default:
            return state;
    }
}

// Context
const GameContext = createContext();

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
        // Load from localStorage if available
        const saved = localStorage.getItem('abyss_save_v1');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Sanity checks on load
            if (parsed.player.hp < 0) parsed.player.hp = 0;
            if (parsed.player.hp === 0) parsed.status.isDead = true;
            return parsed;
        }
        return initial;
    });

    // Auto-save logic
    useEffect(() => {
        const timer = setInterval(() => {
            localStorage.setItem('abyss_save_v1', JSON.stringify(state));
        }, 5000); // Save every 5s
        return () => clearInterval(timer);
    }, [state]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameState() {
    return useContext(GameContext);
}

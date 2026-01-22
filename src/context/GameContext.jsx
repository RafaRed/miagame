import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State based on the prototype
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
        canAscend: true, // For curse checks
    },
    resources: {
        gold: 100, // Orth
        humanity: 0, // Rare currency from rescuing
    },
    inventory: ['ration', 'ration'],
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
    },
    status: {
        inCombat: false,
        combatId: null, // ID of the monster/encounter
        isDead: false,
        combatLog: [],
        logs: ["Bem-vindo a Orth. Construa sua reputação e explore o desconhecido."],
    },
    // Multiplayer data will be handled by a separate hook or merged here?
    // Keeping it separate for now to avoid reducer bloat.
};

// Reducer
function gameReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, player: { ...state.player, name: action.payload } };

        case 'DESCEND':
            // Basic descend logic (cost handled by caller or here? Caller usually better for side effects, but reducer for state update)
            return {
                ...state,
                player: {
                    ...state.player,
                    depth: state.player.depth + action.payload.amount,
                    maxDepth: Math.max(state.player.maxDepth, state.player.depth + action.payload.amount),
                    hunger: Math.max(0, state.player.hunger - action.payload.cost)
                }
            };

        case 'ASCEND':
            return {
                ...state,
                player: {
                    ...state.player,
                    depth: Math.max(0, state.player.depth - action.payload.amount)
                }
            };

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
            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold + (action.payload.gold || 0) },
                // ... inventory updates if any
            };

        case 'ADD_LOG':
            return {
                ...state,
                status: { ...state.status, logs: [action.payload, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'LOOT_FOUND':
            return {
                ...state,
                inventory: [...state.inventory, action.payload.item.id],
                status: { ...state.status, logs: [`Você encontrou ${action.payload.item.name}.`, ...(state.status.logs || [])].slice(0, 50) }
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
                inventory: [...state.inventory, action.payload.item.id]
            };

        case 'SELL_ITEM':
            const newInv = [...state.inventory];
            newInv.splice(action.payload.index, 1);
            return {
                ...state,
                inventory: newInv,
                resources: { ...state.resources, gold: state.resources.gold + action.payload.gold }
            };

        case 'APPRAISE_ITEM':
            const appIndex = action.payload.index;
            const appCost = 50; // Fixed cost for now
            const appInv = [...state.inventory];

            // Remove dirty relic
            appInv.splice(appIndex, 1);

            // Roll for result (Weighted Rarity)
            const roll = Math.random();
            let resultId = 'stone';

            // 1% Chance - Special (Aubade)
            if (roll > 0.99) resultId = 'reg_arm';
            // 4% Chance - Grade 1 (Legendary)
            else if (roll > 0.95) {
                const legendary = ['white_whistle', 'abyss_map', 'sun_sphere', 'blaze_reap'];
                resultId = legendary[Math.floor(Math.random() * legendary.length)];
            }
            // 15% Chance - Grade 2 (Rare)
            else if (roll > 0.80) {
                const rare = ['thousand_men_wedge', 'life_stone', 'star_compass'];
                resultId = rare[Math.floor(Math.random() * rare.length)];
            }
            // 30% Chance - Grade 3 (Uncommon)
            else if (roll > 0.50) {
                const uncommon = ['star_compass_broken', 'fog_weave', 'relic_fragment'];
                resultId = uncommon[Math.floor(Math.random() * uncommon.length)];
            }
            // 50% Chance - Grade 4 (Common/Trash)
            else {
                const common = ['eternal_torch', 'hollow_vessel', 'stone', 'scrap'];
                resultId = common[Math.floor(Math.random() * common.length)];
            }

            // Add new item
            appInv.push(resultId);

            // Find item def for logging
            // Warning: ITEMS import might be needed if not available in scope, 
            // but reducer is usually pure. We pass item name in payload normally or lookup here if ITEMS global.
            // Assuming we just log generic success to avoid dependency issues in this snippet context or rely on UI to log.
            // Actually let's use a generic message in log for now.

            return {
                ...state,
                resources: { ...state.resources, gold: state.resources.gold - appCost },
                inventory: appInv,
                status: { ...state.status, logs: [`Avaliação completa! Item identificado.`, ...(state.status.logs || [])].slice(0, 50) }
            };

        case 'CRAFT_ITEM':
            const recipe = action.payload.recipe;
            // Check resources (simplified validation, caller should check too)
            let scState = { ...state };

            // Consume materials
            Object.entries(recipe.req).forEach(([matId, count]) => {
                // Find index of material
                for (let i = 0; i < count; i++) {
                    const idx = scState.inventory.indexOf(matId);
                    if (idx > -1) scState.inventory.splice(idx, 1);
                }
            });

            // Add result
            scState.inventory.push(recipe.res);
            return scState;

        case 'USE_ITEM':
            const uItem = action.payload.item;
            const uInv = [...state.inventory];
            uInv.splice(action.payload.index, 1);

            let uPlayer = { ...state.player };
            if (uItem.effect) {
                if (uItem.effect.hp) uPlayer.hp = Math.min(uPlayer.maxHp, uPlayer.hp + uItem.effect.hp);
                if (uItem.effect.hunger) uPlayer.hunger = Math.min(uPlayer.maxHunger, uPlayer.hunger + uItem.effect.hunger);
            }

            return {
                ...state,
                inventory: uInv,
                player: uPlayer,
                status: { ...state.status, combatLog: [...(state.status.combatLog || []), `Usou ${uItem.name}.`] }
            };

        case 'EQUIP_ITEM':
            const eItem = action.payload.item;
            const eInv = [...state.inventory];
            eInv.splice(action.payload.index, 1);

            // Unequip current if exists
            const slot = eItem.slot || 'weapon'; // default to weapon if missing
            const currentEquip = state.equipment[slot];
            if (currentEquip) {
                eInv.push(currentEquip.id);
            }

            return {
                ...state,
                inventory: eInv,
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

                const weaponAtk = weapon?.effect?.atk || 0;
                const charmStr = charm?.effect?.str || 0;
                const charmAtk = charm?.effect?.atk || 0;

                const totalBonus = weaponAtk + charmAtk + (charmStr * 2); // 1 Str = 2 Atk value

                // Base damage 5-15 + Bonuses
                pDmg = Math.floor(Math.random() * 10) + 5 + totalBonus;

                monsterHp -= pDmg;
                log.push(`Você causou ${pDmg} de dano${totalBonus > 0 ? ` (+${totalBonus} eqp)` : ''}.`);
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

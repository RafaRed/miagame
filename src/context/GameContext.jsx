import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ITEMS } from '../lib/constants';
import { generateEvent } from '../utils/eventSystem';

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
        baseAtk: 5,
        canAscend: true,
        duoId: null, // Partner UID
        duoState: null, // { hp, hunger, depth } of partner
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
        forecast: [],
        isTransformed: false,
        vengeance: false,
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
            // Artifact Mods
            let descendMod = 0;
            state.inventory.forEach(s => {
                const i = ITEMS.find(x => x.id === s.id);
                if (i?.type === 'artifact' && i.effect?.descendCost) descendMod += i.effect.descendCost * s.count;
            });

            const baseCost = action.payload.cost || 2;
            const finalCost = Math.max(0, baseCost + descendMod);

            const currentHunger = state.player.hunger;
            let newHunger = currentHunger - finalCost;
            let hpPenalty = 0;
            let newLogs = state.status.logs || [];

            if (newHunger < 0) {
                hpPenalty = Math.abs(newHunger) * 2; // 2 HP per missing hunger point
                newHunger = 0;
                newLogs = ["Você está faminto! A saúde está se deteriorando.", ...newLogs].slice(0, 50);
            }

            const newHp = Math.max(0, state.player.hp - hpPenalty);

            // Forecast Logic
            let newForecast = state.status.forecast ? [...state.status.forecast] : [];
            const hasDeepEyes = state.inventory.some(i => i.id === 'deep_eyes');

            if (newForecast.length > 0) {
                newForecast.shift();
            }

            if (hasDeepEyes) {
                const currentDepth = state.player.depth + action.payload.amount;
                while (newForecast.length < 5) {
                    // Look ahead 50m steps
                    // If we have items, look ahead from last item
                    // If not, look ahead from current
                    const lastDepth = newForecast.length > 0 ? newForecast[newForecast.length - 1].depth : currentDepth;
                    const nextDepth = lastDepth + 50;

                    const evt = generateEvent(nextDepth);
                    newForecast.push({ ...evt, depth: nextDepth });
                }
            } else {
                newForecast = [];
            }

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
                    logs: newHp < state.player.hp ? newLogs : state.status.logs,
                    forecast: newForecast
                }
            };
        }

        case 'ASCEND': {
            if (state.status.isTransformed) {
                return { ...state, status: { ...state.status, logs: ["Sua forma amaldiçoada é pesada demais para subir.", ...(state.status.logs || [])] } };
            }

            // Artifact Mods
            let climbMod = 0;
            state.inventory.forEach(s => {
                const i = ITEMS.find(x => x.id === s.id);
                if (i?.type === 'artifact' && i.effect?.climbCost) climbMod += i.effect.climbCost * s.count;
            });

            const baseCost = action.payload.cost || 2;
            const finalCost = Math.max(0, baseCost + climbMod);

            const currentHunger = state.player.hunger;
            let newHunger = currentHunger - finalCost;
            let hpPenalty = 0;
            let newLogs = state.status.logs || [];

            if (newHunger < 0) {
                hpPenalty = Math.abs(newHunger) * 3;
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
                    curseIntensity: 100,
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

        case 'TICK_FAST':
            return {
                ...state,
                status: { ...state.status, curseIntensity: Math.max(0, state.status.curseIntensity - 5) }
            };

        case 'TICK_PASSIVE':
            // Calculate Passive Effects (Regen)
            let passiveRegen = 0;
            state.inventory.forEach(slot => {
                const item = ITEMS.find(i => i.id === slot.id);
                if (item && item.type === 'artifact' && item.effect?.regen) {
                    passiveRegen += item.effect.regen * slot.count;
                }
            });

            // Apply Regen
            const tickHp = Math.min(state.player.maxHp, state.player.hp + passiveRegen);

            // Minion Bonus
            let minionGold = 0;
            const tamedList = state.stats.tamedMonsters || [];
            tamedList.forEach(m => {
                if (m.name.includes('Bico')) minionGold += 1;
                if (m.name.includes('Serpente')) minionGold += 2;
                if (m.name.includes('Devorador')) minionGold += 10;
            });

            // Outpost Mining Logic
            let newOutposts = { ...(state.outposts || {}) };
            let outpostChanged = false;
            Object.keys(newOutposts).forEach(key => {
                const op = { ...newOutposts[key] };
                if (op.automaton && op.fuel > 0) {
                    op.fuel = Math.max(0, op.fuel - 1);
                    // 20% chance to find loot
                    if (Math.random() < 0.2) {
                        const lootOpts = ['stone', 'scrap', 'monster_bone', 'abyss_dust'];
                        const lootId = lootOpts[Math.floor(Math.random() * lootOpts.length)];
                        op.storage = addToStack(op.storage || [], lootId, 1);
                    }
                    newOutposts[key] = op;
                    outpostChanged = true;
                }
            });

            // Transformation Hunger
            let hungerDrain = 0;
            // Check state.status.isTransformed ?
            // Need to verify where isTransformed lives. state.status.isTransformed.
            if (state.status.isTransformed) {
                hungerDrain = 5;
            }

            const currentHunger = state.player.hunger;
            const nextHunger = Math.max(0, currentHunger - hungerDrain);

            // Force Revert if starvation
            let nextTransformed = state.status.isTransformed;
            let tickLogs = [];

            if (state.status.isTransformed && nextHunger === 0 && currentHunger > 0) {
                nextTransformed = false;
                tickLogs.push("A transformação cessa por exaustão.");
            }

            return {
                ...state,
                player: {
                    ...state.player,
                    hp: tickHp,
                    hunger: nextHunger
                },
                resources: { ...state.resources, gold: state.resources.gold + (action.payload.gold || 0) + minionGold },
                outposts: outpostChanged ? newOutposts : state.outposts,
                status: {
                    ...state.status,
                    isTransformed: nextTransformed,
                    logs: tickLogs.length > 0 ? [...tickLogs, ...(state.status.logs || [])].slice(0, 50) : state.status.logs
                }
            };

        case 'SYNC_DUO':
            return {
                ...state,
                player: { ...state.player, duoState: action.payload }
            };



        case 'TOGGLE_TRANSFORMATION':
            // Check Artifact
            if (!state.inventory.some(i => i.id === 'cradle_of_greed')) return state;

            const newForm = !state.status.isTransformed;
            return {
                ...state,
                status: {
                    ...state.status,
                    isTransformed: newForm,
                    logs: [newForm ? "O Abismo toma conta de seu corpo..." : "Você retorna à forma humana.", ...(state.status.logs || [])].slice(0, 50)
                }
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

        case 'PROCESS_INBOX': {
            const msg = action.payload;
            let inboxLogs = [];
            let inboxHp = state.player.hp;
            let inboxHunger = state.player.hunger;
            let inboxVengeance = state.status.vengeance;

            if (msg.type === 'HEAL') {
                inboxHp = Math.min(state.player.maxHp, inboxHp + msg.amount);
                inboxLogs.push(`Parceiro enviou ${msg.amount} HP!`);
            }
            if (msg.type === 'FEED') {
                inboxHunger = Math.min(state.player.maxHunger, inboxHunger + msg.amount);
                inboxLogs.push(`Parceiro enviou suprimentos! (+${msg.amount} fome)`);
            }
            if (msg.type === 'DIED') {
                inboxVengeance = true;
                inboxLogs.push("SEU PARCEIRO CAIU NO ABISMO. VINGANÇA ATIVADA!");
            }

            return {
                ...state,
                player: { ...state.player, hp: inboxHp, hunger: inboxHunger },
                status: {
                    ...state.status,
                    vengeance: inboxVengeance,
                    logs: [...inboxLogs, ...(state.status.logs || [])].slice(0, 50)
                }
            };
        }

        case 'LIFELINE_SEND': {
            const { type: rType } = action.payload;
            let costHp = 0;
            let costHunger = 0;
            let lineLogs = [];

            if (rType === 'HP') {
                if (state.player.hp <= 25) return { ...state, status: { ...state.status, logs: ["Vida muito baixa para transferir.", ...(state.status.logs || [])] } };
                costHp = 25;
                lineLogs.push("Você sacrificou 25 HP para curar seu parceiro.");
            } else if (rType === 'RATION') {
                if (state.player.hunger <= 20) return { ...state, status: { ...state.status, logs: ["Fome demais para compartilhar.", ...(state.status.logs || [])] } };
                costHunger = 20;
                lineLogs.push("Você enviou suprimentos.");
            }

            return {
                ...state,
                player: {
                    ...state.player,
                    hp: state.player.hp - costHp,
                    hunger: state.player.hunger - costHunger
                },
                status: {
                    ...state.status,
                    logs: [...lineLogs, ...(state.status.logs || [])].slice(0, 50)
                }
            };
        }

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
                updates.baseAtk = (updates.baseAtk || 0) + reward.val;
                msg = `Treino Brutal! Atk Base +${reward.val}.`;
            }
            if (reward.type === 'item') {
                inventory = addToStack(inventory, reward.id, 1);
                const rItem = ITEMS.find(i => i.id === reward.id);
                msg = `Você recebeu: ${rItem ? rItem.name : reward.id}.`;
            }
            if (reward.type === 'restore_all') {
                updates.hp = updates.maxHp;
                updates.hunger = updates.maxHunger;
                msg = "Delicioso! Vida e Fome totalmente restaurados.";
            }
            if (reward.type === 'reveal_map') {
                msg = "O Abismo faz mais sentido agora. +1000 XP.";
                updates.xp = (updates.xp || 0) + 1000;
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

            // Check Tool Requirement
            if (recipe.tool) {
                const hasTool = state.inventory.some(i => i.id === recipe.tool);
                if (!hasTool) {
                    return {
                        ...state,
                        status: { ...state.status, logs: [`Você precisa de: ${recipe.tool} para criar isso.`, ...(state.status.logs || [])].slice(0, 50) }
                    };
                }
            }

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

        case 'DEPLOY_OUTPOST':
            // Snap to grid or just use current depth
            const depthKey = Math.floor(state.player.depth);
            // Check overlaps (simplified: exact match or strict 100m zone)
            // Ideally: find any outpost within X meters.
            const existingOutpost = Object.values(state.outposts || {}).find(o => Math.abs(o.depth - depthKey) < 200);

            if (existingOutpost) {
                return { ...state, status: { ...state.status, logs: ["Já existe um entreposto muito próximo.", ...(state.status.logs || [])] } };
            }

            // Consume Kit
            const kitIdx = state.inventory.findIndex(i => i.id === 'outpost_kit');
            if (kitIdx === -1) {
                return { ...state, status: { ...state.status, logs: ["Necessário: Kit de Entreposto.", ...(state.status.logs || [])] } };
            }

            return {
                ...state,
                inventory: removeFromStack(state.inventory, kitIdx, 1),
                outposts: {
                    ...(state.outposts || {}),
                    [depthKey]: {
                        id: Date.now(),
                        depth: depthKey,
                        fuel: 0,
                        storage: [],
                        automaton: false,
                        balloon: false
                    }
                },
                status: { ...state.status, logs: [`Entreposto estabelecido em ${depthKey}m.`, ...(state.status.logs || [])].slice(0, 50) }
            };

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

        case 'REFUEL_OUTPOST': {
            const { depth, fuelType } = action.payload;
            const op = { ...state.outposts[depth] };
            if (!op) return state;

            const fuelItem = fuelType === 'canister' ? 'fuel_canister' : 'scrap';
            const fuelAmount = fuelType === 'canister' ? 100 : 10;
            const itemIdx = state.inventory.findIndex(i => i.id === fuelItem);

            if (itemIdx === -1) return { ...state, status: { ...state.status, logs: [`Sem ${fuelItem} para reabastecer.`, ...(state.status.logs || [])] } };

            return {
                ...state,
                inventory: removeFromStack(state.inventory, itemIdx, 1),
                outposts: {
                    ...state.outposts,
                    [depth]: { ...op, fuel: op.fuel + fuelAmount }
                },
                status: { ...state.status, logs: [`Entreposto reabastecido (+${fuelAmount}).`, ...(state.status.logs || [])].slice(0, 50) }
            };
        }

        case 'INSTALL_AUTOMATON': {
            const { depth } = action.payload;
            const op = { ...state.outposts[depth] };
            const botIdx = state.inventory.findIndex(i => i.id === 'clockwork_automaton');

            if (botIdx === -1) return state;

            return {
                ...state,
                inventory: removeFromStack(state.inventory, botIdx, 1),
                outposts: {
                    ...state.outposts,
                    [depth]: { ...op, automaton: true }
                },
                status: { ...state.status, logs: [`Autômato instalado no Entreposto.`, ...(state.status.logs || [])].slice(0, 50) }
            };
        }

        case 'COLLECT_OUTPOST': {
            const { depth } = action.payload;
            const op = { ...state.outposts[depth] };
            if (!op || !op.storage || op.storage.length === 0) return state;

            let newInv = [...state.inventory];
            op.storage.forEach(slot => {
                newInv = addToStack(newInv, slot.id, slot.count);
            });

            return {
                ...state,
                inventory: newInv,
                outposts: {
                    ...state.outposts,
                    [depth]: { ...op, storage: [] }
                },
                status: { ...state.status, logs: [`Coletou itens do Entreposto.`, ...(state.status.logs || [])].slice(0, 50) }
            };
        }

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
                const transMult = state.status.isTransformed ? 2 : 1;
                const vengMult = state.status.vengeance ? 2 : 1;
                const totalMult = transMult * vengMult;

                pDmg = Math.floor((Math.random() * 10 + 5 + totalBonus) * totalMult);

                monsterHp -= pDmg;
                log.push(`Você causou ${pDmg} de dano${totalBonus > 0 ? ` (+${totalBonus} bônus)` : ''}${state.status.vengeance ? ' (VINGANÇA!)' : ''}.`);
            }

            if (monsterHp > 0) {
                if (action.payload.action !== 'FLEE') {
                    const vengVuln = state.status.vengeance ? 2 : 1;
                    mDmg = Math.floor(Math.random() * monster.power * 0.5 * vengVuln);
                    playerHp = Math.max(0, playerHp - mDmg);
                    log.push(`${monster.name} atacou! -${mDmg} HP${vengVuln > 1 ? ' (Vulnerável!)' : ''}.`);
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
            const winMonster = state.status.currentMonster;
            let winInv = [...state.inventory];
            let winGold = state.resources.gold + (winMonster.power || 10);
            let winLog = [`Vitória! +${winMonster.power} Orth.`];

            // XP Logic
            const xpGain = (winMonster.power || 10) * 5;
            let newXp = (state.player.xp || 0) + xpGain;
            let newLevel = state.player.level || 1;
            // Simple Level Up: Level * 1000 XP needed
            if (newXp >= newLevel * 1000) {
                newXp -= newLevel * 1000;
                newLevel++;
                winLog.push(`LEVEL UP! Nível ${newLevel} alcançado! (+HP/Atk)`);
            }

            // Drop Logic
            if (winMonster.drops && winMonster.drops.length > 0) {
                // 50% chance for extra drop
                winMonster.drops.forEach(dropId => {
                    if (Math.random() > 0.5) {
                        winInv = addToStack(winInv, dropId, 1);
                        // Get Name
                        const dItem = ITEMS.find(i => i.id === dropId) || {};
                        winLog.push(`Encontrou: ${dItem.name || dropId}`);
                    }
                });
            }

            return {
                ...state,
                player: {
                    ...state.player,
                    xp: newXp,
                    level: newLevel,
                    maxHp: state.player.maxHp + (newLevel > (state.player.level || 1) ? 10 : 0),
                    baseAtk: (state.player.baseAtk || 0) + (newLevel > (state.player.level || 1) ? 2 : 0)
                },
                inventory: winInv,
                resources: { ...state.resources, gold: winGold },
                status: {
                    ...state.status,
                    inCombat: false,
                    currentMonster: null,
                    currentEvent: null,
                    logs: [...winLog, ...(state.status.logs || [])].slice(0, 50)
                }
            };

        case 'COMBAT_TAME_SUCCESS':
            const tamed = action.payload;
            const currentTamed = state.stats.tamedMonsters || [];
            return {
                ...state,
                stats: { ...state.stats, tamedMonsters: [...currentTamed, tamed] },
                status: {
                    ...state.status,
                    inCombat: false,
                    currentMonster: null,
                    currentEvent: null,
                    logs: [`Você domou ${tamed.name}! Ele agora te ajuda passivamente.`, ...(state.status.logs || [])].slice(0, 50)
                }
            };

        case 'COMBAT_FLEE':
            const fleeCost = 20;
            const newHungerFlee = Math.max(0, state.player.hunger - fleeCost);
            const fleeMsg = newHungerFlee === 0 ? "Você fugiu... mas está faminto." : "Fugir custou muita energia.";
            return {
                ...state,
                player: { ...state.player, hunger: newHungerFlee },
                status: {
                    ...state.status,
                    inCombat: false,
                    currentMonster: null,
                    currentEvent: null,
                    combatLog: [],
                    logs: [fleeMsg, ...(state.status.logs || [])].slice(0, 50)
                }
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

        case 'SET_DUO_ID':
            return { ...state, player: { ...state.player, duoId: action.payload } };

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

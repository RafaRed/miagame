import layer0 from '../assets/images/layers/0.png';
import layer1 from '../assets/images/layers/1.png';
import layer2 from '../assets/images/layers/2.png';
import layer3 from '../assets/images/layers/3.png';
import layer4 from '../assets/images/layers/4.png';
import layer5 from '../assets/images/layers/5.png';
import layer6 from '../assets/images/layers/6.png';

export const ITEMS = [
    // --- Materials ---
    { id: 'scrap', name: 'Sucata', type: 'material', price: 25, icon: 'cog', color: 'text-stone-500', desc: "Restos de tecnologia antiga." },
    { id: 'abyss_dust', name: 'Pó do Abismo', type: 'material', price: 40, icon: 'wind', color: 'text-purple-400', desc: "Poeira com propriedades místicas." },
    { id: 'monster_bone', name: 'Osso', type: 'material', price: 30, icon: 'bone', color: 'text-stone-300', desc: "Material resistente para criação." },

    // --- Consumables ---
    { id: 'ration', name: 'Ração', type: 'consumable', price: 15, effect: { hunger: 40 }, icon: 'bread-slice', color: 'text-amber-600', desc: "Comida básica. +40 Fome." },
    { id: 'medkit', name: 'Kit Médico', type: 'consumable', price: 100, effect: { hp: 50 }, icon: 'first-aid', color: 'text-rose-500', desc: "Primeiros socorros. +50 Vida." },
    { id: 'meat', name: 'Carne Crua', type: 'consumable', price: 50, effect: { hunger: 50, hp: -5 }, icon: 'drumstick', color: 'text-red-700', desc: "Nutritiva mas perigosa. +50 Fome, -5 Vida." },
    { id: 'cooked_meat', name: 'Bife', type: 'consumable', price: 85, effect: { hunger: 80, hp: 15 }, icon: 'utensils', color: 'text-orange-500', desc: "Bem passado. +80 Fome, +15 Vida." },

    // --- Basic Loot ---
    { id: 'stone', name: 'Minério Comum', type: 'loot', price: 20, icon: 'box', color: 'text-slate-600', desc: "Pode conter traços de minérios valiosos." },
    { id: 'relic_fragment', name: 'Fragmento de Relíquia', type: 'loot', price: 180, icon: 'shapes', color: 'text-cyan-400', desc: "Parte de algo maior. Muito valioso." },

    // --- ARTIFACTS (Passive Effects in Inventory) ---
    // Survival
    { id: 'blue_necklace', name: 'Colar de Pedra Azul', type: 'artifact', price: 2000, effect: { regen: 1 }, icon: 'gem', color: 'text-blue-400', desc: "Emite uma luz suave. Regenera 1 HP por segundo.", rarity: 2 },
    { id: 'marmulchan', name: 'Marmulchan', type: 'artifact', price: 1500, effect: { hungerRate: 0.8 }, icon: 'utensils', color: 'text-orange-300', desc: "Especiaria do Abismo. Reduz a fome em 20%.", rarity: 3 },
    { id: 'sun_stone', name: 'Pedra Solar', type: 'artifact', price: 3000, effect: { curseResist: 0.1 }, icon: 'sun', color: 'text-yellow-500', desc: "Aquece o corpo. Leve resistência à Maldição.", rarity: 2 },
    { id: 'feather_token', name: 'Pena Eterna', type: 'artifact', price: 2500, effect: { descendCost: -1 }, icon: 'feather', color: 'text-white', desc: "Torna você leve. Descer cansa menos.", rarity: 3 },

    // Economy & Utility
    { id: 'golden_skull', name: 'Crânio Dourado', type: 'artifact', price: 5000, effect: { goldMod: 1.2 }, icon: 'coins', color: 'text-yellow-400', desc: "Atrai riqueza. +20% Ouro em batalhas.", rarity: 1 },
    { id: 'survival_guide', name: 'Guia de Sobrevivência', type: 'artifact', price: 1000, effect: { xpMod: 1.1 }, icon: 'book', color: 'text-green-400', desc: "Anotações antigas. +10% XP.", rarity: 3 },
    { id: 'merchant_scale', name: 'Balança de Comércio', type: 'artifact', price: 4000, effect: { sellMod: 1.1 }, icon: 'scale', color: 'text-amber-200', desc: "Permite negociar melhor. +10% venda.", rarity: 2 },

    // Lore Relics (Functionals)
    { id: 'star_thread', name: 'Fio Estelar', type: 'artifact', price: 800, icon: 'wind', color: 'text-blue-200', desc: "Brilha no escuro. (Decorativo)", rarity: 4 },
    { id: 'unheard_bell', name: 'Sino Mudo', type: 'artifact', price: 1200, icon: 'bell', color: 'text-slate-400', desc: "Toca apenas para monstros. (Atrai Inimigos - Não impl.)", rarity: 3 },
    { id: 'deep_eyes', name: 'Olhos da Profundeza', type: 'artifact', price: 6000, effect: { scout: true }, icon: 'eye', color: 'text-purple-500', desc: "Permite ver perigos antes de agir. (Futuro: Scout)", rarity: 1 },

    // --- 50 SPECIAL RELICS (Grade 4-1) ---
    // Grade 4 (Junk/Common but fun)
    { id: 'bent_spoon', name: 'Colher Entortada', type: 'relic', price: 50, icon: 'utensils', color: 'text-slate-500', desc: "Alguém tentou comer algo muito duro.", rarity: 4 },
    { id: 'broken_whistle', name: 'Apito Quebrado', type: 'relic', price: 80, icon: 'mic-off', color: 'text-red-900', desc: "Traz más memórias.", rarity: 4 },
    { id: 'petrified_branch', name: 'Galho Petrificado', type: 'relic', price: 100, icon: 'tree', color: 'text-stone-600', desc: "Eternamente duro.", rarity: 4 },
    { id: 'strange_bug', name: 'Inseto Estranho', type: 'relic', price: 120, icon: 'bug', color: 'text-green-700', desc: "Ainda se mexe.", rarity: 4 },
    { id: 'rusted_gear', name: 'Engrenagem Enferrujada', type: 'relic', price: 150, icon: 'settings', color: 'text-orange-900', desc: "Parte de uma máquina antiga.", rarity: 4 },

    // Grade 3 (Uncommon - Functional/Crafting)
    { id: 'flame_shell', name: 'Concha Flamejante', type: 'artifact', price: 800, effect: { temp: 1 }, icon: 'flame', color: 'text-red-500', desc: "Sempre quente. Útil no frio.", rarity: 3 },
    { id: 'hard_scale', name: 'Escama Dura', type: 'material', price: 300, icon: 'shield', color: 'text-green-800', desc: "Material de forja.", rarity: 3 },
    { id: 'luminous_moss', name: 'Musgo Luminoso', type: 'artifact', price: 400, icon: 'sun', color: 'text-green-300', desc: "Iluminação natural.", rarity: 3 },
    { id: 'ancient_coin', name: 'Moeda Antiga', type: 'loot', price: 1000, icon: 'circle', color: 'text-yellow-600', desc: "Moeda de uma civilização perdida.", rarity: 3 },
    { id: 'void_dust', name: 'Pó do Vazio', type: 'material', price: 500, icon: 'cloud', color: 'text-purple-800', desc: "Material alquímico.", rarity: 3 },

    // Grade 2 (Rare - Powerful Artifacts)
    { id: 'guardian_charm', name: 'Amuleto Guardião', type: 'equip', slot: 'charm', price: 3000, effect: { def: 5 }, icon: 'shield', color: 'text-blue-500', desc: "+5 Defesa.", rarity: 2 },
    { id: 'lucky_rabbit', name: 'Pé de Coelho', type: 'artifact', price: 2500, effect: { luck: 0.1 }, icon: 'stars', color: 'text-pink-400', desc: "Aumenta chance de drops raros.", rarity: 2 },
    { id: 'vampire_tooth', name: 'Dente de Vampiro', type: 'artifact', price: 4000, effect: { lifesteal: 1 }, icon: 'droplet', color: 'text-red-600', desc: "Recupera 1 HP ao atacar.", rarity: 2 },
    { id: 'titan_bone', name: 'Osso de Titã', type: 'material', price: 2000, icon: 'bone', color: 'text-stone-100', desc: "Indestrutível.", rarity: 2 },
    { id: 'phantom_cloak', name: 'Capa Fantasma', type: 'artifact', price: 3500, effect: { fleeChance: 0.2 }, icon: 'ghost', color: 'text-slate-300', desc: "+20% Chance de Fuga.", rarity: 2 },

    // Grade 1 (Legendary - Game Changers)
    { id: 'white_whistle', name: 'Apito Branco', type: 'relic', price: 10000, icon: 'bone', color: 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', desc: "Símbolo máximo de status.", rarity: 1 },
    { id: 'abyss_map', name: 'Mapa do Neto', type: 'artifact', price: 8000, effect: { scout: true }, icon: 'map', color: 'text-yellow-200', desc: "Revela segredos.", rarity: 1 },
    { id: 'time_glass', name: 'Ampulheta do Tempo', type: 'consumable', price: 12000, useEffect: 'TIME_REVERT', icon: 'hourglass', color: 'text-amber-500', desc: "Volta 100m. Pode quebrar.", rarity: 1 },
    { id: 'soul_stone', name: 'Pedra da Alma', type: 'consumable', price: 5000, effect: { revive: true }, icon: 'heart', color: 'text-rose-400', desc: "Te traz de volta à vida (Automático). Consome ao usar.", rarity: 1 },
    { id: 'curse_warding_box', name: 'Caixa Anti-Maldição', type: 'artifact', price: 15000, effect: { curseImmunity: true }, icon: 'box', color: 'text-stone-200', desc: "Imunidade à Maldição (Ativo se carregado).", rarity: 1 },

    // --- EQUIPMENT ---
    { id: 'pickaxe', name: 'Picareta', type: 'equip', slot: 'weapon', price: 500, effect: { atk: 10 }, icon: 'hammer', color: 'text-slate-300', desc: "Ferramenta básica. +10 Atk." },
    { id: 'war_pick', name: 'Picareta de Guerra', type: 'equip', slot: 'weapon', price: 2000, effect: { atk: 25 }, icon: 'hammer', color: 'text-red-400', desc: "Feita para matar. +25 Atk." },
    { id: 'blaze_reap', name: 'Blaze Reap', type: 'equip', slot: 'weapon', price: 5000, effect: { atk: 80 }, icon: 'gavel', color: 'text-orange-500', desc: "Explosiva. +80 Atk." },
    { id: 'reg_arm', name: 'Braço Mecânico', type: 'equip', slot: 'weapon', price: 99999, effect: { atk: 500 }, maxUses: 10, icon: 'zap', color: 'text-yellow-500', desc: "Arma suprema. 10 usos antes de quebrar." },

    { id: 'star_compass', name: 'Bússola Estelar', type: 'consumable', price: 1000, useEffect: 'SCAN_EVENT', icon: 'compass', color: 'text-blue-400', desc: "Revela eventos próximos.", rarity: 2 },
    { id: 'thousand_men_wedge', name: 'Cunha de Mil Homens', type: 'equip', slot: 'charm', price: 2500, effect: { str: 5 }, icon: 'triangle', color: 'text-red-500', desc: "+5 Força." },

    // --- APPRAISAL BASE ---
    { id: 'dirty_relic', name: 'Relíquia Suja', type: 'relic_raw', price: 60, icon: 'box', color: 'text-stone-400', desc: "Precisa ser avaliada.", rarity: 1 },
    // --- CRAFTING / SPECIAL ---
    { id: 'outpost_kit', name: 'Kit de Entreposto', type: 'item', price: 2000, icon: 'tent', color: 'text-indigo-500', desc: "Permite construir uma base segura." },
    { id: 'fuel_canister', name: 'Combustível', type: 'material', price: 100, icon: 'flame', color: 'text-amber-600', desc: "Alimenta autômatos." },

    // --- COOKING (Requires Pot) ---
    { id: 'monster_stew', name: 'Ensopado de Monstro', type: 'consumable', price: 150, effect: { hunger: 100, hp: 20 }, icon: 'soup', color: 'text-orange-400', desc: "Nutritivo e quente." },
    { id: 'bug_skewer', name: 'Espetinho de Inseto', type: 'consumable', price: 60, effect: { hunger: 50 }, icon: 'drumstick', color: 'text-green-600', desc: "Crocante." },

    // --- ARTIFACTS (Passive Effects / Machines) ---
    { id: 'abyss_cooking_pot', name: 'Panela do Abismo', type: 'artifact', price: 1500, icon: 'utensils', color: 'text-stone-300', desc: "Permite cozinhar em qualquer lugar.", rarity: 2 },
    { id: 'clockwork_automaton', name: 'Autômato de Mineração', type: 'item', price: 3000, icon: 'bot', color: 'text-cyan-600', desc: "Trabalhador incansável para seus entrepostos.", rarity: 2 },
    { id: 'transmission_coil', name: 'Bobina de Transmissão', type: 'artifact', price: 4000, icon: 'wifi', color: 'text-purple-400', desc: "Envia itens do entreposto para a superfície.", rarity: 1 },
    { id: 'cradle_of_greed', name: 'Berço da Ganância', type: 'artifact', price: 12000, icon: 'skull', color: 'text-red-600', desc: "Permite Manifestação (Transformação). Perigoso.", rarity: 0 },
    { id: 'deep_eyes', name: 'Olhos da Profundeza', type: 'artifact', price: 6000, effect: { scout: true }, icon: 'eye', color: 'text-purple-500', desc: "Permite ver perigos antes de agir.", rarity: 1 },
];

export const MONSTERS = [
    { name: "Bico de Martelo", power: 20, drops: ['meat', 'monster_bone'], chance: 0.6 },
    { name: "Serpente", power: 50, drops: ['meat', 'abyss_dust', 'dirty_relic'], chance: 0.4 },
    { name: "Devorador", power: 120, drops: ['relic_fragment', 'monster_bone', 'dirty_relic'], chance: 0.3 }
];

// NPCs & Events
export const NPCS = [
    {
        id: 'ozen',
        name: 'Ozen, a Imóvel',
        title: 'Apito Branco',
        minDepth: 1800,
        maxDepth: 2600,
        chance: 0.02,
        dialogue: "Oh? Um ratinho perdido... Quer ser esmagado ou treinado?",
        img: 'ozen_silhouette', // Placeholder for icon mapping
        options: [
            { id: 'train_str', label: 'Treino Brutal', costLabel: '-50 HP, -50 Fome', cost: { hp: 50, hunger: 50 }, reward: { type: 'buff_str', val: 5 }, text: "Ela te espanca sem piedade. Seus ossos cicatrizam mais fortes." },
            { id: 'buy_box', label: 'Comprar Caixa O.D.', costLabel: '5000 Orth', cost: { gold: 5000 }, reward: { type: 'item', id: 'curse_warding_box' }, text: "Uma caixa pesada feita de relíquia." }
        ]
    },
    {
        id: 'nanachi',
        name: 'Nanachi',
        title: 'Narehate',
        minDepth: 3900,
        maxDepth: 4500,
        chance: 0.03,
        dialogue: "Naaa... Você cheira bem. Quer que eu cozinhe algo?",
        img: 'nanachi_silhouette',
        options: [
            { id: 'cook_meal', label: 'Comer "Comida Especial"', costLabel: '1000 Orth', cost: { gold: 1000 }, reward: { type: 'restore_all' }, text: "O gosto é horrível, mas você se sente renovado." },
            { id: 'ask_tips', label: 'Dicas do Abismo', costLabel: 'Grátis', cost: {}, reward: { type: 'reveal_map' }, text: "Nanachi te ensina a ver o fluxo de consciência." }
        ]
    },
    {
        id: 'bondrewd',
        name: 'Bondrewd',
        title: 'O Soberano da Alvorada',
        minDepth: 12000,
        maxDepth: 14000,
        chance: 0.02,
        dialogue: "Oya oya... Um triunfo maravilhoso. Gostaria de participar de um experimento?",
        img: 'bondrewd_silhouette',
        options: [
            { id: 'humanity_trade', label: 'Vender Humanidade', costLabel: 'Sua Humanidade', cost: { humanity: 'all' }, reward: { type: 'item', id: 'cartridge' }, text: "Você se sente vazio, mas protegido." },
            { id: 'blessing', label: 'Receber Bênção', costLabel: '-90% HP Máx', cost: { maxHp_percent: 0.9 }, reward: { type: 'relic_legendary' }, text: "Uma dor excruciante... seguida de poder." }
        ]
    }
];

export const RECIPES = [
    { res: 'cooked_meat', req: { 'meat': 1 }, desc: "Cozinhar carne." },
    { res: 'monster_stew', req: { 'meat': 2, 'ration': 1 }, desc: "Ensopado nutritivo. (Req: Panela)", tool: 'abyss_cooking_pot' },
    { res: 'bug_skewer', req: { 'meat': 1, 'monster_bone': 1 }, desc: "Comida de emergência." },
    { res: 'outpost_kit', req: { 'scrap': 10, 'monster_bone': 10, 'abyss_dust': 5 }, desc: "Kit para montar base." },
    { res: 'fuel_canister', req: { 'scrap': 2, 'abyss_dust': 1 }, desc: "Combustível para máquinas." },
    { res: 'medkit', req: { 'scrap': 2, 'abyss_dust': 1 }, desc: "Remédio caseiro." },
    { res: 'pickaxe', req: { 'scrap': 5, 'monster_bone': 2 }, desc: "Arma básica." },
    { res: 'thousand_men_wedge', req: { 'relic_fragment': 10, 'monster_bone': 20 }, desc: "Relíquia de força bruta." }
];

export const LAYERS = [
    { name: "Borda do Abismo", min: 0, max: 1350, img: layer0, curse: "Leve Tontura" },
    { name: "Floresta da Tentação", min: 1351, max: 2600, img: layer1, curse: "Náusea Intensa" },
    { name: "A Grande Falha", min: 2601, max: 7000, img: layer2, curse: "Alucinações" },
    { name: "Cálices de Gigantes", min: 7001, max: 12000, img: layer3, curse: "Sangramento" },
    { name: "Mar de Cadáveres", min: 12001, max: 13000, img: layer4, curse: "Perda dos Sentidos" },
    { name: "Capital sem Retorno", min: 13001, max: 15500, img: layer5, curse: "Perda da Humanidade" },
    { name: "O Turbilhão Final", min: 15501, max: 99999, img: layer6, curse: "Morte Certa" },
];

export const getWhistleRank = (depth) => {
    if (depth < 1350) return { name: "Apito Vermelho", color: "bg-red-500", shadow: "shadow-red-500/50" };
    if (depth < 2600) return { name: "Apito Azul", color: "bg-blue-600", shadow: "shadow-blue-600/50" };
    if (depth < 7000) return { name: "Apito da Lua", color: "bg-purple-600", shadow: "shadow-purple-600/50" };
    if (depth < 12000) return { name: "Apito Preto", color: "bg-slate-900", shadow: "shadow-black/50" };
    return { name: "Apito Branco", color: "bg-white", shadow: "shadow-white/50" };
};

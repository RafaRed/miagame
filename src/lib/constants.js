import layer0 from '../assets/images/layers/0.png';
import layer1 from '../assets/images/layers/1.png';
import layer2 from '../assets/images/layers/2.png';
import layer3 from '../assets/images/layers/3.png';
import layer4 from '../assets/images/layers/4.png';
import layer5 from '../assets/images/layers/5.png';
import layer6 from '../assets/images/layers/6.png';

export const ITEMS = [
    // ... existing items start
    // Materials
    { id: 'scrap', name: 'Sucata', type: 'material', price: 25, icon: 'cog', color: 'text-stone-500', desc: "Restos de tecnologia antiga." },
    { id: 'abyss_dust', name: 'Pó do Abismo', type: 'material', price: 40, icon: 'wind', color: 'text-purple-400', desc: "Poeira com propriedades místicas." },
    { id: 'monster_bone', name: 'Osso', type: 'material', price: 30, icon: 'bone', color: 'text-stone-300', desc: "Material resistente para criação." },

    // Consumables
    { id: 'ration', name: 'Ração', type: 'consumable', price: 15, effect: { hunger: 40 }, icon: 'bread-slice', color: 'text-amber-600', desc: "Comida básica. +40 Fome." },
    { id: 'medkit', name: 'Kit Médico', type: 'consumable', price: 100, effect: { hp: 50 }, icon: 'first-aid', color: 'text-rose-500', desc: "Primeiros socorros. +50 Vida." },
    { id: 'meat', name: 'Carne Crua', type: 'consumable', price: 50, effect: { hunger: 50, hp: -5 }, icon: 'drumstick', color: 'text-red-700', desc: "Nutritiva mas perigosa. +50 Fome, -5 Vida." },
    { id: 'cooked_meat', name: 'Bife', type: 'consumable', price: 85, effect: { hunger: 80, hp: 15 }, icon: 'utensils', color: 'text-orange-500', desc: "Bem passado. +80 Fome, +15 Vida." },

    // Loot
    { id: 'stone', name: 'Minério Comum', type: 'loot', price: 20, icon: 'box', color: 'text-slate-600', desc: "Pode conter traços de minérios valiosos." },
    { id: 'relic_fragment', name: 'Fragmento de Relíquia', type: 'loot', price: 180, icon: 'shapes', color: 'text-cyan-400', desc: "Parte de algo maior. Muito valioso." },
    { id: 'sun_sphere', name: 'Esfera Solar', type: 'loot', price: 250, icon: 'sun', color: 'text-amber-300', desc: "Brilha eternamente." },

    // Appraisal Items
    { id: 'dirty_relic', name: 'Relíquia Suja', type: 'relic_raw', price: 60, icon: 'box', color: 'text-stone-400', desc: "Precisa ser avaliada.", rarity: 1 },

    // Grade 4 (Common)
    { id: 'eternal_torch', name: 'Tocha Eterna', type: 'relic', price: 200, icon: 'sun', color: 'text-orange-400', desc: "Nunca se apaga. Ilumina o caminho.", rarity: 4 },
    { id: 'hollow_vessel', name: 'Vaso Vazio', type: 'relic', price: 180, icon: 'box', color: 'text-slate-400', desc: "Estranhamente leve.", rarity: 4 },

    // Grade 3 (Uncommon)
    { id: 'star_compass_broken', name: 'Bússola Quebrada', type: 'relic', price: 350, icon: 'compass', color: 'text-slate-500', desc: "Ainda aponta para o fundo...", rarity: 3 },
    { id: 'fog_weave', name: 'Tecido de Névoa', type: 'relic', price: 400, icon: 'wind', color: 'text-gray-300', desc: "Leve como ar. Usado em roupas.", rarity: 3 },

    // Grade 2 (Rare - usable/equipable in future)
    { id: 'thousand_men_wedge', name: 'Cunha de Mil Homens', type: 'equip', slot: 'charm', price: 2500, effect: { str: 5 }, icon: 'triangle', color: 'text-red-500', desc: "Concede força sobre-humana. +5 Força.", rarity: 2 },
    { id: 'life_stone', name: 'Pedra da Vida', type: 'consumable', price: 1500, effect: { hp: 100, hunger: 100 }, icon: 'heart', color: 'text-rose-600', desc: "Restaura vitalidade completa.", rarity: 2 },

    // Grade 1 (Legendary)
    { id: 'white_whistle', name: 'Apito Branco', type: 'relic', price: 5000, icon: 'bone', color: 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', desc: "Símbolo lendário. Vale uma fortuna.", rarity: 1 },
    { id: 'abyss_map', name: 'Mapa do Neto', type: 'relic', price: 4000, icon: 'compass', color: 'text-yellow-200', desc: "Revela atalhos seguros.", rarity: 1 },
    { id: 'sun_sphere', name: 'Esfera Solar', type: 'relic', price: 3000, icon: 'sun', color: 'text-amber-300', desc: "Contém a luz de uma estrela.", rarity: 1 },

    // NPC / Special Items
    { id: 'curse_warding_box', name: 'Caixa Anti-Maldição', type: 'relic', price: 8000, icon: 'box', color: 'text-stone-200', desc: "Permite subir sem sofrer a maldição (Uso Único).", rarity: 1 },
    { id: 'cartridge', name: 'Cartucho', type: 'item', price: 10000, icon: 'battery', color: 'text-pink-500', desc: "Contém a 'Bênção'. Cruel, mas eficiente.", rarity: 0 },
    { id: 'book_of_abyss', name: 'Livro do Abismo', type: 'key_item', price: 0, icon: 'book', color: 'text-indigo-400', desc: "Catalogar descobertas.", rarity: 0 },

    // New Lore Relics with Effects
    { id: 'nil_stars', name: 'Estrelas do Nada', type: 'relic', price: 600, icon: 'shapes', color: 'text-blue-200', desc: "Fragmentos que flutuam sozinhos.", rarity: 3 },
    { id: 'ether_crystal', name: 'Cristal de Éter', type: 'relic', price: 900, icon: 'zap', color: 'text-cyan-400', desc: "Vibra com energia pura.", rarity: 3 },
    { id: 'grim_cup', name: 'Cálice Sombrio', type: 'relic', price: 1200, icon: 'utensils', color: 'text-purple-900', desc: "Qualquer líquido colocado aqui ferve.", rarity: 2 },
    { id: 'golden_city_shard', name: 'Fragmento Dourado', type: 'relic', price: 4500, icon: 'sun', color: 'text-yellow-400', desc: "Pedaço da lendária Cidade Dourada.", rarity: 1 },

    // Grade Special (Aubade)
    { id: 'reg_arm', name: 'Braço Mecânico', type: 'equip', slot: 'weapon', price: 9999, effect: { atk: 500 }, icon: 'zap', color: 'text-yellow-500 border-yellow-500 animate-pulse', desc: "Incinerador. Poder destrutivo total.", rarity: 0 },
    { id: 'blaze_reap', name: 'Blaze Reap', type: 'equip', slot: 'weapon', price: 2500, effect: { atk: 80 }, icon: 'gavel', color: 'text-orange-500', desc: "Arma lendária explosiva. +80 Ataque." },

    // Equip
    { id: 'pickaxe', name: 'Picareta', type: 'equip', slot: 'weapon', price: 500, effect: { atk: 20 }, icon: 'hammer', color: 'text-slate-300', desc: "Arma improvisada. +20 Ataque." },
    { id: 'star_compass', name: 'Bússola Estelar', type: 'equip', slot: 'charm', price: 1000, effect: { speed: 1.5 }, icon: 'compass', color: 'text-blue-400', desc: "Mostra o caminho. Desça mais rápido." },
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

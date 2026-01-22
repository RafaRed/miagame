export const ITEMS = [
    // Materials
    { id: 'scrap', name: 'Sucata', type: 'material', price: 10, icon: 'cog', color: 'text-stone-500', desc: "Restos de tecnologia antiga." },
    { id: 'abyss_dust', name: 'Pó do Abismo', type: 'material', price: 25, icon: 'wind', color: 'text-purple-400', desc: "Poeira com propriedades místicas." },
    { id: 'monster_bone', name: 'Osso', type: 'material', price: 15, icon: 'bone', color: 'text-stone-300', desc: "Material resistente para criação." },

    // Consumables
    { id: 'ration', name: 'Ração', type: 'consumable', price: 25, effect: { hunger: 25 }, icon: 'bread-slice', color: 'text-amber-600', desc: "Comida básica. +25 Fome." },
    { id: 'medkit', name: 'Kit Médico', type: 'consumable', price: 100, effect: { hp: 50 }, icon: 'first-aid', color: 'text-rose-500', desc: "Primeiros socorros. +50 Vida." },
    { id: 'meat', name: 'Carne Crua', type: 'consumable', price: 40, effect: { hunger: 40, hp: -5 }, icon: 'drumstick', color: 'text-red-700', desc: "Nutritiva mas perigosa. +40 Fome, -5 Vida." },
    { id: 'cooked_meat', name: 'Bife', type: 'consumable', price: 60, effect: { hunger: 60, hp: 10 }, icon: 'utensils', color: 'text-orange-500', desc: "Bem passado. +60 Fome, +10 Vida." },

    // Loot
    { id: 'stone', name: 'Pedra', type: 'loot', price: 5, icon: 'box', color: 'text-slate-600', desc: "Apenas uma pedra." },
    { id: 'relic_shard', name: 'Fragmento de Relíquia', type: 'loot', price: 100, icon: 'shapes', color: 'text-cyan-400', desc: "Parte de algo maior. Muito valioso." },
    { id: 'sun_sphere', name: 'Esfera Solar', type: 'loot', price: 150, icon: 'sun', color: 'text-amber-300', desc: "Brilha eternamente." },

    // Appraisal Items
    { id: 'dirty_relic', name: 'Relíquia Suja', type: 'relic_raw', price: 50, icon: 'box', color: 'text-stone-400', desc: "Precisa ser avaliada para revelar seu valor.", rarity: 1 },
    { id: 'white_whistle', name: 'Apito Branco', type: 'relic', price: 5000, icon: 'bone', color: 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]', desc: "Símbolo lendário. Vale uma fortuna." },
    { id: 'abyss_map', name: 'Mapa Antigo', type: 'relic', price: 800, icon: 'compass', color: 'text-emerald-300', desc: "Um mapa de uma camada esquecida." },
    { id: 'star_compass_broken', name: 'Bússola Quebrada', type: 'relic', price: 200, icon: 'compass', color: 'text-slate-500', desc: "Ainda aponta para o fundo..." },

    // Equip
    { id: 'pickaxe', name: 'Picareta', type: 'equip', slot: 'weapon', price: 500, effect: { atk: 20 }, icon: 'hammer', color: 'text-slate-300', desc: "Arma improvisada. +20 Ataque." },
    { id: 'star_compass', name: 'Bússola Estelar', type: 'equip', slot: 'charm', price: 1000, effect: { speed: 1.5 }, icon: 'compass', color: 'text-blue-400', desc: "Mostra o caminho. Desça mais rápido." },
    { id: 'blaze_reap', name: 'Blaze Reap', type: 'equip', slot: 'weapon', price: 2500, effect: { atk: 80 }, icon: 'gavel', color: 'text-orange-500', desc: "Arma lendária explosiva. +80 Ataque." }
];

export const MONSTERS = [
    { name: "Bico de Martelo", power: 20, drops: ['meat', 'monster_bone'], chance: 0.6 },
    { name: "Serpente", power: 50, drops: ['meat', 'abyss_dust'], chance: 0.4 },
    { name: "Devorador", power: 120, drops: ['relic_shard', 'monster_bone'], chance: 0.3 }
];

export const RECIPES = [
    { res: 'cooked_meat', req: { 'meat': 1 }, desc: "Cozinhar carne." },
    { res: 'medkit', req: { 'scrap': 2, 'abyss_dust': 1 }, desc: "Remédio caseiro." },
    { res: 'pickaxe', req: { 'scrap': 5, 'monster_bone': 2 }, desc: "Arma básica." }
];

export const LAYERS = [
    { name: "Borda do Abismo", min: 0, max: 1350, img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80", curse: "Leve Tontura" },
    { name: "Floresta da Tentação", min: 1351, max: 2600, img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80", curse: "Náusea Intensa" },
    { name: "A Grande Falha", min: 2601, max: 7000, img: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&q=80", curse: "Alucinações" },
    { name: "Cálices de Gigantes", min: 7001, max: 12000, img: "https://images.unsplash.com/photo-1508264367332-9cb8dc22180c?auto=format&fit=crop&q=80", curse: "Sangramento" },
    { name: "Mar de Cadáveres", min: 12001, max: 13000, img: "https://images.unsplash.com/photo-1463123081275-7359ea4bc837?auto=format&fit=crop&q=80", curse: "Perda dos Sentidos" },
    { name: "Capital sem Retorno", min: 13001, max: 15500, img: "https://images.unsplash.com/photo-1592388796828-569d6c29c5ac?auto=format&fit=crop&q=80", curse: "Perda da Humanidade" },
    { name: "O Turbilhão Final", min: 15501, max: 99999, img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80", curse: "Morte Certa" },
];

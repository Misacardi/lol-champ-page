import { useHttp } from "../hooks/http.hook";

const DATA_DRAGON_URL = "https://ddragon.leagueoflegends.com";
const LOCALE = "en_US";

let currentVersion;

const removeHtmlTags = (text = "") => text.replace(/<[^>]*>/g, "");

const getSpellValues = (values = []) =>
  values.filter((value) => value !== null && value !== undefined);

const getDifficulty = (difficulty) => {
  if (difficulty <= 3) {
    return "low";
  }

  if (difficulty <= 7) {
    return "mid";
  }

  return "high";
};

const getItemCategory = (tags = []) => {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  if (normalizedTags.includes("boots")) {
    return "boots";
  }

  if (
    normalizedTags.some((tag) =>
      ["consumable", "trinket", "vision", "stealth"].includes(tag)
    )
  ) {
    return "consumable";
  }

  if (normalizedTags.some((tag) => ["goldper", "aura", "active"].includes(tag))) {
    return "support";
  }

  if (
    normalizedTags.some((tag) =>
      ["spellblock", "armor", "health", "healthregen"].includes(tag)
    )
  ) {
    return "defense";
  }

  if (
    normalizedTags.some((tag) =>
      ["spelldamage", "magicpenetration", "mana", "manaregen"].includes(tag)
    )
  ) {
    return "magic";
  }

  if (
    normalizedTags.some((tag) =>
      ["damage", "criticalstrike", "attackspeed", "lifesteal", "armorpenetration"].includes(tag)
    )
  ) {
    return "damage";
  }

  return "other";
};

const itemCategoryOrder = [
  "damage",
  "magic",
  "defense",
  "boots",
  "support",
  "consumable",
  "other",
];

const useChampionService = () => {
  const { request } = useHttp();

  const getCurrentVersion = async () => {
    if (!currentVersion) {
      const versions = await request(`${DATA_DRAGON_URL}/api/versions.json`);
      currentVersion = versions[0];
    }

    return currentVersion;
  };

  const getChampion = async (id) => {
    const version = await getCurrentVersion();
    const response = await request(
      `${DATA_DRAGON_URL}/cdn/${version}/data/${LOCALE}/champion/${encodeURIComponent(id)}.json`
    );
    const champion = response.data[id];
    const getSplashImage = (skinNumber) =>
      `${DATA_DRAGON_URL}/cdn/img/champion/splash/${champion.id}_${skinNumber}.jpg`;

    const passive = {
      name: champion.passive.name,
      description: removeHtmlTags(champion.passive.description),
      img: `${DATA_DRAGON_URL}/cdn/${version}/img/passive/${champion.passive.image.full}`,
      isPassive: true,
    };

    const spells = champion.spells.map((spell) => ({
      name: spell.name,
      description: removeHtmlTags(spell.description),
      img: `${DATA_DRAGON_URL}/cdn/${version}/img/spell/${spell.image.full}`,
      maxRank: spell.maxrank,
      cooldown: spell.cooldownBurn,
      cooldownValues: getSpellValues(spell.cooldown),
      cost: spell.costBurn,
      costValues: getSpellValues(spell.cost),
      resourceName: champion.partype || "Resource",
      range: spell.rangeBurn,
    }));

    return {
      id: champion.id,
      name: champion.name,
      subtitle: champion.title,
      description: champion.lore,
      role: champion.tags[0].toLowerCase(),
      roles: champion.tags.map((role) => role.toLowerCase()),
      difficulty: getDifficulty(champion.info.difficulty),
      stats: {
        health: champion.stats.hp,
        healthPerLevel: champion.stats.hpperlevel,
        resource: champion.stats.mp,
        resourcePerLevel: champion.stats.mpperlevel,
        resourceName: champion.partype || "Resource",
        attackDamage: champion.stats.attackdamage,
        attackDamagePerLevel: champion.stats.attackdamageperlevel,
        attackSpeed: champion.stats.attackspeed,
        attackSpeedPerLevel: champion.stats.attackspeedperlevel,
        armor: champion.stats.armor,
        armorPerLevel: champion.stats.armorperlevel,
        magicResist: champion.stats.spellblock,
        magicResistPerLevel: champion.stats.spellblockperlevel,
        moveSpeed: champion.stats.movespeed,
        attackRange: champion.stats.attackrange,
      },
      img: getSplashImage(0),
      skils: [passive, ...spells],
      skins: champion.skins
        .filter((skin) => !skin.parentSkin)
        .map((skin) => ({
          id: skin.id,
          name: skin.num === 0 ? champion.name : skin.name,
          img: getSplashImage(skin.num),
          hasChroma: Boolean(skin.chromas),
        })),
    };
  };

  const getChampionList = async () => {
    const version = await getCurrentVersion();
    const response = await request(
      `${DATA_DRAGON_URL}/cdn/${version}/data/${LOCALE}/champion.json`
    );

    return Object.values(response.data).map((champion) => ({
      id: champion.id,
      name: champion.name,
      role: champion.tags[0].toLowerCase(),
      roles: champion.tags.map((role) => role.toLowerCase()),
      img: `${DATA_DRAGON_URL}/cdn/img/champion/splash/${champion.id}_0.jpg`,
    }));
  };

  const getItemList = async () => {
    const version = await getCurrentVersion();
    const response = await request(
      `${DATA_DRAGON_URL}/cdn/${version}/data/${LOCALE}/item.json`
    );

    return Object.entries(response.data)
      .filter(([, item]) => {
        const isSummonersRiftItem = item.maps?.["11"] !== false;
        const isShopItem = item.inStore !== false;
        const hasCost = Number(item.gold?.total || 0) > 0;

        return isSummonersRiftItem && isShopItem && hasCost;
      })
      .map(([id, item]) => ({
        id,
        name: item.name,
        description: removeHtmlTags(item.description),
        summary: item.plaintext || removeHtmlTags(item.description),
        tags: item.tags || [],
        category: getItemCategory(item.tags || []),
        price: item.gold?.total || 0,
        sellPrice: item.gold?.sell || 0,
        depth: item.depth || 1,
        buildsFrom: item.from?.length || 0,
        buildsInto: item.into?.length || 0,
        isCompleted:
          Boolean(item.from?.length) &&
          !item.into?.length &&
          getItemCategory(item.tags || []) !== "consumable",
        img: `${DATA_DRAGON_URL}/cdn/${version}/img/item/${item.image.full}`,
      }))
      .sort((firstItem, secondItem) => {
        if (firstItem.category === secondItem.category) {
          return (
            firstItem.price - secondItem.price ||
            firstItem.name.localeCompare(secondItem.name)
          );
        }

        return (
          itemCategoryOrder.indexOf(firstItem.category) -
          itemCategoryOrder.indexOf(secondItem.category)
        );
      });
  };

  return { getChampion, getChampionList, getItemList };
};

export default useChampionService;

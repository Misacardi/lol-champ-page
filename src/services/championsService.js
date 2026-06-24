import { useHttp } from "../hooks/http.hook";

const DATA_DRAGON_URL = "https://ddragon.leagueoflegends.com";
const LOCALE = "en_US";

let currentVersion;

const removeHtmlTags = (text = "") => text.replace(/<[^>]*>/g, "");

const getDifficulty = (difficulty) => {
  if (difficulty <= 3) {
    return "low";
  }

  if (difficulty <= 7) {
    return "mid";
  }

  return "high";
};

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
    };

    const spells = champion.spells.map((spell) => ({
      name: spell.name,
      description: removeHtmlTags(spell.description),
      img: `${DATA_DRAGON_URL}/cdn/${version}/img/spell/${spell.image.full}`,
    }));

    return {
      id: champion.id,
      name: champion.name,
      subtitle: champion.title,
      description: champion.lore,
      role: champion.tags[0].toLowerCase(),
      roles: champion.tags.map((role) => role.toLowerCase()),
      difficulty: getDifficulty(champion.info.difficulty),
      img: getSplashImage(0),
      skils: [passive, ...spells],
      skins: champion.skins
        .filter((skin) => !skin.parentSkin)
        .map((skin) => ({
          id: skin.id,
          name: skin.num === 0 ? champion.name : skin.name,
          img: getSplashImage(skin.num),
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

  return { getChampion, getChampionList };
};

export default useChampionService;

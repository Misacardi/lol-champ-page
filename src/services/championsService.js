import { useHttp } from "../hooks/http.hook";

const useChampionService = () => {
  const { request } = useHttp();

  const getChampion = async (id) => {
    const res = await request(`https://test-seven-bice-29.vercel.app/champions/${id}`);
    return res;
  };

  const getChampionList = async () => {
    const res = await request(`https://test-seven-bice-29.vercel.app/championList`);
    return res;
  };

  return { getChampion, getChampionList};
};

export default useChampionService;

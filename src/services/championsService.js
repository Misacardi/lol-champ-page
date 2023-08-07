import { useHttp } from "../hooks/http.hook";

const useChampionService = () => {
  const { request } = useHttp();

  const getChampion = async (id) => {
    const res = await request(`http://localhost:3001/champions/${id}`);
    return res;
  };

  const getChampionList = async () => {
    const res = await request(`http://localhost:3001/championList`);
    return res;
  };

  return { getChampion, getChampionList };
};

export default useChampionService;

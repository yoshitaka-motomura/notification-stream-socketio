import axio from "axios";

const api = axio.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
});

export default api;

export const getUserById = async(id:number) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

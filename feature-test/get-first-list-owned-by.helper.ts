import axios from 'axios';

export const getFirstListOwnedBy = async (userId: string): Promise<string> => {
  const userList = await axios.get(`http://localhost:8081/owned-by/user-id:${userId}`);
  expect(userList.data.items).toHaveLength(1);
  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

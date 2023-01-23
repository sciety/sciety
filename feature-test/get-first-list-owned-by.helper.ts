import axios from 'axios';

export const getFirstListOwnedByUser = async (userId: string): Promise<string> => {
  const userList = await axios.get(`http://localhost:8080/api/lists/owned-by/user-id:${userId}`);
  expect(userList.data.items).toHaveLength(1);
  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

export const getFirstListOwnedByGroup = async (groupId: string): Promise<string> => {
  const userList = await axios.get(`http://localhost:8080/api/lists/owned-by/group-id:${groupId}`);
  expect(userList.data.items).toHaveLength(1);
  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

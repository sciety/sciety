import {ListId} from "../types/list-id";
import {UserId} from "../types/user-id";

type Command = {
  // idempotence guard
  listId: ListId,
  ownerId: UserId,
  date: Date,
};

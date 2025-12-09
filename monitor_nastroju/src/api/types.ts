export type User = {
  id: number;
  username: string;
  password: string;
};

export type Entry = {
  id: number;
  userId: number;
  text: string;
  date: string;
  emotion: string;
  photo?: string | null;
};

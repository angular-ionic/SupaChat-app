export interface IGroup {
  created_at: string;
  title: string;
  id: number;
  users: {
    email: string;
    id: string;
  };
}
export interface IMessage {
  created_at: string;
  text: string;
  id: number;
  users: { email: string; id: string }[];
}

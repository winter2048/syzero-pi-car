/// <reference types="react-scripts" />

interface IUser {
  id: number;
  name: string;
}

interface IConfig{
  SERVER_URL?: string;
  SERVER_URL_LOGIN?: string;
  APP_TITLE?: string;
}

interface RequestResult<T> {
  code: number;
  data: T;
  msg?: string;
}

interface UserDto {
    id: string;
    name: string;
    mail: string;
    phone: string;
    sex: number;
    createTime: string;
    lastTime: string;
    lastIP: string;
    type: number;
    status: number;
    nickName: string;
    level: number;
    pictureUrl: string;
    description: string;
}

interface ChatSessionDto {
  id: string;
  messages: Array<ChatMessageDto>;
}

interface ChatMessageDto {
  role: number;
  content: string;
  date: string;
}

interface SendMessageDto{
  sessionId: string;
  message: string;
}

interface ChatSession {
  id: string;
  title: string;
  text: string;
  date: string;
  messages: Array<ChatMessageDto>;
}

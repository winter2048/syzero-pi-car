import { request } from "../utils/request";

export function CreateSession(): Promise<RequestResult<string>> {
  return request.post<string>(
    "/api/SyZero.OpenAI/Chat/Session"
  );
}

export function DeleteSession(
  sessionId: string
): Promise<RequestResult<boolean>> {
  return request.delete<boolean>(
    `/api/SyZero.OpenAI/Chat/Session/${sessionId}`
  );
}

export function GetSession(
  sessionId: string
): Promise<RequestResult<ChatSessionDto>> {
  return request.get<ChatSessionDto>(
    `/api/SyZero.OpenAI/Chat/Session/${sessionId}`
  );
}

export function SessionList(): Promise<RequestResult<ChatSessionDto[]>> {
  return request.get<Array<ChatSessionDto>>(
    `/api/SyZero.OpenAI/Chat/Sessions`
  );
}

export function SendMessage(
  data: SendMessageDto
): Promise<RequestResult<string>> {
  return request.post<string>(
    "/api/SyZero.OpenAI/Chat/SendMessage",data
  );
}

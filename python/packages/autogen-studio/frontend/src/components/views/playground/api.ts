import { Session, SessionRuns } from "../../types/datamodel";
import { BaseAPI } from "../../utils/baseapi";

export class SessionAPI extends BaseAPI {
  async listSessions(userId: string): Promise<Session[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/?user_id=${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch sessions");
    return data.data;
  }

  async getSession(sessionId: number, userId: string): Promise<Session> {
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}?user_id=${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch session");
    return data.data;
  }

  async createSession(
    sessionData: Partial<Session>,
    userId: string
  ): Promise<Session> {
    const session = {
      ...sessionData,
      user_id: userId, // Ensure user_id is included
    };

    const response = await fetch(`${this.getBaseUrl()}/sessions/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(session),
    });
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to create session");
    return data.data;
  }

  async updateSession(
    sessionId: number,
    sessionData: Partial<Session>,
    userId: string
  ): Promise<Session> {
    const session = {
      ...sessionData,
      id: sessionId,
      user_id: userId, // Ensure user_id is included
    };

    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}?user_id=${userId}`,
      {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(session),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to update session");
    return data.data;
  }

  // session runs with messages
  async getSessionRuns(
    sessionId: number,
    userId: string
  ): Promise<SessionRuns> {
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}/runs?user_id=${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch session runs");
    return data.data; // Returns { runs: RunMessage[] }
  }

  async deleteSession(sessionId: number, userId: string): Promise<void> {
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}?user_id=${userId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to delete session");
  }

  // Adding messages endpoint
  async listSessionMessages(sessionId: number, userId: string): Promise<any[]> {
    // Replace 'any' with proper message type
    const response = await fetch(
      `${this.getBaseUrl()}/sessions/${sessionId}/messages?user_id=${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    if (!data.status)
      throw new Error(data.message || "Failed to fetch messages");
    return data.data;
  }

  // New method to create a run
  async createRun(sessionId: number, userId: string): Promise<number> {
    const payload = { session_id: sessionId, user_id: userId };
    const response = await fetch(`${this.getBaseUrl()}/runs/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!data.status) throw new Error(data.message || "Failed to create run");
    return data.data.run_id;
  }
}

export const sessionAPI = new SessionAPI();

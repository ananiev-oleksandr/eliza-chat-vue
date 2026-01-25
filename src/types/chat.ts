export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot' | 'system';
    timestamp: Date;
  }

export type RequestStatus = 'idle' | 'pending' | 'error';

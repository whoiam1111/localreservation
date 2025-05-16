// src/app/lib/type.ts

export interface Activity {
    id: string;
    date: string;
    location: string;
    start_time: string;
    end_time: string;
    tool: string;
    result?: string;
    feedback?: string;
    created_at: string;
    region: string;
    host: string;
    hostnumber: string;
    participant_count: number;
}

export interface Participant {
    name: string;
    phone: string;
    lead: string;
    type: string;
    team: string;
}

export interface Feedback {
    strengths: string;
    improvements: string;
    futurePlans: string;
}

// types/supabase.ts
export type Database = {
    public: {
      Tables: {
        today_bible_verses: {
          Row: {
            id: number;
            book_name: string;
            chapter: number;
            verse: string;
            text: string;
            card_type: string;
          };
          Insert: {
            book_name: string;
            chapter: number;
            verse: string;
            text: string;
            card_type: string;
          };
          Update: {
            book_name: string;
            chapter: number;
            verse: string;
            text: string;
            card_type: string;
          };
        };
      };
    };
  };

  export type BibleVerse = {
    id: number;
    book_name: string;
    chapter: number;
    verse: string;
    text: string;
    card_type: 'courage' | 'wish' | 'evangelism'; // card_type은 문자열로 고정
  };
  
  export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content?: {
      book_name: string;
      chapter: number;
      verse: number;
      text: string;
    } | null;
    children?: React.ReactNode;
  };
  
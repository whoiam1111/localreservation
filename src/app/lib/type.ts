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

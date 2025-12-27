export type RoastPhase = 'drying' | 'maillard' | 'development' | 'cooling' | 'ended';

export interface DataPoint {
    timestamp: number; // seconds from start (x-axis)
    temperature: number; // BT (Bean Temp)
    ror?: number; // Rate of Rise (derived)
    gas?: number; // Gas Pressure
    damper?: number; // Damper % (0-100)
}

export interface RoastEvent {
    name: string;
    timestamp: number;
    temperature: number;
    type: 'start' | 'phase_change' | 'user_note' | 'end';
}

export interface RoastConfig {
    weight: number; // Green bean weight in grams
    title: string;
}

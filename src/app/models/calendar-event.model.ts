import { Pole } from "src/app/models/role.enum";

export interface CalendarEventDto{
    title: string;
    description?: string;
    poleLinkedTo: Pole;
    eventCategory : string;
    backgroundColor: string;
    start: Date;
    end?: Date;

    reccurent: boolean,
    rrule?: {
        freq : string,
        interval ?: number,            
        byweekday ?: number[] | null,
        dtstart: Date,
        until: Date
    },

    // Répétition volontaire parce que je n'arrivas pas à récupérer le rrule d'un event dans le front
    extendedProps:{                        
        rrule: {
            freq : string,
            interval ?: number,            
            byweekday ?: number[] | null,
            dtstart: Date,
            until: Date
        }
    }
}

export interface CalendarEventCreateDto{
    
    title: string;
    description?: string;
    poleLinkedTo: Pole;
    eventCategory : string;
    backgroundColor: string;
    start?: Date;
    end?: Date;

    reccurent: boolean,
    rrule?: {
        freq : string,
        interval ?: number,            
        byweekday ?: number[],
        dtstart: Date,
        until: Date
    }
}

export interface CalendarEventUpdateDto{
    title?: string;
    description?: string;
    poleLinkedTo?: Pole;
    eventCategory? : string;
    backgroundColor?: string;
    start?: Date;
    end?: Date;

    reccurent?: boolean,
    rrule?: {
        freq ?: string,
        interval ?: number,            
        byweekday ?: number[],
        dtstart?: Date,
        until?: Date
    }
}

export interface CalendarEventDeleteDto{
    id: string;
}


export class CalendarEvent{
    title: string =null;
    description: string =null;
    poleLinkedTo: Pole  =null;
    eventCategory : string  =null;
    backgroundColor: string  =null;
    start: Date  =null;
    end?: Date  =null;

    reccurent: boolean  =null;
    rrule?: {
        freq : string,
        interval ?: number,            
        byweekday ?: number[] | null,
        dtstart: Date,
        until: Date
    } =null;

    // Répétition volontaire parce que je n'arrivas pas à récupérer le rrule d'un event dans le front
    extendedProps:{                        
        rrule: {
            freq : string,
            interval ?: number,            
            byweekday ?: number[] | null,
            dtstart: Date,
            until: Date
        }
    }  =null;
}

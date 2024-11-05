import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, of} from 'rxjs';
import { CalendarEventDto, CalendarEventUpdateDto } from 'src/app/models/calendar-event.model';

@Injectable({
    providedIn: 'root'
  })
  export class CalendarEventsService {
    
    constructor(private http: HttpClient){}

    getAllEvents(): Observable<CalendarEventDto[] | []>{
        return this.http.get<CalendarEventDto[]>('./../../../assets/files/calendar/events.json').pipe(
            catchError((error: any)=>{
                console.log(error);
                return [];
            })
        )
    }

    createNewEvent(_event: any): Observable<string | null>{
        /**
         * L'API doit renvoyer l'id du nouvel évènement
         */
        return of("50"); 
    }

    updateEvent(_event: CalendarEventUpdateDto): Observable<boolean | null>{
        return of(true);
    }
  }
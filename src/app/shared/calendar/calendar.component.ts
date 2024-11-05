import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Calendar } from '@fullcalendar/core';

import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';

import { a1 } from '@fullcalendar/core/internal-common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent, CalendarEventCreateDto, CalendarEventDto, CalendarEventUpdateDto } from 'src/app/models/calendar-event.model';

import * as bootstrap from 'bootstrap';
import { Pole, PoleEventsMap, eventsByPole } from 'src/app/models/role.enum';
import { CalendarEventsService } from 'src/app/services/calendar/events';
import { AlertService } from 'src/app/services/alert/alert.service';

import { findFirstInvalidField } from 'src/app/services/utilities/form.utility';


let calendar: Calendar;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnInit{
  
  newEventForm: FormGroup
  updateEventForm: FormGroup
  isModalForNew: boolean
  idEventToChange: string;
  isEventReccurent: boolean;
  initialStateEventToChange: CalendarEventDto;

  studentPole: Pole
  allEventsByPole: PoleEventsMap = eventsByPole;
  poleEvents: {name: string, color: string}[];

  todayDate: string;
  myModalEl: HTMLElement;
  myCalendarEl: HTMLElement;

  @ViewChild('eventModal', { static: false }) myModalNg: ElementRef;
  @ViewChild('calendar', { static: false }) myCalendar: ElementRef;
  
  unsetModalForNew(){
    this.isModalForNew = false;
  }

  setModalForNew(){
    this.isModalForNew = true; 
  }
  getModalTitle(){
    return this.isModalForNew ? 'Nouvel évènement' : 'Modification d\'un évènement';
  }
  refetchCalendarEvents(){
    calendar.refetchEvents()
  }
  findFirstInvalidField(){
    return findFirstInvalidField(this.newEventForm);
  }
  monitorMandatoryInputs(input:string){
    return this.newEventForm.get(input).hasValidator(Validators.required)
  }
  monitorValidators(theForm: FormGroup){
    theForm.get('reccurent').valueChanges.subscribe(
      (value)=>{
        this.isEventReccurent = Boolean(value);
        
        if (this.isEventReccurent) {
          theForm.get('start').clearValidators();
          theForm.get('end').clearValidators();
      
          theForm.get('rrule').get('freq').setValidators(Validators.required);
          theForm.get('rrule').get('dtstart').setValidators(Validators.required);
          theForm.get('rrule').get('until').setValidators(Validators.required);
        } else {
          theForm.get('start').setValidators(Validators.required);
          theForm.get('end').setValidators(Validators.required);

          theForm.get('rrule').get('freq').clearValidators();
          theForm.get('rrule').get('dtstart').clearValidators();
          theForm.get('rrule').get('until').clearValidators();
        }
      
        // Mettre à jour la validité des contrôles après avoir modifié les validateurs
        theForm.get('start').updateValueAndValidity();
        theForm.get('end').updateValueAndValidity();
        theForm.get('rrule').get('freq').updateValueAndValidity();
        theForm.get('rrule').get('dtstart').updateValueAndValidity();
        theForm.get('rrule').get('until').updateValueAndValidity();
      }
    );
  }
  getAvailableEvents(){
    return this.allEventsByPole[this.studentPole];
  }

  constructor(private calendarService: CalendarEventsService, private alertService: AlertService, private formBuilder: FormBuilder){
    this.studentPole = Pole.Trésorerie;
  }
  
  ngOnInit(){

    // Initialisation de quelques variables utiles
    this.poleEvents = this.getAvailableEvents();
    const [day, month, year] = new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    this.todayDate = `${year}-${month}-${day}`;

    // Redimensionnement automatiquement et responsive du calendrier
    var myPageEl = document.getElementById('page');
    //console.log(myPageEl);
    new ResizeObserver((entries)=>{
    for(const entry of entries){
      if(entry.contentBoxSize){
        var update = {
          autosize: true,
        };
        calendar.render();
      }
    }
    }).observe(myPageEl)

    // Les formulaires de gestion d'évènement
    this.newEventForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        description: [''],
        eventCategory: ['', Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
        
        reccurent: [false],
        rrule : this.formBuilder.group(
          {            
            freq : [''],
            interval: [''],
            
            byweekday: this.formBuilder.group(
              {
                0: [''],
                1: [''],
                2: [''],
                3: [''],
                4: [''],
                5: [''],
                6: [''],                
              }
            ),
            dtstart: [''],
            until: ['']
          }
        ),
        
      }
    )
    
    this.updateEventForm = this.formBuilder.group(
      {
        title: [''],
        eventCategory: [''],
        description: [''],
        start: [''],
        end: [''],
        reccurent: [],
        rrule : this.formBuilder.group(
          {
            freq : [''],
            interval: [''],
            
            byweekday: this.formBuilder.group(
              {
                0: [''],
                1: [''],
                2: [''],
                3: [''],
                4: [''],
                5: [''],
                6: [''],                
              }
            ),
            dtstart: [''],
            until: ['']
          }
        ),
      }
    );
    
    // Gestion des Validators des formulaires d'évènement
    this.monitorValidators(this.newEventForm);
    this.monitorValidators(this.updateEventForm);
  }


  ngAfterViewInit(){
    
    // Création et configuration du calendrier
    this.myCalendarEl = this.myCalendar.nativeElement as HTMLElement;
    calendar = new Calendar(this.myCalendarEl, {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        listPlugin,
        timeGridPlugin,
        rrulePlugin
      ],
      locale: 'fr',
      buttonText: {
        today: 'Aujourd\'hui',
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        list: 'Liste'
      },
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth timeGridDay listMonth'
      },
      
      navLinks: true,
      height: 592,

      dayMaxEventRows: 3,
      eventMaxStack: 2,
      events: {
        url: '/assets/files/calendar/events.json',
          failure: function(){alert('Erreur de récupération des évènements')},
          borderColor: 'none',
          textColor: '#fff',
      },
      eventClick: (info)=>{
         this.onCalendarEventClick(info)
      },

      eventDidMount: (info) => {                
        // Change background color of row
        info.el.style.backgroundColor = info.event.backgroundColor;
        info.el.style.color = 'white';
        // Change color of dot marker
        var dotEl = info.el.getElementsByClassName('fc-event-dot')[0] as HTMLElement;
        if (dotEl) {
          dotEl.style.backgroundColor = 'white';
        }
          
      },
      eventClassNames: "custom-calendar-events"
        
    });
    calendar.render();


    // Ecouteur d'évènement: Gestion de la fermeture du formulaire d'évènements
    this.myModalEl = this.myModalNg.nativeElement as HTMLElement;
    if(this.myModalEl){
      this.myModalEl.addEventListener('hidden.bs.modal', ()=>{
        this.idEventToChange = null;
        this.isEventReccurent = false;
        this.initialStateEventToChange = null;
  
        if (this.isModalForNew)
          this.unsetModalForNew();
      });
    }
  }


  onCalendarEventClick(info: a1){
    /**
     * Récupération des informations liées à l'évènement pour pré-remplir le formulaire du modal
     */
    this.idEventToChange = info.event.id;

    if(info.event.title)
      this.updateEventForm.get('title').setValue(info.event.title);
    
    if(info.event.extendedProps.description){
      this.updateEventForm.get('description').setValue(info.event.extendedProps.description);
    }

    if(info.event.extendedProps.eventCategory)
      this.updateEventForm.get('eventCategory').setValue(info.event.extendedProps.eventCategory);

    if(info.event.start){
      this.updateEventForm.get('start').setValue(info.event.start.toISOString().substring(0, 10));
    }

    if(info.event.end){
      this.updateEventForm.get('end').setValue(info.event.end.toISOString().substring(0, 10));
    }
    
    //console.log(info.event.extendedProps.rrule.until.interval)
    if(info.event.extendedProps.reccurent){
      this.updateEventForm.get('reccurent').setValue(Boolean(info.event.extendedProps.reccurent));
              
      if(info.event.extendedProps.rrule.freq)
        this.updateEventForm.get('rrule').get('freq').setValue(String(info.event.extendedProps.rrule.freq));
    
      if(info.event.extendedProps.rrule.dtstart)
        this.updateEventForm.get('rrule').get('dtstart').setValue(new Date(info.event.extendedProps.rrule.dtstart).toISOString().substring(0, 10));
      
      if(info.event.extendedProps.rrule.until)
        this.updateEventForm.get('rrule').get('until').setValue(new Date(info.event.extendedProps.rrule.until).toISOString().substring(0, 10));

      if(info.event.extendedProps.rrule.interval)
        this.updateEventForm.get('rrule').get('interval').setValue(Number((info.event.extendedProps.rrule.interval)));
      
      if(info.event.extendedProps.rrule.byweekday){
        const daysOfRecurrence = info.event.extendedProps.rrule.byweekday;
        if(! (daysOfRecurrence instanceof(Array))){
          // Then it must be null -- Nothing to do
        }
        else{
          for(let day in daysOfRecurrence){
            this.updateEventForm.get('rrule').get('byweekday').get(`${Number(daysOfRecurrence[day])}`).setValue(true);
          }
        }
        
      }
    }

    /**
     * Récupération de l'état initial du formulaire pour détecter les changements
     */
    this.initialStateEventToChange = this.updateEventForm.value as CalendarEventDto;

    // ET finalement affichage le modal
    const myModal = new bootstrap.Modal(this.myModalEl);
    myModal.toggle();
  }

  onNewEventSubmit(){
    let formValue = this.newEventForm.value;
    let event = this.newEventForm.value as CalendarEventCreateDto;
    //console.log(event);

    // Gestion des jours de récurrence
    if(event.reccurent){
      for(let key in formValue.rrule.byweekday){
        if(formValue[key] === true){
          event.rrule.byweekday.push(Number(key));
        }
      }
    }
    
    // Rajouter le pôle -------------------------*A mettre à jour*----------------------------------
    event.poleLinkedTo = this.studentPole;

    // Rajouter la couleur de l'évènement
    for(let _event of this.allEventsByPole[event.poleLinkedTo]){
      if(_event.name == event.eventCategory){
        event.backgroundColor = _event.color;
      }
    }
    if(!event.backgroundColor){
      event.backgroundColor = this.allEventsByPole[event.poleLinkedTo][0].color;
    }
        
    // Envoyer au serveur ... et mettre à jour sur l'interface
    this.calendarService.createNewEvent(event).subscribe(
      (_id)=>{
        //this.refetchCalendarEvents();
        /**
         * SOLUTION TEMPORAIRE POUR AJOUTER VISUELLEMENT UN EVENT
         */
        if(!event.reccurent){
          calendar.addEvent({
            title: event.title,
            description: event.description,
            backgroundColor: event.backgroundColor,
            poleLinkedTo: event.poleLinkedTo,
            eventCategory: event.eventCategory,
            reccurent: event.reccurent,
            start: event.start,
            end: event.end
          });
        }
        
        
        // Réinitialiser le formulaire et fermer la boite de dialogue
        this.newEventForm.reset();
        document.getElementById('modal-close-btn').click();        
      }
    )
  }

  onUpdateEventSubmit(){
    // L'id de l'event est défini dans idEventToChange
    // Détecter les champs qui ont changé
    let updateEvent: CalendarEventUpdateDto = new CalendarEvent();

    if(this.initialStateEventToChange){
      const newState = this.updateEventForm.value as CalendarEventDto;
      if(this.initialStateEventToChange == newState)
        return;
      for(let field in newState){        
        if(JSON.stringify(newState[field]) != JSON.stringify(this.initialStateEventToChange[field])){
          updateEvent[field] = newState[field];
        }
      }
    }
    // Envoyer ces champs au backend
    this.calendarService.updateEvent(updateEvent).subscribe(
      (status) =>{
        if(!status){
          this.alertService.success("Désolé, l'évènement n'a pas pu être mis à jour!")
        }
      }
    )
    // Réinitialiser le formulaire et fermer la boite de dialogue
    this.updateEventForm.reset();
    document.getElementById('modal-close-btn').click();
    //this.refetchCalendarEvents();
  }

  onDeleteEvent(){
  //this.refetchCalendarEvents();
  calendar.getEventById(this.idEventToChange).remove();
  }
}

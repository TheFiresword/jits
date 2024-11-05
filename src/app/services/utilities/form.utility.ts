import { FormGroup } from "@angular/forms";
import * as deepl from 'deepl-node';


const DEEPL_AUTH_KEY = "850cd995-6593-386f-5895-67f8e35b99a2:fx";
const formFieldsTranslationMap = {
    title: "Titre",
    description: "Description",
    poleLinkedTo: "Pôle",
    eventCategory: "Catégorie",
    backgroundColor: "Couleur de fond",
    start: "Début",
    end: "Fin",
    reccurent: "Réccurent",
    freq: "Fréquence",
    interval: "Intervalle",
    byweekday: "Jours de la semaine",
    dtstart: "Début de récurrence",
    until: "Fin de récurrence",
    role: "Rôle",
    campus: "Campus",
    department: "Département",
    year: "Année",
    city: "Ville",
    zipCode: "Code postal",
    adress:"Adresse",
    phone: "Téléphone",
    password:"Mot de passe",
    email: "Email",
    lastname: "Nom",
    firstname: "Prénom"
}

export function findFirstInvalidField(theForm: FormGroup): string | null {
    const formControls = theForm.controls;
    for (const field in formControls) {
      if (formControls[field].invalid) {
        if(! (formControls[field] instanceof(FormGroup))){
            return formFieldsTranslationMap[field];
        }
            
        else{
            const subControls = (formControls[field] as FormGroup).controls;
            for(const subfield in subControls){
                if(subControls[subfield].invalid)
                    return formFieldsTranslationMap[subfield];
            }
        }
        /**
        const translator = new deepl.Translator(DEEPL_AUTH_KEY);
        (async()=>{
            const translatedError = await translator.translateText("The field "+field+" is not valid", null, "fr");
            return translatedError.text;
        })
        */
        
      }
    }
    return null;
  }
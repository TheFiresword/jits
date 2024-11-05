export enum PolePrésidence{
    Président = "Président",
    VP = "Vice-Président",
}
export enum PoleTrésorerie{
    Trésorier = "Trésorier",
    VT = "Vice-Trésorier",
    Comptable = "Comptable", 
}
export enum PoleSecrétariat_RH{
    Secrétaire = "Secrétaire",
    VS = "Vice-Secrétaire",
    RRH = "Responsable Ressources Humaines",
    CRH = "Chargé Ressources Humaines",
}
export enum PoleRE{
    RRE = "Responsable Relations Entreprises",
    CA = "Chargé d'Affaires",
}
export enum PoleSE{
    RSE = "Responsable Suivi d'Etudes",
    CSE = "Chargé Suivi d'Etudes",
}
export enum PoleQualité{
    RQ = "Responsable Qualité",
    CQ = "Chargé Qualité",
}
export enum PoleCommunication{
    RC = "Responsable Communication",
    CC = "Chargé de communication",
}
export enum PoleSI{
    RSI = "Responsable Systèmes d'Informations",
    CSI = "Chargé Systèmes d'Informations",
}
export enum PoleAutres{
    Adhérent = "Adhérent",
    CP = "Chef de projet",
    Intervenant = "Intervenant",
    Ancien = "Ancien",
    Fondateur = "Fondateur",
    CS = "Commité Sénior",
}

export const availablePoles = [
    PolePrésidence, 
    PoleTrésorerie,
    PoleSecrétariat_RH,
    PoleRE,
    PoleSE,
    PoleQualité,
    PoleCommunication,
    PoleSI,
    PoleAutres
]
export const stringifiedAvailablePoles = [
    "Présidence", 
    "Trésorerie",
    "Secrétariat & RH",
    "Relations Entreprises",
    "Suivi Etudes",
    "Qualité",
    "Communication",
    "Systèmes d'Informations",
    "Autres"
]
export enum Pole{
    All = "Tous",
    Présidence = "Présidence",
    Trésorerie = "Trésorerie",
    SecrétariatRH = "Secrétariat & RH",
    RE = "Relations Entreprises",
    SE = "Suivi Etudes",
    Qualité = "Qualité",
    Communication = "Communication",
    SI = "Systèmes d'Informations",
    Autres = "Autres"
}

export enum Role {
    Président = PolePrésidence.Président,
    VP = PolePrésidence.VP,

    Trésorier = PoleTrésorerie.Trésorier,
    VT = PoleTrésorerie.VT,
    Comptable = PoleTrésorerie.Comptable,

    Secrétaire = PoleSecrétariat_RH.Secrétaire,
    VS = PoleSecrétariat_RH.VS,
    RRH = PoleSecrétariat_RH.RRH,
    CRH = PoleSecrétariat_RH.CRH,

    RRE = PoleRE.RRE,
    CA = PoleRE.CA,

    RSE = PoleSE.RSE,
    CSE = PoleSE.CSE,

    RQ = PoleQualité.RQ,
    CQ = PoleQualité.CQ,

    RC = PoleCommunication.RC,
    CC = PoleCommunication.CC,
    
    RSI = PoleSI.RSI,
    CSI = PoleSI.CSI,

    Adhérent = PoleAutres.Adhérent,
    CP = PoleAutres.CP,
    Intervenant = PoleAutres.Intervenant,
    Ancien = PoleAutres.Ancien,
    Fondateur = PoleAutres.Fondateur,
    CS = PoleAutres.CS,    
}

/**
 * Utilitaire de Gestion des events du calendrier par pôle
 */
const eventsColorsPool = [
    "rgb(42, 157, 143)",
    "rgb(58, 134, 255)",
    "rgb(255, 183, 3)",
    "rgb(224, 122, 95)",
    "rgb(71, 90, 115)",
    "rgb(250, 92, 124)",
    "rgb(86, 82, 100)",
    "rgb(8, 65, 92)",
    "rgb(204, 41, 54)",
    "rgb(181, 101, 118)",
];

export interface PoleEventsMap{
    [key: string]: {name: string, color: string}[];
}

export const eventsByPole: PoleEventsMap= {
    [Pole.All]: [
        {name: "Conseil d'administration", color:""}
    ],
    [Pole.Présidence]: [
        {name: "Conseil d'administration", color: ""}
    ],
    [Pole.Trésorerie]: [
        {name: "Réunion", color:""},
        {name: "Déclaratif", color:""},
        {name: "Facture", color:""},
        {name: "Budget", color:""},
        {name: "Archivage", color:""},
        {name: "Comptabilité", color:""}
    ],
    [Pole.SecrétariatRH]: [
        {name: "Entretien d'embauche", color: ""}
    ],
    [Pole.RE]: [
        {name: "Prise de contact", color:""}
    ],
    [Pole.SE]: [
        {name: "Réunion", color: ""}
    ],
    [Pole.Qualité]: [
        {name: "Réunion", color: ""}
    ],
    [Pole.Communication]: [
        {name: "Réunion", color: ""}
    ],
    [Pole.SI]: [
        {name: "Réunion", color: ""}
    ],
}

for (let key in eventsByPole){
    let poleEvents = eventsByPole[key];
    for(let i: number=0; i< poleEvents.length; i++){
        poleEvents[i].color = eventsColorsPool[i%(eventsColorsPool.length)];
    }
}


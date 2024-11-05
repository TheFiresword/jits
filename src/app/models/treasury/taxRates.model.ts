


export interface TaxRates {
    label: string;  
    smic: number;
    baseUrssaf: number;
    tauxAssietteCotisation:{
      junior: number;
      etudiant: number;
    };
    tauxRetributionBrute:{
      junior: number;
      etudiant: number;
    };
    crds: {
      junior: number;
      etudiant: number;
    };
    csg: {
      junior: number;
      etudiant: number;
    };
    securiteSociale: {
      junior: number;
      etudiant: number;
    };
    assuranceVieilesse: {
      junior: number;
      etudiant: number;
    };
    deplafonnee: {
      junior: number;
      etudiant: number;
    };
    plafonnee: {
      junior: number;
      etudiant: number;
    };
    accidentTravail: {
      junior: number;
      etudiant: number;
    };
    allocationsFamilliales: {
      junior: number;
      etudiant: number;
    };
    versementTransport: {
      junior: number;
      etudiant: number;
    };
    autresContributions: {
      junior: number;
      etudiant: number;
    };
    assuranceChomage: {
      junior: number;
      etudiant: number;
    };
  }
  
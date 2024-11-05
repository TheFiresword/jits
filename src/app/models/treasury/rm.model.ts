
export interface RM{
    id : string,
    emitDate: Date,
    socialYear: number,
    name: string,
    firstname: string,
    category: string,
    bruteRetribution: number
}

export const RmTablefy = {
    id: "N° RM",
    emitDate: "Date émission",
    socialYear: "Exercice social",
    name: "Nom",
    firstname: "Prénom",
    category: "Type de membre",
    bruteRetribution: "Rétri. Brute"
}
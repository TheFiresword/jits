import { PercentPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
/**
 * Pipe qui prendre en input un nombre et qui l'affiche sous forme de pourcentage d'évolution
 * avec une flèche et une couleur conditionnelles
 */
@Pipe({name: 'evolution'})
export class EvolutionPipe implements PipeTransform{
    constructor(private percentPipe: PercentPipe){}
    transform(value: number, ...args: any[]) {
        const percentValue = this.percentPipe.transform(value, '.2');
        return value >= 0? `<span class="my-text-success"><i class="bi bi-arrow-up-short"></i>${percentValue}</span>` : 
        `<span class="my-text-failure"><i class="bi bi-arrow-down-short"></i>${percentValue}</span>`
    }
    
}
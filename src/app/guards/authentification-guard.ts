import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthentificationService } from "../services/auth/authentification.service";
import { AlertService } from "../services/alert/alert.service";



export const isConnected: CanActivateFn = 
(   route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const alertService = inject(AlertService);
    const authentificationService = inject(AuthentificationService);
    const router = inject(Router);
        if (!authentificationService.isLoggedIn()){
            alertService.error("Vous devez être connecté(e) pour accéder à cette page");
            router.navigate(['/login']);
            return false;
        }
        return true;
    }

export const isDiconnected: CanActivateFn =
(   route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const alertService = inject(AlertService);
    const authentificationService = inject(AuthentificationService);
    const router = inject(Router);
    if (authentificationService.isLoggedIn()){
        alertService.error("Vous êtes déjà connecté(e)");
        router.navigate(['/dashboard']);
        return false;
    }
    return true;
    
}
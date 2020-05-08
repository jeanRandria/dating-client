import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, catchError, exhaustMap, tap} from 'rxjs/operators';
import { of } from "rxjs";

import { AuthApiActions, RegisterPageActions } from "@auth/store/actions";
import { AuthService } from "@auth/store/services/auth.service";

@Injectable()
export class RegisterEffects {

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterPageActions.register),
      exhaustMap(({ credentials }) =>
        this.auth.register(credentials).pipe(
          map(user => AuthApiActions.registerSuccess({ user })),
          catchError(error => of(AuthApiActions.registerFailure({ error })))
        ))
    ));

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthApiActions.registerSuccess),
      tap(() => this.router.navigate([ '/auth/login' ]))
    ), { dispatch: false });

  constructor(private actions$: Actions, private auth: AuthService,
              private router: Router) {}

}

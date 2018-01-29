import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import {Hero} from './hero'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {MessageService} from './message.service'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable()
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    this.messageService.add('HeroService: fetched heroes')
    return this.http.get<Hero[]>(this.herosUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      )

  }

  private handleError<T> (operation = 'operation', result?: T ) {
    return (error: any): Observable<T> => {
      console.error(error)

      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message)
  }

  private herosUrl = 'api/heroes'

  getHero(id: number): Observable<Hero> {
    const url = `${this.herosUrl}/${id}`
    return this.http.get<Hero>(url).pipe(
      tap(_ =>this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`get hero id=${id}`))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([])
    }
    return this.http.get<Hero[]>(`api/heroes?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )

  }


  updateHero (hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    return this.http.put(this.herosUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`update hero: id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

}

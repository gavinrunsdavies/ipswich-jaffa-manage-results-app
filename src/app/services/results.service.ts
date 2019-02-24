import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable ,  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Event } from '../models/event';
import { Race } from '../models/race';
import { Runner } from '../models/runner';
import { Result } from '../models/result';
import { Meeting } from '../models/meeting';
import { Distance } from '../models/distance';
import { Gender } from '../models/gender';
import { CourseType } from '../models/course-type';
import { RunnerOfTheMonth } from '../models/runner-of-the-month';
import { County } from '../models/county';
import { Country } from '../models/country';
import { RaceArea } from '../models/race-area';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ResultsService {

  private baseUrl = `${environment.baseUrl}/wp-json/ipswich-jaffa-api/v2`;
  private baseV3Url = `${environment.baseUrl}/wp-json/ipswich-jaffa-api/v3`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: NotificationService) { }

  getEvents(): Observable<Event> {
    const url = `${this.baseUrl}/events`;
    return this.http.get<Event>(url)
      .pipe(
        tap((event: Event) => this.log(`fetched events ${JSON.stringify(event)}`)),
        catchError(this.handleError<Event>('getEvents'))
      );
  }

  getDistances(): Observable<Distance> {
    const url = `${this.baseUrl}/distances`;
    return this.http.get<Distance>(url)
      .pipe(
        tap((distance: Distance) => this.log(`fetched distances ${JSON.stringify(distance)}`)),
        catchError(this.handleError<Distance>('getDistances'))
      );
  }

  getGenders(): Observable<Gender> {
    const url = `${this.baseUrl}/genders`;
    return this.http.get<Gender>(url)
      .pipe(
        tap((gender: Gender) => this.log(`fetched genders ${JSON.stringify(gender)}`)),
        catchError(this.handleError<Gender>('getGenders'))
      );
  }

  getRaces(eventId: number): Observable<Race> {
    const url = `${this.baseUrl}/events/${eventId}/races`;
    return this.http.get<Race>(url)
      .pipe(
        tap((race: Race) => this.log(`fetched races ${JSON.stringify(race)}`)),
        catchError(this.handleError<Race>('getRaces'))
      );
  }

  getRunners(): Observable<Runner[]> {
    const url = `${this.baseUrl}/runners`;
    return this.http.get<Runner[]>(url)
      .pipe(
      //   .map(response => {
      //     const array = JSON.parse(response.json()) as any[];
      //     const details = array.map(data => new Runner(data));
      //     return details;
      // })
        // map((runners: Runner[]) => {}), TODO
        tap((runners: Runner[]) => this.log(`fetched runners ${JSON.stringify(runners)}`)),
        catchError(this.handleError<Runner[]>('getRunners'))
      );
  }

  getCourseTypes(): Observable<CourseType> {
    const url = `${this.baseUrl}/coursetypes`;
    return this.http.get<CourseType>(url)
      .pipe(
        tap((courseType: CourseType) => this.log(`fetched courseTypes ${JSON.stringify(courseType)}`)),
        catchError(this.handleError<CourseType>('getCourseTypes'))
      );
  }

  getRunnerOfTheMonthWinners(): Observable<RunnerOfTheMonth> {
    const url = `${this.baseV3Url}/runnerofthemonth/winners`;
    return this.http.get<RunnerOfTheMonth>(url)
      .pipe(
        tap((winner: RunnerOfTheMonth) => this.log(`fetched getRunnerOfTheMonthWinners ${JSON.stringify(winner)}`)),
        catchError(this.handleError<RunnerOfTheMonth>('getRunnerOfTheMonthWinners'))
      );
  }

  getMeeting(eventId: number, meetingId: number): Observable<Meeting> {
    const url = `${this.baseUrl}/events/${eventId}/meetings/${meetingId}`;
    return this.http.get<Meeting>(url)
      .pipe(
        tap((meet: Meeting) => this.log(`fetched meeting ${JSON.stringify(meet)}`)),
        catchError(this.handleError<Meeting>('getMeeting'))
      );
  }

  getMeetings(eventId: number): Observable<Meeting> {
    const url = `${this.baseUrl}/events/${eventId}/meetings`;
    return this.http.get<Meeting>(url)
      .pipe(
        tap((meet: Meeting) => this.log(`fetched meetings ${JSON.stringify(meet)}`)),
        catchError(this.handleError<Meeting>('getMeetings'))
      );
  }

  getMeetingRaces(eventId: number, meetingId: number): Observable<Race> {
    const url = `${this.baseUrl}/events/${eventId}/meetings/${meetingId}/races`;
    return this.http.get<Race>(url)
      .pipe(
        tap((race: Race) => this.log(`fetched meeting races ${JSON.stringify(race)}`)),
        catchError(this.handleError<Race>('getMeetingRaces'))
      );
  }

  getCountries(): Observable<Country> {
    const url = `../assets/countries.json`;
    return this.http.get<Country>(url)
    .pipe(
      tap((race: Race) => this.log(`fetched countries from file ${url}`)),
      catchError(this.handleError<Race>('getCountries'))
    );
  }

  getEnglishCounties(): Observable<County> {
    const url = `../assets/english-counties.json`;
    return this.http.get<County>(url)
    .pipe(
      tap((race: Race) => this.log(`fetched counties from file ${url}`)),
      catchError(this.handleError<Race>('getEnglishCounties'))
    );
  }

  getRaceAreas(): Observable<RaceArea> {
    const url = `../assets\areas.json`;
    return this.http.get<Country>(url)
    .pipe(
      tap((race: Race) => this.log(`fetched area from file ${url}`)),
      catchError(this.handleError<Race>('getRaceAreas'))
    );
  }

  getResults(eventId?: number, fromDate?: string, toDate?: string, limit?: number): Observable<Result> {
    const url = `${this.baseUrl}/results`;
    // TODO add query string parameters
    return this.http.get<Result>(url)
      .pipe(
        tap((result: Result) => this.log(`fetched results ${JSON.stringify(result)}`)),
        catchError(this.handleError<Result>('getResults'))
      );
  }

  deleteEvent(eventId: number): Observable<Event> {
    const url = `${this.baseUrl}/events/${eventId}`;

    return this.http.delete<Event>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted event id=${eventId}`)),
      catchError(this.handleError<Event>('deleteEvent'))
    );
  }

  deleteRace(eventId: number, raceId: number): Observable<Race> {
    const url = `${this.baseUrl}/events/${eventId}/race/${raceId}`;

    return this.http.delete<Race>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted race id=${eventId}`)),
      catchError(this.handleError<Race>('deleteRace'))
    );
  }

  deleteRunner(runnerId: number): Observable<Runner> {
    const url = `${this.baseUrl}/runners/${runnerId}`;

    return this.http.delete<Runner>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted runner id=${runnerId}`)),
      catchError(this.handleError<Runner>('deleteRunner'))
    );
  }

  deleteResult(resultId: number): Observable<Result> {
    const url = `${this.baseUrl}/results/${resultId}`;

    return this.http.delete<Result>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted result id=${resultId}`)),
      catchError(this.handleError<Result>('deleteResult'))
    );
  }

  deleteMeeting(eventId: number, meetingId: number): Observable<Meeting> {
    const url = `${this.baseUrl}/events/${eventId}/meetings/${meetingId}`;

    return this.http.delete<Meeting>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted meeting id=${meetingId}`)),
      catchError(this.handleError<Meeting>('deleteMeeting'))
    );
  }

  saveEvent(event: Event): Observable<Event> {
    const url = `${this.baseUrl}/events`;
    return this.http.post<Event>(url, event, this.httpOptions)
    .pipe(
      tap((e: Event) => this.log(`added event ${JSON.stringify(e)}`)),
      catchError(this.handleError<Event>('saveEvent'))
    );
  }

  saveRace(race: Race): Observable<Race> {
    const url = `${this.baseUrl}/races`;
    return this.http.post<Race>(url, race, this.httpOptions)
    .pipe(
      tap((r: Race) => this.log(`added race ${JSON.stringify(r)}`)),
      catchError(this.handleError<Race>('saveRace'))
    );
  }

  saveRunner(runner: Runner): Observable<Runner> {
    const url = `${this.baseUrl}/runners`;
    return this.http.post<Runner>(url, runner, this.httpOptions)
    .pipe(
      tap((r: Runner) => this.log(`added race ${JSON.stringify(r)}`)),
      catchError(this.handleError<Runner>('saveRunner'))
    );
  }

  saveResult(result: Result): Observable<Result> {
    const url = `${this.baseUrl}/results`;
    return this.http.post<Result>(url, result, this.httpOptions)
    .pipe(
      tap((r: Result) => this.log(`added result ${JSON.stringify(r)}`)),
      catchError(this.handleError<Result>('saveResult'))
    );
  }

  saveMeeting(meeting: Meeting): Observable<Meeting> {
    const url = `${this.baseUrl}/events/${meeting.eventId}/meetings`;
    return this.http.post<Meeting>(url, meeting, this.httpOptions)
    .pipe(
      tap((meet: Meeting) => this.log(`added meeting ${JSON.stringify(meet)}`)),
      catchError(this.handleError<Meeting>('saveMeeting'))
    );
  }

  saveRunnerOfTheMonth(winners: RunnerOfTheMonth): Observable<RunnerOfTheMonth> {
    const url = `${this.baseUrl}/runnerofthemonth`;
    return this.http.post<RunnerOfTheMonth>(url, winners, this.httpOptions)
    .pipe(
      tap((a: RunnerOfTheMonth) => this.log(`added runner of the month winners ${JSON.stringify(a)}`)),
      catchError(this.handleError<RunnerOfTheMonth>('saveRunnerOfTheMonth'))
    );
  }

  sendRunnerOfTheMonthVotesEmail(request) {
    const url = `${this.baseV3Url}/runnerofthemonth/vote/email`;
    return this.http.post(url, request, this.httpOptions)
    .pipe(
      tap((_ => this.log(`send runner of the month voting email ${JSON.stringify(request)}`)),
      catchError(this.handleError('sendRunnerOfTheMonthVotesEmail'))
    ));
  }

  updateEvent(eventId: number, field: string, value: string): Observable<any> {
    const url = `${this.baseUrl}/events/${eventId}`;
    return this.http.put(url, {
      field,
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated event: id=${eventId}, field=${field}, value=${value}`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  }

  updateRace(raceId: number, field: string, value: string): Observable<any> {
    const url = `${this.baseUrl}/races/${raceId}`;
    return this.http.put(url, {
      field,
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated race: id=${raceId}, field=${field}, value=${value}`)),
      catchError(this.handleError<any>('updateRace'))
    );
  }

  updateRunner(runnerId: number, field: string, value: string): Observable<any> {
    const url = `${this.baseUrl}/runners/${runnerId}`;
    return this.http.put(url, {
      field,
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated runner: id=${runnerId}, field=${field}, value=${value}`)),
      catchError(this.handleError<any>('updateRunner'))
    );
  }

  updateResult(resultId: number, field: string, value: string): Observable<any> {
    const url = `${this.baseUrl}/results/${resultId}`;
    return this.http.put(url, {
      field,
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated result: id=${resultId}, field=${field}, value=${value}`)),
      catchError(this.handleError<any>('updateResult'))
    );
  }

  updateMeeting(eventId: number, meetingId: number, field: string, value: string): Observable<any> {
    const url = `${this.baseUrl}/events/${eventId}/meetings/${meetingId}`;
    return this.http.put(url, {
      field,
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated meeting: id=${meetingId}, field=${field}, value=${value}`)),
      catchError(this.handleError<any>('updateMeeting'))
    );
  }

  updateRunnerOfTheMonth(runnerOfTheMonthId: number, value: string): Observable<any> {
    const url = `${this.baseV3Url}/runnerofthemonth/winners/${runnerOfTheMonthId}`;
    return this.http.put(url, {
      field : 'runnerId',
      value
    }, this.httpOptions).pipe(
      tap(_ => this.log(`updated runner of the month: id=${runnerOfTheMonthId}, value=${value}`)),
      catchError(this.handleError<any>('updateResult'))
    );
  }

  private log(message: string) {
    if (environment.production === false) {
      console.log('TeamService: ' + message);
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

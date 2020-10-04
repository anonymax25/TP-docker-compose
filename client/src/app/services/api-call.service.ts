import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Task } from '../task';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {AuthService} from "./auth.service";

const localUrl = 'assets/data/tasks.json';

const optionRequete = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.apiUrl + '/task/' + this.authService.user._id, optionRequete).pipe(
      catchError(this.handleError<Task[]>('getTasks', [])));
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/task/' + id, optionRequete).pipe(
      catchError(this.handleError<any>('deleteTask', [])));
  }

  sendTask(task: Task): Observable<any> {
    task.user = this.authService.user._id;
    return this.http.post<any>(environment.apiUrl + '/task', task, optionRequete).pipe(
      catchError(this.handleError<any>('sendTask', [])));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}

import { Movie } from './../models/movie';
import { environment } from './../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders(
      {'Content-Type': 'application/json; charset=utf-8', 'Authorization': 'Token ' + token}
    );

    return {headers: httpHeaders};
  }

  getMovies(): Observable<any> {
    return this.http.get(this.baseUrl + 'movies/', this.getAuthHeaders());
  }

  addMovie(movie: Movie): Observable<any> {
    return this.http.post(this.baseUrl + 'movies/', movie,  this.getAuthHeaders());
  }

  editMovie(movie: Movie, id: number): Observable<any>{
    return this.http.put(this.baseUrl + 'movies/' + id + '/', movie,  this.getAuthHeaders());
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'movies/' + id + '/',  this.getAuthHeaders());
  } 
}

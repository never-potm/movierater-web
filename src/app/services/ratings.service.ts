import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RatingsService {

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

  addRating(user_id: number, movie_id: number, rating: number): Observable<any> {
    const body = {
      user: user_id,
      movie: movie_id,
      stars: rating
    };
    return this.http.post(this.baseUrl + 'ratings/rate_movie/', body,  this.getAuthHeaders());
  }

  editRating(user_id: number, movie_id: number, rating: number): Observable<any> {
    const body = {
      user: user_id,
      movie: movie_id,
      stars: rating
    };
    return this.http.put(this.baseUrl + 'ratings/rate_movie/', body,  this.getAuthHeaders());
  }

}

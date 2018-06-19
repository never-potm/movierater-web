import { RatingsService } from './../services/ratings.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Movie } from './../models/movie';
import { MovieService } from './../services/movie.service';
import { Router } from '@angular/router';
import { GlobalService } from './../services/global.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MovieService, RatingsService]
})
export class HomeComponent implements OnInit {


  account: User = new User();
  userSubsciption = new Subscription();
  movies;
  selectedMovie: Movie;
  addMovieInput: FormGroup;
  isAddEditMode: boolean;
  isEdit: boolean;
  my_rating: number;

  constructor(private fb: FormBuilder, private global: GlobalService, private router: Router, 
    private movieService: MovieService, public snackBar: MatSnackBar, 
    private ratingsService: RatingsService) { }

  ngOnInit() {
    
    this.isAddEditMode = false;
    this.addMovieInput = this.fb.group(
      {
        title: ['', Validators.required],
        description: ['', Validators.required]
      }
    );

    this.userSubsciption = this.global.user.subscribe(
      me => this.account = me
    );

    if (localStorage.getItem('token') && localStorage.getItem('account')) {
      this.global.me = JSON.parse(localStorage.getItem('account'));
      this.getMovies();
    } else {
      this.router.navigate(['']);
    }
    this.my_rating = 3;
  }

  getMovies() {
    this.movieService.getMovies().subscribe(
      response => {
        this.movies = response;
      },
      error => {
        this.snackBar.open('Error getting movies', '', {duration: 3000});
      }
    );
  }

  movieClicked(movie: Movie) {
    this.isAddEditMode = false;
    this.selectedMovie = movie;
    console.log(this.selectedMovie);
  }

  addMovieClicked() {
    this.selectedMovie = null;
    this.isEdit = false;
    this.isAddEditMode = true ;
    this.addMovieInput.reset();
  }

  submitMovie() {
    if(this.isEdit) {
      this.movieService.editMovie(this.addMovieInput.value, this.selectedMovie.id).subscribe(
        response => {
          const movieIndex = this.movies.map(function(m) {return m.id}).indexOf(this.selectedMovie.id);
          if(movieIndex >= 0) {
            this.movies[movieIndex] = response;
            this.selectedMovie = response;
          }
          this.addMovieInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error editing movie', '', {duration: 3000});
        }
      );  
    } else {
      this.movieService.addMovie(this.addMovieInput.value).subscribe(
        response => {
          this.movies.push(response);
          this.addMovieInput.reset();
          this.isAddEditMode = false;
        },
        error => {
          this.snackBar.open('Error adding movie', '', {duration: 3000});
        }
      );  
    }
  }

  editMovieClicked() {
    this.isEdit = true;
    this.isAddEditMode = true ;
    this.addMovieInput = this.fb.group(
      {
        title: [this.selectedMovie.title, Validators.required],
        description: [this.selectedMovie.description, Validators.required]
      }
    );
  }

  deleteMovieClicked() {
    this.movieService.deleteMovie(this.selectedMovie.id).subscribe(
      response => {
        const movieIndex = this.movies.map(function(m) {return m.id}).indexOf(this.selectedMovie.id);
        if(movieIndex >= 0) {
          this.movies.splice(movieIndex, 1);
          this.selectedMovie = null;
        }
        this.isAddEditMode = false;
      },
      error => {
        this.snackBar.open('Error deleting movie', '', {duration: 3000});
      }
    );  
  }

  newRate(my_rating: number) {
    this.ratingsService.addRating(this.account.id, this.selectedMovie.id, my_rating).subscribe(
      response => {
        const movieIndex = this.movies.map(function(m) {return m.id}).indexOf(this.selectedMovie.id);
        if(movieIndex >= 0) {
          this.movies[movieIndex] = response['result'];
        }
        this.selectedMovie = response['result'];
        this.snackBar.open(response.message, '', {duration: 3000});
      },
      error => {
        this.snackBar.open('Error. Please try again.', '', {duration: 3000});
      }
    );
  }

  private onLogout() {
    this.global.me = new User();
    localStorage.removeItem('account');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}

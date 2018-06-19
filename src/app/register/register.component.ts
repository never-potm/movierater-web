import { GlobalService } from './../services/global.service';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  userRegister: FormGroup;
  loading: boolean;

  constructor(private router: Router, private fb: FormBuilder, 
    private userService: UserService, private global: GlobalService) { }

  ngOnInit() {
    this.userRegister = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
    );
  }

  onRegister() {
    this.loading = true;
    this.userService.registerUser(this.userRegister.value).subscribe(
      response => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error => {
        this.loading = false;
      }
    );
  }
}

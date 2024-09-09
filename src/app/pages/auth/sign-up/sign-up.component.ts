import {Component, Input} from '@angular/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  @Input() passwordType: string = "password";
  hide: boolean = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])

  })

  showOrHidePassword() : void {
    this.hide = !this.hide;
    this.passwordType = this.hide ? 'password' : 'text';
  }

}

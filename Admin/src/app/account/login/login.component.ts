import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { LoginModel } from 'src/app/models/login.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// Login Component
export class LoginComponent {

  // Login Form
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  a: any = 10;
  b: any = 20;
  toast!: false;

    loginModel = new LoginModel(); //Arreglo que usaremos para traer lo del endpoint
    loginForm!: FormGroup;
  // set the current year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router,
    private store: Store,
    private http: HttpClient,
) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    /**
     * Form Validatyion
     */
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    // Login Api
    //this.store.dispatch(login({ email: email, password: password }));
    
  }

  // cambiarContrasena() {
  //   this.http.post('https://localhost:7091/RestablecerContrasena', {
  //     nombre: this.usuarioNombre,
  //     nuevaContrasena: this.nuevaContrasena
  //   }).subscribe(
  //     res => {
  //       Swal.fire('Contraseña cambiada', 'Ahora puedes iniciar sesión', 'success');
  //       this.router.navigate(['/auth/login']);
  //     },
  //     err => {
  //       Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
  //     }
  //   );
  // }

  login(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const loginModel: LoginModel = this.loginForm.getRawValue();
    this.http.post('https://localhost:7091/IniciarSesion', loginModel).subscribe(
      response => {
              Swal.fire('Bienvenido', '', 'success');
              this.router.navigate(['/restaurante/restaurantes/list']);
            },
            err => {
              Swal.fire('Error', 'Usuario o contraseña incorrecta', 'error');
            });
  }
  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  get form(){
    return this.loginForm.controls;
  }
}

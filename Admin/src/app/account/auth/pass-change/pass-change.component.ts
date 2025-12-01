import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pass-change',
 
  templateUrl: './pass-change.component.html',
  styleUrls: ['./pass-change.component.scss'],
  
})
// Password Change Component
export class PassChangeComponent {
  // set the currenr year

  year: number = new Date().getFullYear();

  fieldTextType!: boolean;
  fieldTextType1!: boolean;

  nuevaContrasena: string = '';
usuarioNombre: string = '';

constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.usuarioNombre = params['user'];
  });
}

cambiarContrasena() {
  this.http.post('https://localhost:7091/RestablecerContrasena', {
    nombre: this.usuarioNombre,
    nuevaContrasena: this.nuevaContrasena
  }).subscribe(
    res => {
      Swal.fire('Contraseña cambiada', 'Ahora puedes iniciar sesión', 'success');
      this.router.navigate(['/auth/login']);
    },
    err => {
      Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
    }
  );
}
  
 /* Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }


}


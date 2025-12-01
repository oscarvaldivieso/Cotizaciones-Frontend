
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validator } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pass-reset',
 
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss'],
  
})


  // set the currenr year
export class PassResetComponent implements OnInit {
  nombre: string = '';
  // set the current year
  year: number = new Date().getFullYear();

  usuario = new Usuario();
  //resetForm: FormGroup;
  codeStatus: number = 0;
  messageStatus: string = '';

  validationform!: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
  ) {
    // Initialize form
    //this.resetForm = this.fb.group({
      //correo: ['', [Validators.required, Validators.email]]
  //  });
  }



  ngOnInit(): void {
    // Check if email
    // t was passed in URL
    this.validationform = this.formBuilder.group({  
      usua_Nombre: ['', [Validators.required]],
    });
    const correo = this.route.snapshot.paramMap.get('email');
    if (correo) {
     // this.resetForm.get('email')?.setValue(correo);
    }
  }

  generarCodigo(formulario: NgForm) {
     
      const formValues = this.validationform.value;
      alert('Generar codigo ' + formulario.value.nombre); 
      this.nombre = formulario.value.nombre; 
      this.usuario = {
        usua_Id: 0,
        usua_Nombre: formulario.value.nombre,
        usua_Contrasena: '',
        usua_Imagen: '',
        nombreCompleto: '',
        role_Nombre: '',
        empl_Id:0,
        role_Id: 0,  
        usua_Estado: 0,
        usua_FechaCreacion: new Date(),
        usua_Creacion: 1
      };
 // alert(this.usuario.usua_Nombre);
      this.http.get('https://localhost:7091/GenerarCodigo/' + this.nombre)
        .subscribe(
          response => {
            if (response) {
            //  this.codeStatus = response.codeStatus;
             // this.messageStatus = response.data.messageStatus;
              
              // Show success message
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Reset code has been sent to your email.',
                confirmButtonText: 'OK'
              });
              
              // Optional: Redirect to a verification page
              // this.router.navigate(['/auth/verify-code', correo]);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                //text: response.message || 'Something went wrong',
                confirmButtonText: 'OK'
              });
            }
          },
          error => {
            console.error('Error generating reset code:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to generate reset code. Please try again.',
              confirmButtonText: 'OK'
            });
          }
        );
    //} else {
      // Mark form controls as touched to trigger validation messages
     // this.resetForm.markAllAsTouched();
   // }
  }

  codigo: string = '';

  verificarCodigo() {
    // Verifica si el código ingresado es correcto para el usuario
    this.http.get(`https://localhost:7091/VerificarCodigo/${this.nombre}/${this.codigo}`)
      .subscribe(
        (response: any) => {
        //  console.log('Código verificado:', response);
          if (response.success) {
            Swal.fire('Código correcto', 'Ahora puedes cambiar tu contraseña', 'success');
            this.router.navigate(['/auth/pass-change'], { queryParams: { user: this.nombre } });
          } else {
            Swal.fire('Código incorrecto', 'Revisa tu correo y vuelve a intentarlo', 'error');
          }
        },
        error => {
          console.error('Error al verificar el código', error);
          Swal.fire('Error', 'No se pudo verificar el código', 'error');
        }
      );
  }

}
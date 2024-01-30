import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const result = await this.authService.signIn(
      this.credentials.getRawValue()
    );
    loading.dismiss();
    if (result.error) {
      this.showAlert(result.error.name, result.error.message);
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      mode: 'ios',
      message,
      buttons: ['OK'],
    });
    alert.present();
  }

  async getMagicLink() {
    console.log(this.credentials.controls.email);
  }

  async forgotPassword() {
    console.log(this.credentials.controls.email);
  }

  async withFacebook() {
    console.log(this.credentials.controls.email);
  }
  async withGoogle() {
    console.log(this.credentials.controls.email);
  }

  ngOnInit() {}
}

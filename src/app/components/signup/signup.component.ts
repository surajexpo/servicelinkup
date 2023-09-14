import { Component } from "@angular/core";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { WindowService } from "src/app/services/window.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  otp: any = "";
  step1: string = "block";
  step2: string = "none";
  windowRef: any = "";
  phoneNumber: any = "+91";
  collectionCount:number=0;
  constructor(
    private windowService: WindowService,
    private user_service: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}
  auth = getAuth();
  ngOnInit(): void {
        this.loadCaptcha();
      
  }
  get getControl() {
    return this.registerForm.controls;
  }
 async getCollectionCount(){
   this.user_service
      .getUserCollection()
      .then((res) => {
        console.log("res ", res.data().count);
       this.collectionCount=res.data().count
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });

  }
  loadCaptcha() {
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      "recaptcha-verifier",
      {
        size: "normal",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log(response);
          // ...
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        },
      }
    );
    this.windowRef.recaptchaVerifier.render();
  }
  registerForm = new FormGroup({

    mobileNo: new FormControl("", [
      Validators.minLength(10),
      Validators.pattern("^[0-9]*$"),
      Validators.required,
    ]),
    dob: new FormControl("", Validators.required),
    uid: new FormControl("", Validators.required),
    hsa_id: new FormControl("", Validators.required),
    placeofbirth: new FormControl("", Validators.required),
    identity: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    belowpoverty: new FormControl(false),
    underprivileged: new FormControl(false),
    document: new FormControl(""),
    iAgreeToTnC: new FormControl(false),
  });
  sendOtp() {
    this.phoneNumber =
    this.phoneNumber + this.registerForm.controls["mobileNo"].value;
    console.log("phone number", this.phoneNumber);
    signInWithPhoneNumber(
      this.auth,
      this.phoneNumber,
      this.windowRef.recaptchaVerifier
    )
      .then((confirmationResult: any) => {
        console.log("kuchh aya re", confirmationResult);
        this.windowRef.confirmationResult = confirmationResult;
        this.snack.open("OTP has been sent on your mobile number", "ok", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 2000,
        });
        this.step1 = "none";
        this.step2 = "block";
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
 async verifyOTP() {
 await this.getCollectionCount();
    this.windowRef.confirmationResult
      .confirm(this.otp)
      .then((res: any) => {
        try {
          console.log("response  ", res.user.uid);
       
          this.registerForm.controls['uid'].setValue(res.user.uid);
          let hsaId=100000000000+this.collectionCount+1;
          this.registerForm.controls['hsa_id'].setValue('HSA'+hsaId);
          console.log('collection cout',this.collectionCount);
          console.log('hsaId cout',hsaId);
          console.log('register form',this.registerForm.value);
          this.user_service
            .addUser(this.registerForm.value)
            .then((res) => {
              this.snack.open("Register successfull", "ok", {
                horizontalPosition: "right",
                verticalPosition: "top",
                duration: 2000,
              });
              this.router.navigate(["/personal-page"]);
            })
            .catch((error: any) => {
              console.log("add user catch", error);
            });
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error: any) => {
        this.snack.open("Incorrect OTP", "ok", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 2000,
        });
        console.log(error);
      });
  }
}

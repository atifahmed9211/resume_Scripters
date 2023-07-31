import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class AsyncEmailValidator implements AsyncValidator {
  private apiKey?: string; // put your api key here
  constructor(private http: HttpClient) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> {
    if (ctrl.value) {
      return this.http
        .get<{ status: string }>(
          "https://isitarealemail.com/api/email/validate",
          {
            params: { email: ctrl.value },
            headers: {
              Authorization: "Bearer 48369ba3-266f-4292-8d52-c288b01c85a5",
            },
          }
        )
        .toPromise()
        .then((result) => {
          if (result.status === "invalid") {
            return { invalid: true };
          } else if (result.status === "unknown") {
            return { invalid: true };
          } else {
            // status is valid
            return null;
          }
        });
    } else {
      return Promise.resolve({ invalid: true });
    }
  }
}
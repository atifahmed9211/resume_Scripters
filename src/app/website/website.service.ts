import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { data } from 'jquery';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private baseUrl = environment.baseUrl;
  //use for buying process,,, user can buy a package or a service
  newOrderId: any;
  uploadedCVFile;
  critiqueTaskCompleted = false;
  redirecting_url;

  constructor(private http: HttpClient) { }

  getSamples():Observable<any>
  {
    return this.http.get<any>(`${this.baseUrl}/get-sample`);
  }
  get_Samples_Category()
  {
    return this.http.get<any>(`${this.baseUrl}/get-category`);
  }
  get_Samples_By_Category(id)
  {
    return this.http.get<any>(`${this.baseUrl}/get-sample-category/${id}`);
  }
  getAllBlogs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-blogs`);
  }

  getBlogById(id): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-blog/${id}`);
  }
  // Authentications Calls

  register(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(user): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }

  resetPassword(email)
  {
    let token = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/reset-password`,email,{headers});
  }

  getUSer(): Observable<any> {
    let token = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/user`, { headers });
  }
  // Authentications Calls End

  getAllServices(type): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-services/${type}`);
  }

  getAllPackages(type): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-packages/${type}`);
  }

  createOrder(payment): Observable<any> {
    let token = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-order`, payment, { headers });
  }

  createCritique(critique): Observable<any> {
    let token = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-critique`, critique, { headers });
  }
  validateEmail(email) {
    return this.http.get<{ status: string }>(
      "https://isitarealemail.com/api/email/validate",
      {
        params: { email: email },
        headers: {
          Authorization: "Bearer 48369ba3-266f-4292-8d52-c288b01c85a5",
        },
      })
  }
  sendMessage(userData) {
    var headers = {
      "accept": "application/json",
      "api-key": "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",
      "content-type": "application/json"
    }
    var data = {
      sender: {
        name: userData.name,
        email: userData.email
      },
      to: [
        {
          email: 'careerscripters@gmail.com'
        },
      ],
      subject: userData.subject,
      htmlContent: userData.message + "<br/><br/>Received From ResumeScripters.com"
    }
    return this.http.post('https://api.sendinblue.com/v3/smtp/email', data, { headers: headers })
  }
}

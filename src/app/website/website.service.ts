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
  selectedPackage: any;
  selectedService:any;
  newOrderId:any;
  constructor(private http: HttpClient) { }

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
     console.log("Create Order Method Called");
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
}

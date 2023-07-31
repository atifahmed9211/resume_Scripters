import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  public chooseCV = true;
  selectedOrderId;
  UserRevisionData;
  constructor(private http: HttpClient) {

  }

  // Orders Calls

  getOrderById(id): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.get<any>(`${this.baseUrl}/get-order/${id}`, { headers });
  }

  getOrdersByUser(): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.get<any>(`${this.baseUrl}/get-orders-by-user`, { headers });
  }

  uploadAnswersFile(order): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.post<any>(`${this.baseUrl}/upload-answers`, order, { headers })
  }
  // Orders Calls End

  // Critiques Calls

  getCritiqueById(id): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.get<any>(`${this.baseUrl}/get-critique/${id}`, { headers });
  }

  getCritiquesByUser(): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.get<any>(`${this.baseUrl}/get-critiques-by-user`, { headers });
  }

  submitResumeData(resume_details): Observable<any> {
    /* we cannot initialize usertoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.post<any>(`${this.baseUrl}/update-order`, resume_details, { headers })
  }
  stripe(payload):Observable<any>
  {
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.post<any>(`${this.baseUrl}/stripe`,payload,{headers})
  }
  updateProfile(userDetail)
  {
    let usertoken = localStorage.getItem("userToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${usertoken}`);
    return this.http.post<any>(`${this.baseUrl}/updateUser`,userDetail,{headers})
  }
}

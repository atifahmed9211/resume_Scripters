import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeSampleService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  addCategory(data) {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.post<any>(`${this.baseUrl}/create-category`, data, { headers });
  }
  updateCategory(data)
  {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.post<any>(`${this.baseUrl}/update-category`, data, { headers });
  }
  deleteCategory(id)
  {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.get<any>(`${this.baseUrl}/delete-category/${id}`, { headers });
  }
  createSample(data): Observable<any> {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.post<any>(`${this.baseUrl}/create-sample`, data, { headers });
  }
  getSampleById(id)
  {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.get<any>(`${this.baseUrl}/get-sample/${id}`,{headers});
  }
  updateSample(data)
  {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.post<any>(`${this.baseUrl}/update-sample`, data, { headers });
  }
  deleteSample(id) {
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.get<any>(`${this.baseUrl}/delete-sample/${id}`,{headers});
  }
}

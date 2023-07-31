import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumesSamplesService {

  constructor() { }

  createBlog(blog): Observable<any> {
    /* we cannot initialize admintoken globally becuase in case we change user 
    token from browser(Apllication) then our method will not get new token and 
    it always get global token,, */ 
    let admintoken = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${admintoken}`);
    return this.http.post<any>(`${this.baseUrl}/create-blog`, blog, { headers });
    }
}

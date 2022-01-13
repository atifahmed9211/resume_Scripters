import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.baseUrl;

  constructor(private http:HttpClient) { }
  // Authentications Calls
  login(user):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`,user);
  }

  getAdmin():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/user`,{headers});
  }
  // Authentications Calls End

  // Blogs Calls
  createBlog(blog):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-blog`,blog,{headers});
  }

  updateBlog(blog):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-blog`,blog,{headers});
  }

  getAllBlogs():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/get-blogs`);
  }

  getBlogById(id):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/get-blog/${id}`);
  }

  deleteBlogById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/delete-blog/${id}`,{headers});
  }
  // Blogs Calls End

  // Services Calls
  createService(service):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-service`,service,{headers});
  }

  updateService(service):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-service`,service,{headers});
  }

  getAllServices():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-services`,{headers});
  }

  getServiceById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-service/${id}`,{headers});
  }

  deleteServiceById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/delete-service/${id}`,{headers});
  }
  // Services Calls End

  // Packages Calls
  createPackage(pkg):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-package`,pkg,{headers});
  }

  updatePackage(pkg):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-package`,pkg,{headers});
  }

  getAllPackages():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-packages`,{headers});
  }

  getPackageById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-package/${id}`,{headers});
  }

  deletePackageById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/delete-package/${id}`,{headers});
  }
  // Packages Calls End

  // Testimonials Calls
  createTestimonial(testimonial):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/create-testimonial`,testimonial,{headers});
  }

  updateTestimonial(testimonial):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-testimonial`,testimonial,{headers});
  }

  getAllTestimonials():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-testimonials`,{headers});
  }

  getTestimonialById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-testimonial/${id}`,{headers});
  }

  deleteTestimonialById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/delete-testimonial/${id}`,{headers});
  }
  // Testimonials Calls End

  // Orders Calls

  getAllOrders():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/get-orders`,{headers});
  }

  getOrderById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-order/${id}`,{headers});
  }

  uploadQuestionFile(order):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/upload-questions`,order,{headers})
  }

  updateOrder(order):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-order`,order,{headers})
  }
  // Orders Calls End

  // Orders Calls

  getAllCritiques():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/get-critiques`,{headers});
  }

  getCritiqueById(id):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-critique/${id}`,{headers});
  }

  getCritiquesByUser():Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/get-critiques-by-user`,{headers});
  }

  updateCritique(critique):Observable<any>{
    let token = localStorage.getItem("adminToken");
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/update-critique`,critique,{headers})
  }
  // Orders Calls End

}

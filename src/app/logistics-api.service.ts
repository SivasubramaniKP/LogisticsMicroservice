import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsApiService {
  private readonly inventoryUrl = 'http://localhost:8081/v1/inventory';
  private readonly warehouseUrl = 'http://localhost:8082/v1/warehouse';
  private readonly trackingUrl = 'http://localhost:8083/v1/track';
  private readonly fleetUrl = 'http://localhost:8084/v1/fleet';
  private readonly customsUrl = 'http://localhost:8085/v1/customs';

  constructor(private http: HttpClient) {}

  ingestInventory(payload: { supplierName: string; payload: string }): Observable<any> {
    return this.http.post(`${this.inventoryUrl}/ingest`, payload);
  }

  allocateWarehouseSlot(payload: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.warehouseUrl}/allocate-slot`, payload);
  }

  assignDispatch(payload: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.fleetUrl}/assign-dispatch`, payload);
  }

  submitCustoms(payload: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.customsUrl}/clearance`, payload);
  }

  getTracking(trackingUuid: string): Observable<any> {
    return this.http.get(`${this.trackingUrl}/${trackingUuid}`);
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(this.inventoryUrl);
  }

  getWarehouseSlots(): Observable<any[]> {
    return this.http.get<any[]>(this.warehouseUrl);
  }

  getFleetAssignments(): Observable<any[]> {
    return this.http.get<any[]>(this.fleetUrl);
  }

  getCustomsRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.customsUrl);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogisticsApiService } from './logistics-api.service';

@Component({
  selector: 'app-data-page',
  standalone: false,
  template: `
    <section class="page-header"><div><p class="eyebrow">Data workspace / Service records</p><h1>{{ serviceName }} data</h1><p>Review the records owned by this service. Each service has its own database and table.</p></div><button class="button primary" (click)="router.navigate(['/services', type])">Create new record <span>-></span></button></section>
    <nav class="data-tabs"><a *ngFor="let tab of tabs" [class.active]="type === tab.type" (click)="router.navigate(['/data', tab.type])">{{ tab.label }}</a></nav>
    <section class="data-panel"><div class="data-panel-head"><div><h2>{{ serviceName }} records</h2><span>{{ records.length }} records loaded from the database</span></div><button class="button quiet small" (click)="load()">Refresh</button></div><div class="loading-state" *ngIf="loading">Loading records...</div><div class="error-state" *ngIf="!loading && loadError">{{ loadError }}</div><div class="empty-state" *ngIf="!loading && !loadError && !records.length"><span class="empty-icon">+</span><h3>No {{ serviceName | lowercase }} records yet</h3><p>Create the first record to see it here.</p></div><div class="table-wrap" *ngIf="!loading && !loadError && records.length"><table><thead><tr><th *ngFor="let column of columns">{{ column.label }}</th></tr></thead><tbody><tr *ngFor="let record of records"><td *ngFor="let column of columns" [class.reference]="column.reference">{{ value(record, column.key) }}</td></tr></tbody></table></div></section>
  `
})
export class DataPageComponent implements OnInit {
  type = 'inventory'; serviceName = 'Inventory'; records: any[] = []; loading = true; loadError = '';
  tabs = [{ type: 'inventory', label: 'Inventory' }, { type: 'warehouse', label: 'Warehouse slots' }, { type: 'fleet', label: 'Fleet dispatches' }, { type: 'customs', label: 'Customs records' }];
  columns: Array<{ key: string; label: string; reference?: boolean }> = [];
  private readonly definitions: Record<string, any> = {
    inventory: { name: 'Inventory', columns: [{ key: 'trackingUuid', label: 'Tracking ID', reference: true }, { key: 'supplierName', label: 'Supplier' }, { key: 'supplierPayload', label: 'Contents' }, { key: 'ingestedAt', label: 'Registered' }] },
    warehouse: { name: 'Warehouse slot', columns: [{ key: 'slotId', label: 'Slot ID', reference: true }, { key: 'locationJson', label: 'Location' }, { key: 'reservedAt', label: 'Reserved' }] },
    fleet: { name: 'Fleet dispatch', columns: [{ key: 'assignmentId', label: 'Assignment reference', reference: true }, { key: 'driverName', label: 'Driver' }, { key: 'vehicleRegistrationNumber', label: 'Vehicle registration' }, { key: 'assignedAt', label: 'Assigned' }] },
    customs: { name: 'Customs', columns: [{ key: 'recordId', label: 'Record ID', reference: true }, { key: 'status', label: 'Status' }, { key: 'processedAt', label: 'Processed' }] }
  };
  constructor(private api: LogisticsApiService, private route: ActivatedRoute, public router: Router) {}
  ngOnInit(): void { this.route.paramMap.subscribe(params => { this.type = params.get('type') || 'inventory'; const definition = this.definitions[this.type] || this.definitions['inventory']; this.serviceName = definition.name; this.columns = definition.columns; this.load(); }); }
  load(): void { this.loading = true; this.loadError = ''; const request = this.type === 'inventory' ? this.api.getInventory() : this.type === 'warehouse' ? this.api.getWarehouseSlots() : this.type === 'fleet' ? this.api.getFleetAssignments() : this.api.getCustomsRecords(); request.subscribe({ next: records => { this.records = records; this.loading = false; }, error: error => { this.records = []; this.loading = false; this.loadError = error.error?.error || 'The data service is not available. Start the backend service and refresh.'; } }); }
  value(record: any, key: string): string { const value = record[key]; return value ? (key.endsWith('At') ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : String(value)) : '-'; }
}

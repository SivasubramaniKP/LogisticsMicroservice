import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogisticsApiService } from './logistics-api.service';

@Component({
  selector: 'app-service-page',
  standalone: false,
  template: `
    <section class="page-header"><div><p class="eyebrow">Service desk / Guided operation</p><h1>{{ service.title }}</h1><p>{{ service.description }}</p></div><span class="service-icon large">{{ service.number }}</span></section>
    <div class="service-workspace">
      <article class="workflow-card"><div class="workflow-intro"><span class="step-label">What you need</span><h2>{{ service.question }}</h2><p>{{ service.help }}</p></div><form [formGroup]="form" (ngSubmit)="submit()">
        <ng-container *ngFor="let field of service.fields"><label>{{ field.label }}<span class="field-hint">{{ field.hint }}</span><textarea *ngIf="field.multiline" [formControlName]="field.name" [placeholder]="field.placeholder"></textarea><input *ngIf="!field.multiline" [type]="field.type || 'text'" [formControlName]="field.name" [placeholder]="field.placeholder" /></label></ng-container>
        <button class="button primary submit-button" type="submit" [disabled]="form.invalid">{{ service.action }} <span>-></span></button>
      </form></article>
      <aside class="response-card" [class.has-response]="response"><span class="step-label">Latest response</span><div *ngIf="response; else waiting"><span class="response-check">OK</span><h3>{{ response.error ? 'Something needs attention' : 'Saved successfully' }}</h3><p *ngIf="!response.error">Your {{ service.shortName }} request is recorded. You can review it in the service table.</p><p *ngIf="response.error">{{ response.details || 'Please check the form and try again.' }}</p><div class="next-actions" *ngIf="!response.error"><button class="button primary" (click)="router.navigate(['/data', type])">View {{ service.shortName }} records</button><button class="button quiet" *ngIf="nextType" (click)="router.navigate(['/services', nextType])">Continue to {{ nextLabel }}</button></div></div><ng-template #waiting><div class="waiting-state"><span class="empty-icon">?</span><h3>Ready when you are</h3><p>Complete the form to create a new {{ service.shortName }} record.</p></div></ng-template></aside>
    </div>
  `
})
export class ServicePageComponent implements OnInit {
  type = 'inventory';
  form!: FormGroup;
  response: any = null;
  service: any;
  nextType = '';
  nextLabel = '';

  private readonly definitions: Record<string, any> = {
    inventory: { title: 'Register inventory', shortName: 'inventory', number: '01', description: 'Create a record for goods that have arrived at your facility.', question: 'What has arrived?', help: 'Enter the supplier and a short description of the shipment contents.', action: 'Register inventory', fields: [
      { name: 'supplierName', label: 'Supplier name', hint: 'Who sent this shipment? Use the company name.', placeholder: 'e.g. Northstar Supply' },
      { name: 'payload', label: 'Shipment contents', hint: 'What is inside the shipment?', placeholder: 'e.g. 42 pallets of consumer electronics', multiline: true }
    ]},
    warehouse: { title: 'Reserve a warehouse slot', shortName: 'warehouse', number: '02', description: 'Choose where the incoming goods should be stored.', question: 'Where should it be stored?', help: 'Use the aisle, bay, and zone shown on your warehouse map.', action: 'Reserve slot', fields: [
      { name: 'aisle', label: 'Aisle', hint: 'The warehouse aisle', placeholder: 'e.g. A-12' }, { name: 'bay', label: 'Bay', hint: 'The position in the aisle', placeholder: 'e.g. B4' }, { name: 'zone', label: 'Handling zone', hint: 'How should it be handled?', placeholder: 'e.g. Cold-Chain' }
    ]},
    fleet: { title: 'Assign fleet dispatch', shortName: 'fleet', number: '03', description: 'Connect a driver and vehicle to a shipment leaving the warehouse.', question: 'Who is making the delivery?', help: 'Enter the driver, vehicle registration, and shipment reference.', action: 'Assign dispatch', fields: [
      { name: 'driverName', label: 'Driver name', hint: 'Who is driving this delivery?', placeholder: 'e.g. Ava Rodriguez' }, { name: 'vehicleRegistrationNumber', label: 'Vehicle registration number', hint: 'The registration shown on the vehicle', placeholder: 'e.g. KA-17-TR' }, { name: 'shipmentId', label: 'Shipment reference', hint: 'The shipment leaving the warehouse', placeholder: 'e.g. SHP-7781' }
    ]},
    customs: { title: 'Submit customs clearance', shortName: 'customs', number: '04', description: 'Create a declaration for goods crossing a border.', question: 'What is crossing the border?', help: 'Provide the declaration, destination, and declared value.', action: 'Submit clearance', fields: [
      { name: 'declarationId', label: 'Declaration ID', hint: 'Your customs reference', placeholder: 'e.g. DECL-9912' }, { name: 'country', label: 'Destination country', hint: 'Where are the goods going?', placeholder: 'e.g. USA' }, { name: 'value', label: 'Declared value', hint: 'The value of the goods', placeholder: 'e.g. 2450.00', type: 'number' }
    ]}
  };

  constructor(private fb: FormBuilder, private api: LogisticsApiService, private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type') || 'inventory';
      this.service = this.definitions[this.type] || this.definitions['inventory'];
      const next = { inventory: ['warehouse', 'warehouse'], warehouse: ['fleet', 'fleet dispatch'], fleet: ['customs', 'customs clearance'], customs: ['', ''] }[this.type] || ['', ''];
      this.nextType = next[0];
      this.nextLabel = next[1];
      const controls: Record<string, any> = {};
      this.service.fields.forEach((field: any) => controls[field.name] = ['', Validators.required]);
      this.form = this.fb.group(controls);
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const request = this.type === 'inventory' ? this.api.ingestInventory(this.form.value) : this.type === 'warehouse' ? this.api.allocateWarehouseSlot(this.form.value) : this.type === 'fleet' ? this.api.assignDispatch(this.form.value) : this.api.submitCustoms(this.form.value);
    request.subscribe({ next: response => { this.response = response; }, error: error => { this.response = { error: 'Request failed', details: error.error ?? error.message }; } });
  }

  referenceFor(response: any): string {
    return response.trackingUuid || response.slotId || response.assignmentId || response.recordId || 'Created';
  }
}

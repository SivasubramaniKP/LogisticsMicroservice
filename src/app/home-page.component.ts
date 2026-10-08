import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: false,
  template: `
    <section class="hero-section page-section">
      <div class="hero-copy">
        <p class="eyebrow">Warehouse operations / Live workspace</p>
        <h1>Move every shipment<br /><em>with confidence.</em></h1>
        <p class="hero-lede">Use one clear workspace to register goods, reserve storage, assign delivery, and manage customs.</p>
        <div class="hero-actions">
          <button class="button primary" (click)="router.navigate(['/services/inventory'])">Start with inventory <span>-></span></button>
          <button class="button quiet" (click)="router.navigate(['/data/inventory'])">View data</button>
        </div>
      </div>
      <div class="hero-visual" aria-label="Global logistics network"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="route-line route-a"></div><div class="route-line route-b"></div><div class="hub hub-main"><span>GL</span><small>CONTROL</small></div><div class="hub hub-east"><b>SEA</b><small>Inbound</small></div><div class="hub hub-west"><b>AMS</b><small>Outbound</small></div><div class="hub hub-south"><b>DXB</b><small>Customs</small></div><span class="pulse pulse-one"></span><span class="pulse pulse-two"></span></div>
    </section>
    <section class="metrics-grid home-metrics"><article class="metric-card"><span class="metric-label">Inventory records</span><strong>Ready</strong><small class="positive">Service online</small></article><article class="metric-card"><span class="metric-label">Warehouse capacity</span><strong>Live</strong><small class="neutral">Storage service online</small></article><article class="metric-card"><span class="metric-label">Fleet dispatch</span><strong>Ready</strong><small class="positive">Dispatch service online</small></article><article class="metric-card"><span class="metric-label">Customs workflow</span><strong>Live</strong><small class="positive">Clearance service online</small></article></section>
    <section class="home-guide"><div><p class="eyebrow">Simple workflow</p><h2>Four services. One shipment journey.</h2></div><div class="guide-grid"><article><span>01</span><h3>Register</h3><p>Tell us what arrived and who supplied it.</p></article><article><span>02</span><h3>Store</h3><p>Choose the physical location for the goods.</p></article><article><span>03</span><h3>Dispatch</h3><p>Connect a driver and vehicle to the shipment.</p></article><article><span>04</span><h3>Clear</h3><p>Submit border information when required.</p></article></div></section>
  `
})
export class HomePageComponent {
  constructor(public router: Router) {}
}

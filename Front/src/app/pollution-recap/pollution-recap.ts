import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap {
  @Input() pollutionData: any = null;
}

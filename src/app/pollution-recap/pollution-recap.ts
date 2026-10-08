import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css'
})
export class PollutionRecap {
  @Input() pollutionData: any = null;
}

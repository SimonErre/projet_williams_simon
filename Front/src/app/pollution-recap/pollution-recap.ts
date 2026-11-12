import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollutionLevelPipe } from '../pipes/pollution-level.pipe';
import { HighlightPollutionDirective } from '../directives/highlight-pollution.directive';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,
  imports: [CommonModule, RouterLink, PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap {
  @Input() pollutionData: any = null;
}

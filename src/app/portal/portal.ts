import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal {}

import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollutionRecap } from '../pollution-recap/pollution-recap';

@Component({
  selector: 'app-pollution-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, PollutionRecap],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css'
})
export class PollutionForm {
  pollutionForm: FormGroup;
  isSubmitted = false;
  pollutionData: any = null;

  pollutionTypes = [
    'Plastique', 
    'Chimique', 
    'Dépôt sauvage', 
    'Eau', 
    'Air', 
    'Autre'
  ];

  constructor(private fb: FormBuilder) {
    this.pollutionForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      lieu: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      photo: [''] // Optionnel
    });
  }

  onSubmit() {
    if (this.pollutionForm.valid) {
      this.pollutionData = this.pollutionForm.value;
      this.isSubmitted = true;
    } else {
      this.pollutionForm.markAllAsTouched();
    }
  }
}

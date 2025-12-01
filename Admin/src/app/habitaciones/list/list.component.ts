import {CommonModule} from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  http = inject(HttpClient);

    habitaciones: any[] = [];

    ngOnInit() {
      this.http.get<any[]>('https://localhost:7091/ListarHabitaciones').subscribe(data => this.habitaciones = data);
    }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

  @Input() title: string | undefined;
  @Input() icon: string = 'ri-home-4-line'; // Default icon
  @Input() badgeIcon: string = 'ri-store-2-line'; // Default badge icon
  @Input() badgeCount: number | undefined;
  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    link?: string;
  }>;

  Item!: Array<{
    label?: string;
  }>;

  constructor() { }

  ngOnInit(): void {
  }
}

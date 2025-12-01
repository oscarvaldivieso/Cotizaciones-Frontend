import { Component, OnInit, Inject } from '@angular/core';
import { websiteRootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { EventService } from 'src/app/core/services/event.service';
import { changelayoutTheme } from 'src/app/store/layouts/layout-action';
import { LayoutState } from 'src/app/store/layouts/layout-reducers';

@Component({
  selector: 'app-website-layout',
  templateUrl: './website-layout.component.html',
  styleUrls: ['./website-layout.component.scss']
})
export class WebsiteLayoutComponent {
  // layout related config
    layoutType!: string;
    showMain: any;
    initialAppState!: LayoutState;
  
    constructor(private eventService: EventService, private store: Store<websiteRootReducerState>) { }
  
    ngOnInit() {
      this.store.select('layout').subscribe((data) => {
        this.layoutType = 'horizontal';
        document.documentElement.setAttribute('data-layout', 'horizontal');
        data.LAYOUT == "vertical" || data.LAYOUT == "twocolumn" ? document.documentElement.setAttribute('data-sidebar', data.SIDEBAR_COLOR) : '';
        data.LAYOUT == "vertical" ? document.documentElement.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE) : '';
        document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_MODE);
        document.documentElement.setAttribute('data-layout-width', data.LAYOUT_WIDTH);
        document.documentElement.setAttribute('data-sidebar-image', data.SIDEBAR_IMAGE);
        document.documentElement.setAttribute('data-layout-position', data.LAYOUT_POSITION);
        document.documentElement.setAttribute('data-layout-style', data.SIDEBAR_VIEW);
        document.documentElement.setAttribute('data-topbar', data.TOPBAR);
        document.documentElement.setAttribute('data-preloader', data.DATA_PRELOADER)
        document.documentElement.setAttribute('data-theme', data.LAYOUT_THEME)
  
        if (document.documentElement.getAttribute('data-preloader') == 'enable') {
          setTimeout(() => {
            (document.getElementById("preloader") as HTMLElement).style.opacity = "0";
            (document.getElementById("preloader") as HTMLElement).style.visibility = "hidden";
          }, 1000);
        }
  
      })
    }
  
    /**
    /**
    * Check if the vertical layout is requested
    */
    isVerticalLayoutRequested() {
      return this.layoutType === 'vertical';
    }
  
    /**
     * Check if the horizontal layout is requested
     */
    isHorizontalLayoutRequested() {
      return this.layoutType === 'horizontal';
    }
  
    /**
     * Check if the horizontal layout is requested
     */
    isTwoColumnLayoutRequested() {
      return this.layoutType === 'twocolumn';
    }
  
    getLayoutRequest(): string {
      return this.layoutType
    }
}

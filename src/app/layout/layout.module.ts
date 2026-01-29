import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { LayoutComponent } from "./layout.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  imports: [SharedModule],
  providers: [
    // UserblockService
  ],

  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    // NavsearchComponent,
    // OffsidebarComponent,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,
    // NavsearchComponent,
    // OffsidebarComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class LayoutModule {}

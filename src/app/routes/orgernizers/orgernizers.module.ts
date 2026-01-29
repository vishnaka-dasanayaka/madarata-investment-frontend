import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrgernizerDetailComponent } from "./orgernizer-detail/orgernizer-detail.component";
import { OrgernizersRoutingModule } from "./orgernizers-routing.module";

@NgModule({
  declarations: [OrgernizerDetailComponent],
  imports: [CommonModule, OrgernizersRoutingModule],
})
export class OrgernizersModule {}

import { NgModule } from "@angular/core";
import { NgModel } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { OrgernizerDetailComponent } from "./orgernizer-detail/orgernizer-detail.component";

const routes: Routes = [
  { path: "detail/:id", component: OrgernizerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgernizersRoutingModule {}

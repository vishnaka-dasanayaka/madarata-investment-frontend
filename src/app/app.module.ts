import { NgModule } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { LayoutModule } from "./layout/layout.module";
import { RoutesModule } from "./routes/routes.module";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule } from "@angular/forms";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";
import Preset from "./preset";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { JwtInterceptor } from "./core/_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./core/_helpers/error.interceptor";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RoutesModule,
    SharedModule.forRoot(),
    LayoutModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    providePrimeNG({
      theme: {
        preset: Preset,
      },
    }),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

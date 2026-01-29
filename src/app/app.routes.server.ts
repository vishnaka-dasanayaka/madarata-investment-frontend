import { RenderMode, ServerRoute } from "@angular/ssr";
import { routesIDs } from "./shared/mocks/routes-ids";

export const serverRoutes: ServerRoute[] = [
  {
    path: 'tickets/new-tickets/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
   },
  },
  {
    path: 'tickets/booked-events/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
   },
  },
  {
    path: 'event/detail/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
    },
  },
  {
    path: 'event/event-stats/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
    },
  },
  {
    path: 'event/edit-event/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
    },
  },
  {
    path: 'orgernizers/detail/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       const ids = routesIDs;
       return ids.map(id => ({ id }));
    },
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];


import { RenderMode, ServerRoute } from "@angular/ssr";
import { routesIDs } from "./shared/mocks/routes-ids";

export const serverRoutes: ServerRoute[] = [
  {
    path: "settings/supplier-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "settings/purchase-order-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "settings/stock-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "patients/patient-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "orders/order-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "invoices/invoice-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "payments/payment-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "c-invoices/c-invoice-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "settings/user-detail/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "settings/branch-details/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  // no need
  {
    path: "tickets/new-tickets/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "tickets/booked-events/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "event/detail/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "event/event-stats/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "event/edit-event/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },
  {
    path: "orgernizers/detail/:id",
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const ids = routesIDs;
      return ids.map((id) => ({ id }));
    },
  },

  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];

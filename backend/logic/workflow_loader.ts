// backend/logic/workflow_loader.ts

import { WORKFLOWS_MACAPA, WorkflowProducto } from "./workflow_catalog";

export class WorkflowLoader {

  static obtenerWorkflow(producto: string): WorkflowProducto {
    const wf = WORKFLOWS_MACAPA.find(w => w.producto === producto);

    if (!wf) {
      throw new Error(`No existe workflow para el producto: ${producto}`);
    }

    return wf;
  }
}

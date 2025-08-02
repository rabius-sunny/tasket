import { Hono } from 'hono';
import { ChecklistController } from '../controllers/checklistController';
import { ChecklistItemController } from '../controllers/checklistItemController';
import { authenticate } from '../middlewares/auth';
const checklistRouter = new Hono();

checklistRouter.use(authenticate);
const checklistController = new ChecklistController();
const checklistItemController = new ChecklistItemController();

checklistRouter.get('/', async (c) => checklistController.getChecklists(c));
checklistRouter.post('/', async (c) => checklistController.createChecklist(c));
checklistRouter.put('/', async (c) => checklistController.updateChecklist(c));
checklistRouter.delete('/', async (c) =>
  checklistController.deleteChecklist(c)
);

// Checklist item routes
checklistRouter.get('/items', async (c) =>
  checklistItemController.getChecklistItems(c)
);
checklistRouter.post('/items', async (c) =>
  checklistItemController.createChecklistItem(c)
);
checklistRouter.put('/items', async (c) =>
  checklistItemController.updateChecklistItem(c)
);
checklistRouter.delete('/items', async (c) =>
  checklistItemController.deleteChecklistItem(c)
);

export default checklistRouter;

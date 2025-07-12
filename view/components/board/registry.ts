'use client';

type RegistryMap = Map<
  string,
  { element: HTMLElement; actionMenuTrigger?: HTMLElement }
>;

export function createRegistry() {
  const tasks: RegistryMap = new Map();
  const columns: RegistryMap = new Map();

  function registerTask(args: {
    taskId: string;
    entry: { element: HTMLElement; actionMenuTrigger: HTMLElement };
  }) {
    tasks.set(args.taskId, args.entry);

    return function cleanup() {
      tasks.delete(args.taskId);
    };
  }

  function registerColumn(args: {
    columnId: string;
    entry: { element: HTMLElement };
  }) {
    columns.set(args.columnId, args.entry);

    return function cleanup() {
      columns.delete(args.columnId);
    };
  }

  function getTask(taskId: string) {
    const task = tasks.get(taskId);
    if (!task) {
      throw new Error(`Cannot find task with id: ${taskId}`);
    }
    return task;
  }

  function getColumn(columnId: string) {
    const column = columns.get(columnId);
    if (!column) {
      throw new Error(`Cannot find column with id: ${columnId}`);
    }
    return column;
  }

  return {
    registerTask,
    registerColumn,
    getTask,
    getColumn
  };
}

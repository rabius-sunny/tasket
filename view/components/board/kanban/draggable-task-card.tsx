'use client';

import {
  forwardRef,
  Fragment,
  memo,
  type Ref,
  useEffect,
  useRef,
  useState
} from 'react';

import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { token } from '@atlaskit/tokens';

import { Task } from '@/types';
import { TaskCard } from '../../task/task-components';
import { useBoardContext } from './board-context';

type State =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect }
  | { type: 'dragging' };

const idleState: State = { type: 'idle' };
const draggingState: State = { type: 'dragging' };

type DraggableTaskCardProps = {
  closestEdge: Edge | null;
  task: Task;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

const DraggableTaskCardPrimitive = forwardRef<
  HTMLDivElement,
  DraggableTaskCardProps
>(function DraggableTaskCardPrimitive(
  { closestEdge, task, state, actionMenuTriggerRef, onEdit, onDelete },
  ref
) {
  return (
    <div
      ref={ref}
      data-testid={`task-${task.id}`}
      style={{
        position: 'relative',
        opacity: state.type === 'dragging' ? 0.4 : 1,
        cursor: state.type === 'idle' ? 'grab' : 'grabbing'
      }}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />

      {/* Drop indicators */}
      {closestEdge === 'top' && (
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <DropIndicator
            edge='top'
            gap={token('space.100', '8px')}
          />
        </div>
      )}
      {closestEdge === 'bottom' && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <DropIndicator
            edge='bottom'
            gap={token('space.100', '8px')}
          />
        </div>
      )}
    </div>
  );
});

export const DraggableTaskCard = memo(function DraggableTaskCard({
  task,
  onEdit,
  onDelete
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const taskId = task.id.toString();
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { instanceId, registerTask } = useBoardContext();

  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerTask({
      taskId,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current
      }
    });
  }, [registerTask, taskId]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element: element,
        getInitialData: () => ({
          type: 'task',
          taskId,
          task,
          instanceId
        }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input
            }),
            render({ container }) {
              setState({ type: 'preview', container, rect });
              return () => setState(draggingState);
            }
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState)
      }),
      dropTargetForExternal({
        element: element
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === 'task'
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: 'task', taskId };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom']
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.taskId !== taskId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.taskId !== taskId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        }
      })
    );
  }, [instanceId, task, taskId]);

  return (
    <Fragment>
      <DraggableTaskCardPrimitive
        ref={ref}
        task={task}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {state.type === 'preview' &&
        ReactDOM.createPortal(
          <div
            style={{
              boxSizing: 'border-box',
              width: state.rect.width,
              height: state.rect.height
            }}
          >
            <DraggableTaskCardPrimitive
              task={task}
              state={state}
              closestEdge={null}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>,
          state.container
        )}
    </Fragment>
  );
});

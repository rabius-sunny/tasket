'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
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

import Heading from '@atlaskit/heading';
// This is the smaller MoreIcon soon to be more easily accessible with the
// ongoing icon project
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
import { Box, Grid, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { MoreHorizontalIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useBoardContext } from './board-context';
const Avatar = dynamic(() => import('../ui/avatar').then((mod) => mod.Avatar), {
  ssr: false
});

type State =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect }
  | { type: 'dragging' };

const idleState: State = { type: 'idle' };
const draggingState: State = { type: 'dragging' };

const noMarginStyles = xcss({ margin: 'space.0' });
const noPointerEventsStyles = xcss({ pointerEvents: 'none' });
const baseStyles = xcss({
  width: '100%',
  padding: 'space.100',
  backgroundColor: 'elevation.surface',
  borderRadius: 'border.radius.200',
  position: 'relative',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered'
  }
});

const stateStyles: {
  [Key in State['type']]: ReturnType<typeof xcss> | undefined;
} = {
  idle: xcss({
    cursor: 'grab',
    boxShadow: 'elevation.shadow.raised'
  }),
  dragging: xcss({
    opacity: 0.4,
    boxShadow: 'elevation.shadow.raised'
  }),
  // no shadow for preview - the platform will add it's own drop shadow
  preview: undefined
};

const buttonColumnStyles = xcss({
  alignSelf: 'start'
});

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: any;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive(
    { closestEdge, item, state, actionMenuTriggerRef },
    ref
  ) {
    const { avatarUrl, name, role, userId } = item;

    return (
      <Grid
        ref={ref}
        testId={`item-${userId}`}
        templateColumns='auto 1fr auto'
        columnGap='space.100'
        alignItems='center'
        xcss={[baseStyles, stateStyles[state.type]]}
      >
        <Box
          as='span'
          xcss={noPointerEventsStyles}
        >
          <Avatar
            fallback='A'
            src={avatarUrl}
          />
        </Box>

        <Stack
          space='space.050'
          grow='fill'
        >
          <Heading
            size='xsmall'
            as='span'
          >
            {name}
          </Heading>
          <Box
            as='small'
            xcss={noMarginStyles}
          >
            {role}
          </Box>
        </Stack>
        <Box xcss={buttonColumnStyles}>
          <button
            ref={actionMenuTriggerRef}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label='More options'
          >
            <MoreHorizontalIcon />
          </button>
        </Box>
        {/* DropIndicator should be absolutely positioned at top or bottom */}
        {closestEdge === 'top' && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1
            }}
          >
            <DropIndicator
              edge='top'
              gap={token('space.100', '0')}
            />
          </Box>
        )}
        {closestEdge === 'bottom' && (
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1
            }}
          >
            <DropIndicator
              edge='bottom'
              gap={token('space.100', '0')}
            />
          </Box>
        )}
      </Grid>
    );
  }
);

export const Card = memo(function Card({ item }: { item: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { userId } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerCard({
      cardId: userId,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current
      }
    });
  }, [registerCard, userId]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: 'card', itemId: userId, instanceId }),
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
            source.data.instanceId === instanceId && source.data.type === 'card'
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: 'card', itemId: userId };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom']
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== userId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== userId) {
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
  }, [instanceId, item, userId]);

  return (
    <Fragment>
      <CardPrimitive
        ref={ref}
        item={item}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === 'preview' &&
        ReactDOM.createPortal(
          <Box
            style={{
              /**
               * Ensuring the preview has the same dimensions as the original.
               *
               * Using `border-box` sizing here is not necessary in this
               * specific example, but it is safer to include generally.
               */
              boxSizing: 'border-box',
              width: state.rect.width,
              height: state.rect.height
            }}
          >
            <CardPrimitive
              item={item}
              state={state}
              closestEdge={null}
            />
          </Box>,
          state.container
        )}
    </Fragment>
  );
});

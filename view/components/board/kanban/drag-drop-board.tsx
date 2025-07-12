'use client';

import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { forwardRef, memo, type ReactNode, useEffect } from 'react';
import { useBoardContext } from './board-context';

type DragDropBoardProps = {
  children: ReactNode;
};

const DragDropBoard = forwardRef<HTMLDivElement, DragDropBoardProps>(
  ({ children }: DragDropBoardProps, ref) => {
    const { instanceId } = useBoardContext();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId
      });
    }, [instanceId]);

    return (
      <div
        ref={ref}
        className='flex gap-6 p-6 bg-red-300'
      >
        {children}
      </div>
    );
  }
);

DragDropBoard.displayName = 'DragDropBoard';

export default memo(DragDropBoard);

import { JSX, Show, createSignal } from 'solid-js';

interface CardProps {
  children: JSX.Element;
  class?: string;
  padding?: boolean;
  shadow?: boolean;
}

export function Card(props: CardProps) {
  const padding = props.padding !== false;
  const shadow = props.shadow !== false;

  return (
    <div
      class={`bg-white rounded-lg border border-gray-200 ${
        shadow ? 'shadow-sm' : ''
      } ${padding ? 'p-6' : ''} ${props.class || ''}`}
    >
      {props.children}
    </div>
  );
}

interface CardHeaderProps {
  children: JSX.Element;
  class?: string;
}

export function CardHeader(props: CardHeaderProps) {
  return <div class={`mb-4 ${props.class || ''}`}>{props.children}</div>;
}

interface CardTitleProps {
  children: JSX.Element;
  class?: string;
}

export function CardTitle(props: CardTitleProps) {
  return (
    <h3 class={`text-lg font-semibold text-gray-900 ${props.class || ''}`}>
      {props.children}
    </h3>
  );
}

interface CardContentProps {
  children: JSX.Element;
  class?: string;
}

export function CardContent(props: CardContentProps) {
  return <div class={`${props.class || ''}`}>{props.children}</div>;
}

interface CardFooterProps {
  children: JSX.Element;
  class?: string;
}

export function CardFooter(props: CardFooterProps) {
  return (
    <div class={`mt-6 pt-4 border-t border-gray-200 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}

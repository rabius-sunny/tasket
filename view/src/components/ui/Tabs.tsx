import { JSX, createSignal } from 'solid-js';

interface TabsProps {
  children: JSX.Element;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  class?: string;
}

export function Tabs(props: TabsProps) {
  const [activeTab, setActiveTab] = createSignal(props.defaultValue || '');

  const currentValue = () => props.value ?? activeTab();

  const handleChange = (value: string) => {
    setActiveTab(value);
    props.onValueChange?.(value);
  };

  return (
    <div
      class={`w-full ${props.class || ''}`}
      data-active-tab={currentValue()}
    >
      {props.children}
    </div>
  );
}

interface TabsListProps {
  children: JSX.Element;
  class?: string;
}

export function TabsList(props: TabsListProps) {
  return (
    <div
      class={`flex space-x-1 border-b border-gray-200 ${props.class || ''}`}
      role='tablist'
    >
      {props.children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: JSX.Element;
  class?: string;
}

export function TabsTrigger(props: TabsTriggerProps) {
  return (
    <button
      class={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent transition-colors ${
        props.class || ''
      }`}
      role='tab'
      data-value={props.value}
    >
      {props.children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: JSX.Element;
  class?: string;
}

export function TabsContent(props: TabsContentProps) {
  return (
    <div
      class={`mt-4 ${props.class || ''}`}
      role='tabpanel'
      data-value={props.value}
    >
      {props.children}
    </div>
  );
}

const pkg = [
  'tiny-invariant',
  '@atlaskit/pragmatic-drag-and-drop',
  '@atlaskit/pragmatic-drag-and-drop-flourish',
  '@atlaskit/pragmatic-drag-and-drop-hitbox',
  '@atlaskit/pragmatic-drag-and-drop-live-region',
  '@atlaskit/pragmatic-drag-and-drop-auto-scroll',
  '@atlaskit/primitives',
  '@atlaskit/heading',
  '@atlaskit/icon',
  '@atlaskit/motion',
  '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator',
  '@atlaskit/tokens',
  '@atlaskit/app-provider'
];

export type Person = {
  userId: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type ColumnType = {
  title: string;
  columnId: string;
  items: Person[];
};
export type ColumnMap = { [columnId: string]: ColumnType };
export const peoples: Person[] = [
  {
    userId: 'u001',
    name: 'Alice Johnson',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    userId: 'u002',
    name: 'Bob Smith',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    userId: 'u003',
    name: 'Carol Lee',
    role: 'Product Manager',
    avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    userId: 'u004',
    name: 'David Kim',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    userId: 'u005',
    name: 'Eva Brown',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    userId: 'u006',
    name: 'Frank Wilson',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg'
  },
  {
    userId: 'u007',
    name: 'Grace Miller',
    role: 'Product Owner',
    avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg'
  },
  {
    userId: 'u008',
    name: 'Henry Clark',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    userId: 'u009',
    name: 'Ivy Lewis',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/9.jpg'
  },
  {
    userId: 'u010',
    name: 'Jack Walker',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  {
    userId: 'u011',
    name: 'Kathy Hall',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/11.jpg'
  },
  {
    userId: 'u012',
    name: 'Leo Young',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg'
  },
  {
    userId: 'u013',
    name: 'Mona King',
    role: 'Product Manager',
    avatarUrl: 'https://randomuser.me/api/portraits/women/13.jpg'
  },
  {
    userId: 'u014',
    name: 'Nate Wright',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/14.jpg'
  },
  {
    userId: 'u015',
    name: 'Olivia Scott',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/15.jpg'
  },
  {
    userId: 'u016',
    name: 'Paul Green',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/16.jpg'
  },
  {
    userId: 'u017',
    name: 'Quinn Adams',
    role: 'Product Owner',
    avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg'
  },
  {
    userId: 'u018',
    name: 'Ryan Baker',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/18.jpg'
  },
  {
    userId: 'u019',
    name: 'Sophie Nelson',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg'
  },
  {
    userId: 'u020',
    name: 'Tom Perez',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/20.jpg'
  },
  {
    userId: 'u021',
    name: 'Uma Roberts',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/21.jpg'
  },
  {
    userId: 'u022',
    name: 'Victor Evans',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    userId: 'u023',
    name: 'Wendy Turner',
    role: 'Product Manager',
    avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg'
  },
  {
    userId: 'u024',
    name: 'Xander Harris',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/24.jpg'
  },
  {
    userId: 'u025',
    name: 'Yara Campbell',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/25.jpg'
  },
  {
    userId: 'u026',
    name: 'Zane Mitchell',
    role: 'Designer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/26.jpg'
  },
  {
    userId: 'u027',
    name: 'Abby Parker',
    role: 'Product Owner',
    avatarUrl: 'https://randomuser.me/api/portraits/women/27.jpg'
  },
  {
    userId: 'u028',
    name: 'Ben Foster',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/28.jpg'
  },
  {
    userId: 'u029',
    name: 'Clara Simmons',
    role: 'QA Engineer',
    avatarUrl: 'https://randomuser.me/api/portraits/women/29.jpg'
  },
  {
    userId: 'u030',
    name: 'Dylan Reed',
    role: 'Developer',
    avatarUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
  }
];

export function getBasicData() {
  const columnMap: ColumnMap = {
    confluence: {
      title: 'Confluence',
      columnId: 'confluence',
      items: peoples.slice(0, 10)
    },
    jira: {
      title: 'Jira',
      columnId: 'jira',
      items: peoples.slice(10, 20)
    },
    trello: {
      title: 'Trello',
      columnId: 'trello',
      items: peoples.slice(20, 30)
    }
  };

  const orderedColumnIds = ['confluence', 'jira', 'trello'];

  return {
    columnMap,
    orderedColumnIds
  };
}

export interface NavigationItem {
  id: string | number;
  name?: string;
  icon: string;
  svgIcon?: string;
  title?: string;
  type?: 'basic' | 'collapsable';
  link?: string;
  unfolded?: boolean;
  children?: NavigationItem[];
  data?: any[];
  disabled?: boolean;
  externalLink?: boolean;
  hidden?: (item: NavigationItem) => boolean;
}

export interface NavigationGroups {
  label: string;
  items: NavigationItem[];
}

export type NavigationType = 'main' | 'sortly';

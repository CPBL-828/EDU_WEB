export interface defaultInterface {
  KEY: string;
  VALUE: string;
}

export interface categoryInterface {
  KEY: string;
  VALUE: string | categoryInterface[];
  ICON?: string;
  HAS_CHILD?: boolean;
}

export interface userInterface {}

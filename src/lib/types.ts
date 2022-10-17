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

export interface teacherInterface {
  createDate: string;
  editDate: string;
  id: string;
  joinDate: string;
  leaveDate: string;
  name: string;
  part: string;
  profileImg: string;
  resSubject: string;
  resume: string;
  teacherKey: string;
  userKey: string;
}

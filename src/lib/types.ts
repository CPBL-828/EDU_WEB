export interface defaultInterface {
  KEY: string;
  VALUE: string | defaultInterface[];
}

export interface categoryInterface {
  KEY: string;
  VALUE: string | categoryInterface[];
  ICON?: string;
  HAS_CHILD?: boolean;
}

export interface studentInterface {
  studentKey: string;
  name: string;
  id: string;
  birth: string;
  sex: string;
  phone: string;
  school: string;
  grade: string;
  address: string;
  remark: string;
  delState: string;
  profileImg: string;
  createDate: string;
  editDate: string;
}

export interface parentInterface {
  parentKey: string;
  id: string;
  name: string;
  phone: string;
  createDate: string;
  editDate: string;
  studentKey: string;
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
  phone: string;
}

export interface adminInterface {
  adminKey: string;
  type: string;
  id: string;
  createDate: string;
  editDate: string;
}

export interface noticeInterface {
  noticeKey: string;
  type: string;
  writerKey: string;
  readerKey: string;
  delState: string;
  title: string;
  content: string;
  createDate: string;
  editDate: string;
}

export interface suggestInterface {
  suggestKey: string;
  writerKey: string;
  type: string;
  state: string;
  content: string;
  createDate: string;
  editDate: string;
  adminKey: string;
}

export interface scheduleInterface {
  adminKey_id: string;
  book: string;
  createDate: string;
  day: number;
  duration: number;
  editDate: string;
  lectureKey: string;
  name: string;
  progress: string;
  reason: string;
  roomKey_id: string;
  startTime: string;
  subject: string;
  target: string;
  teacherKey_id: string;
  type: string;
  start: number;
  minute: number;
}

export interface consultInterface {
  consultKey: string;
  consultType: string;
  consultDate: string;
  targetKey: string;
  content: string;
  studentKey_id: string;
  createDate: string;
  editDate: string;
}

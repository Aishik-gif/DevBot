export enum StepType {
  ProjectName,
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export interface Parts {
  text: string
}

export interface Chat {
  role: "user" | "model";
  parts: Parts[]
}

export interface Step {
  id: number;
  title: string;
  language: string;
  type: StepType;
  status: 'pending' | 'in-progress' | 'completed';
  code?: string;
  path?: string;
}

export interface Project {
  prompt: string;
  steps: Step[];
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  language?: string
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}
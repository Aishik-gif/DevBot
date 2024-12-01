import { Step, StepType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseXml(response: string): Step[] {
  const xmlMatch = response.match(
    /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/
  );

  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : "Project Files";

  steps.push({
    id: stepId++,
    title: artifactTitle,
    language: "",
    type: StepType.ProjectName,
    status: "pending",
  });

  // const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
  const actionRegex =
    /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>\s*(?:```([\s\S]*?)\n)?([\s\S]*?)(?:```)?\s*<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, lang, content] = match;
    const code = content.split('\n').map(line => line.replace(/\n    /, '\n')).join('\n');
    if (type === "file") {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || "file"}`,
        language: (lang !== 'tsx' && lang !== 'jsx')? lang : "typescript",
        type: StepType.CreateFile,
        status: "pending",
        code: code,
        path: filePath,
      });
    } else if (type === "shell") {
      steps.push({
        id: stepId++,
        title: `Run command ${code}`,
        language: "bash",
        type: StepType.RunScript,
        status: "pending",
        code: code,
      });
    }
  }

  return steps;
}

export function parsePrompt(response: string): Step[] {
  const xmlMatch = response.match(
    /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/
  );

  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : "Project Files";

  steps.push({
    id: stepId++,
    title: artifactTitle,
    language: "",
    type: StepType.ProjectName,
    status: "pending",
  });

  const actionRegex =
    /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;
  // const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>```([\s\S]*?)\n([\s\S]*?)```<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    const extRegex = /([\w]+)$/g;
    let lang = 'typescript';
    const extMatch = extRegex.exec(filePath);
    if(extMatch && (extMatch[1] === 'tsx' || extMatch[1] === 'ts' || extMatch[1] === 'js' || extMatch[1] === 'jsx')) lang = 'typescript'
    else if(extMatch) lang = extMatch[1]
    if (type === "file") {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || "file"}`,
        language: lang,
        type: StepType.CreateFile,
        status: "pending",
        code: content.trim(),
        path: filePath,
      });
    } else if (type === "shell") {
      steps.push({
        id: stepId++,
        title: "Run command",
        language: "bash",
        type: StepType.RunScript,
        status: "pending",
        code: content.trim(),
      });
    }
  }

  return steps;
}

"use client";

import { useContext, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/CodeEditor";
import { Preview } from "@/components/Preview";
import { useSearchParams } from "next/navigation";
import { Chat, FileItem, Step, StepType } from "@/types";
import { FileExplorer } from "@/components/FileExplorer";
import { parsePrompt, parseXml } from "@/lib/utils";
import { SidebarSteps } from "@/components/SideBarSteps";
import axios from "axios";
import { BASE_API_URL } from "@/config";
import { useWebContainer } from "@/hooks/useWebContainer";
import { WebContainerContext } from "@/providers";

export default function EditorPage() {
  const prompt = useSearchParams().get("prompt");
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [templateSet, setTemplateSet] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [llmMessages, setLlmMessages] = useState<Chat[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState<string | undefined>("");

  const webcontainer = useContext(WebContainerContext);

  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          const finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              const file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                  language: step.language,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              const folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        } else if (step.type === StepType.RunScript) {
          setCommand(step.code);
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]) => {
      const mountStructure: { [key: string]: any } = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      files.forEach((file) => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    if (!prompt) {
      setError("No prompt provided");
      return;
    }
    setLoading(true);
    const templateResponse = await axios.post(
      `${BASE_API_URL}/template`,
      { prompt: prompt.trim() },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (templateResponse) setTemplateSet(true);

    const { prompts, uiPrompts } = templateResponse.data;

    setSteps(
      parsePrompt(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending" as const,
      }))
    );

    const stepsResponse = await axios.post(
      `${BASE_API_URL}/chat`,
      { prompts: prompts },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setLoading(false);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x: Step) => ({
        ...x,
        status: "pending" as const,
      })),
    ]);

    setLlmMessages((x) => [
      ...x,
      ...[...prompts, prompt].map((content) => ({
        role: "user" as const,
        parts: [
          {
            text: content,
          },
        ],
      })),
      {
        role: "model" as const,
        parts: [
          {
            text: stepsResponse.data.response,
          },
        ],
      },
    ]);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <SidebarSteps steps={steps} />
      <div className="flex max-w-full w-full h-full">
        <div className="realtive flex flex-col w-full h-full">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "code" | "preview")}
            className="flex px-5 items-center w-fit h-[9%]"
          >
            <TabsList className="w-full justify-start border-b px-4 py-2">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === "code" ? (
            <div className="flex max-w-full p-3 pt-1 gap-2 flex-1 h-[91%]">
              <div className="h-full w-72">
                <FileExplorer files={files} onFileSelect={setSelectedFile} />
              </div>
              <div className="flex justify-center items-center w-[calc(100svw-50svw)] mx-auto rounded-lg overflow-hidden">
                <CodeEditor file={selectedFile} />
              </div>
            </div>
          ) : (
            <>
              {command && webcontainer ? (
                <Preview command={command} webContainer={webcontainer} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 p-5">
                  <div className="text-center">
                    <p className="mb-2">Loading...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

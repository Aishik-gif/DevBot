"use client";

import { Check, FileCode, Layout, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Step, StepType } from "@/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Dispatch, SetStateAction, useRef, useState } from "react";

// const steps: Step[] = [
//   {
//     id: 1,
//     title: 'Generate Code',
//     description: 'Description for Generate Code',
//     type: StepType.ProjectName,
//     status: 'completed',
//   },
//   {
//     id: 2,
//     title: 'Structure Layout',
//     description: 'Description for Structure Layout',
//     type: StepType.CreateFile,
//     status: 'pending',
//   },
//   {
//     id: 3,
//     title: 'Add Components',
//     description: 'Description for Add Components',
//     type: StepType.CreateFolder,
//     status: 'pending',
//   },
//   {
//     id: 4,
//     title: 'Configure Settings',
//     description: 'Description for Configure Settings',
//     type: StepType.RunScript,
//     status: 'pending',
//   },
// ]

export function SidebarSteps({
  steps,
  className,
  setPrompt,
  handleClick,
}: {
  steps: Step[];
  className?: string;
  setPrompt: Dispatch<SetStateAction<string | null>>;
  handleClick: () => Promise<void>;
}) {
  const getIcon = (type: StepType) => {
    switch (type) {
      case StepType.ProjectName:
        return FileCode;
      case StepType.CreateFile:
        return Layout;
      case StepType.CreateFolder:
        return Package;
      case StepType.RunScript:
        return Settings;
      default:
        return FileCode;
    }
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [disabled, setDisabled] = useState(false);

  return (
    <Sidebar variant="inset" className={cn(className)}>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Build Steps</h2>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {steps.map((step, index) => {
                  const Icon = getIcon(step.type);
                  return (
                    <SidebarMenuItem className="w-full py-1" key={index}>
                      <SidebarMenuButton
                        className={cn(
                          "flex items-center gap-3 w-full break-all py-1 text-ellipsis",
                          step.status === "completed" && "text-green-500"
                        )}
                      >
                        {step.status === "completed" ? (
                          <Check size={18} />
                        ) : (
                          <Icon size={18} />
                        )}
                        {step.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Chat with DevBot..."
            className="resize-none"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button
            disabled={disabled}
            type="submit"
            onClick={async () => {
              setDisabled(true);
              await handleClick();
              if (inputRef.current) {
                inputRef.current.value = "";
              }
              setDisabled(false);
            }}
          >
            {disabled ? "Generating..." : "Submit"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

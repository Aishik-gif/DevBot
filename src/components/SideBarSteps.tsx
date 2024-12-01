'use client'

import { Check, FileCode, Layout, Package, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Step, StepType } from "@/types" 

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

export function SidebarSteps({steps}: {steps: Step[]}) {
  const getIcon = (type: StepType) => {
    switch (type) {
      case StepType.ProjectName:
        return FileCode
      case StepType.CreateFile:
        return Layout
      case StepType.CreateFolder:
        return Package
      case StepType.RunScript:
        return Settings
      default:
        return FileCode
    }
  }

  return (
    <Sidebar variant='inset' 
      className='min-h-0 h-[calc(100%-4rem)] mt-[4rem]'
    >
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">Build Steps</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {steps.map((step, index) => {
                const Icon = getIcon(step.type)
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton className={cn(
                      "flex items-center gap-3 w-full",
                      step.status === 'completed' && "text-green-500"
                    )}>
                      {step.status === 'completed' ? <Check size={18} /> : <Icon size={18} />}
                      <span>{step.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}


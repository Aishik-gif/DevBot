import React, { useState } from "react";
import { File, Files, FolderClosed, FolderOpen } from "lucide-react";
import { FileItem } from "../types";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleClick = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-[0.2rem] hover:bg-zinc-700 rounded-md cursor-pointer"
        style={{ paddingLeft: `${depth * 0.8 + 0.45}rem` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <span className="text-blue-400">
            {isExpanded ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <FolderClosed className="w-4 h-4" />
            )}
          </span>
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="text-gray-200">{item.name}</span>
      </div>
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <ScrollArea className="bg-zinc-800 rounded shadow-lg p-4 h-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 pl-1 text-gray-100">
        <Files className="w-5 h-5" />
        File Explorer
      </h2>
      <div className="space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

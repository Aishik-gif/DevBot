"use client";
import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

interface PreviewFrameProps {
  command: string;
  webContainer: WebContainer;
}

export function Preview({ command, webContainer }: PreviewFrameProps) {
  // In a real implementation, this would compile and render the preview
  const [url, setUrl] = useState("");

  async function installDependencies() {
    const installProcess = await webContainer.spawn("npm", ["install"]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    return installProcess.exit;
  }

  async function main() {
    if (!webContainer) return;
    const installExitCode = await installDependencies();
    if (installExitCode) return;

    const commands = command.split(" ");
    const runp = await webContainer.spawn(commands[0], [...commands.slice(1)]);

    runp.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    webContainer.on("server-ready", (port, url) => {
      // ...
      console.log(url);
      console.log(port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-gray-400 p-5">
      {!url && (
        <div className="text-center">
          <Loader />
        </div>
      )}
      {url && (
        <iframe
          width={"100%"}
          height={"100%"}
          src={url}
          className="rounded bg-white"
        />
      )}
    </div>
  );
}

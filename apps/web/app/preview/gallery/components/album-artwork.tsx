"use client";

import Image from "next/image";
import { CheckCircle2, TerminalSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Album } from "../data/schema";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { outPutSrtStop } from "../../tasks/api/osrt";
import { StartModal } from "@/components/Modal/StartModal";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Terminal } from "@/components/Terminal";
import { useSWRConfig } from "swr";
import { PaginationState } from "@tanstack/react-table";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: Album;
  width?: number;
  height?: number;
  pagination: PaginationState;
}

export function AlbumArtwork({
  album,
  width,
  height,
  className,
  pagination,
  ...props
}: AlbumArtworkProps) {
  const [open, setOpen] = React.useState(false);

  const { mutate } = useSWRConfig();

  const reloadList = () => {
    mutate([
      `/api/gallery?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`,
    ]);
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md relative">
            {album.cover && (
              <Image
                src={album.cover}
                alt={album.name}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  "aspect-video"
                )}
              />
            )}
            <div className="absolute right-1 top-1 flex gap-2">
              {album.path && (
                <CheckCircle2 className="  opacity-80 rounded-full shadow-md text-green-600"></CheckCircle2>
              )}
              {album.processingJobId && (
                <HoverCard>
                  <HoverCardTrigger>
                    <TerminalSquare className=" opacity-80 rounded-full shadow-md text-gray-400"></TerminalSquare>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[36rem] p-0 border-none bg-transparent">
                    <Terminal jobId={album.processingJobId}></Terminal>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            {album.path ? "Restart" : "Start"}
          </ContextMenuItem>
          {album.processingJobId && (
            <ContextMenuItem
              onClick={async () => {
                await outPutSrtStop(album.processingJobId);
                toast({
                  title: "Stop all jobs success.",
                  description: "All tasks have been cleared.",
                });
              }}
            >
              Stop
            </ContextMenuItem>
          )}
          {album.path && (
            <ContextMenuItem
              onClick={() => {
                window.open(album.path);
              }}
            >
              Download
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <HoverCard openDelay={300}>
          <HoverCardTrigger>
            <h3 className="font-medium leading-none truncate cursor-default">
              {album.name}
            </h3>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm whitespace-break-spaces break-all">
              {album.name}
            </p>
          </HoverCardContent>
        </HoverCard>

        {/* <p className="text-xs text-muted-foreground">{album.artist}</p> */}

        <StartModal
          id={album.id + ""}
          open={open}
          onOpenChange={setOpen}
          continueCallback={reloadList}
        />
      </div>
    </div>
  );
}

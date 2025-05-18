"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

export default function StreamPage() {
  // Pull the [type] segment from the URL
  const params = useParams();
  const type = (params.type as string) || "eva1";
  
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = io("https://10.0.0.108:8282");
    let peer: Peer.Instance;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          previewRef.current.play();
        }

        peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (signal) => {
          socket.emit("signal", { type, data: signal });
        });

        socket.on("signal", (msg: any) => {
          if (msg.type === type) peer.signal(msg.data);
        });
      })
      .catch(console.error);

    return () => {
      peer?.destroy();
      socket.disconnect();
    };
  }, [type]);

  return (
    <div className="p-4">
      <h1 className="mb-2 text-lg font-bold">
        Publisher: {type.toUpperCase()}
      </h1>
      <video
        ref={previewRef}
        width={320}
        height={240}
        muted
        playsInline
        className="rounded shadow-lg bg-black"
      />
    </div>
  );
}

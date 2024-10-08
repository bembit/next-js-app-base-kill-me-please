'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function RoomStartPage({ params }: { params: { roomId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roomData, setRoomData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        if (!session) {
          router.push("/"); 
          return;
        }

        const response = await fetch(`/api/rooms/${params.roomId}`);
        if (response.ok) {
          const data = await response.json();
          setRoomData(data);
        } else {
          setError("Failed to fetch room data.");
        }
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [params.roomId, session, router]);

  if (status === "loading" || isLoading) {
    return <Loading />;
  } else if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-4xl shadow-md rounded-lg p-6 bg-slate-50 dark:bg-slate-800">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {roomData?.name} - started!
        </h1>

        <p>Room ID: {roomData?._id}</p>

        <h2>Participants:</h2>
        <ul>
          {roomData?.participants.map((participant) => (
            <li key={participant._id.toString()}>{participant.email}</li>
          ))}
        </ul>

        <h2>Side 1:</h2>
        <ul>
          {roomData?.side1.map((participant) => (
            <li key={participant._id.toString()}>{participant.email}</li>
          ))}
        </ul>

        <h2>Side 2:</h2>
        <ul>
          {roomData?.side2.map((participant) => (
            <li key={participant._id.toString()}>{participant.email}</li>
          ))}
          {roomData?.side2.length === 0 && (
            <p>Nobody on side 2</p>
          )}
        </ul>
      </div>
    </div>
  );
}
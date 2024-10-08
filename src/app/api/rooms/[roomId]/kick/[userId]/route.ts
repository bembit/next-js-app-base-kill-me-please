import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function POST(request: Request, { params }: { params: { roomId: string, userId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const room = await Room.findById(params.roomId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if the current user is the creator of the room
    if (room.creatorId.toString() !== session.user._id) {
      return new Response("Forbidden - Only the room creator can kick users", { status: 403 });
    }

    // Remove the specified user from all the arrays of the room
    room.participants.pull(params.userId);
    room.side1.pull(params.userId);
    room.side2.pull(params.userId);
    room.readyParticipants.filter((participant) => participant.userId.toString() !== params.userId);

    room.kickedUsers?.push(params.userId);

    await room.save();

    return NextResponse.json({ message: "User kicked successfully" });
  } catch (error) {
    console.error("Error kicking user:", error);
    return NextResponse.json(
      { error: "An error occurred while kicking the user" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import Room from "@/models/Room";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../../../auth/[...nextauth]/route";
// import mongoose from "mongoose";

// export async function POST(request: Request, { params }: { params: { roomId: string, userId: string } }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     await dbConnect();

//     const room = await Room.findById(params.roomId);

//     if (!room) {
//       return NextResponse.json({ error: "Room not found" }, { status: 404 });
//     }

//     // Check if the current user is the creator of the room
//     if (room.creatorId.toString() !== session.user._id) {
//       return new Response("Forbidden - Only the room creator can kick users", { status: 403 });
//     }

//     // Convert userId to mongoose ObjectId if it's not already
//     const userIdToKick = new mongoose.Types.ObjectId(params.userId);

//     // Remove the specified user from all the arrays of the room
//     room.participants.pull(userIdToKick);
//     room.side1.pull(userIdToKick);
//     room.side2.pull(userIdToKick);
//     room.readyParticipants = room.readyParticipants.filter(
//       (participant) => participant.userId.toString() !== userIdToKick.toString()
//     );

//     // Add the kicked user to the kickedUsers array
//     if (!room.kickedUsers.includes(userIdToKick)) {
//       room.kickedUsers.push(userIdToKick);
//     }

//     await room.save();

//     return NextResponse.json({ message: "User kicked successfully" });
//   } catch (error) {
//     console.error("Error kicking user:", error);
//     return NextResponse.json(
//       { error: "An error occurred while kicking the user" },
//       { status: 500 }
//     );
//   }
// }

// needs testing

// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/db";
// import Room from "@/models/Room";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../../../../auth/[...nextauth]/route";

// export async function POST(request: Request, { params }: { params: { roomId: string, userId: string } }) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     await dbConnect();

//     const room = await Room.findById(params.roomId);

//     if (!room) {
//       return NextResponse.json({ error: "Room not found" }, { status: 404 });
//     }

//     // Check if the room has started and block kicking if it has
//     if (room.isStarted) {
//       return NextResponse.json({ error: "Room has started, user cannot be kicked" }, { status: 403 });
//     }

//     // Check if the current user is the creator of the room
//     if (room.creatorId.toString() !== session.user._id) {
//       return new Response("Forbidden - Only the room creator can kick users", { status: 403 });
//     }

//     // Remove the specified user from all the arrays of the room
//     room.participants.pull(params.userId);
//     room.side1.pull(params.userId);
//     room.side2.pull(params.userId);
//     room.readyParticipants = room.readyParticipants.filter((participant) => participant.userId.toString() !== params.userId);

//     await room.save();

//     return NextResponse.json({ message: "User kicked successfully" });
//   } catch (error) {
//     console.error("Error kicking user:", error);
//     return NextResponse.json(
//       { error: "An error occurred while kicking the user" },
//       { status: 500 }
//     );
//   }
// }

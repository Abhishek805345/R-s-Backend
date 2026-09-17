import { getRoomSnapshot } from "../services/roomService.js";

export async function getRoom(req, res, next) {
  try {
    const { roomId } = req.params;

    res.json({
      ok: true,
      room: await getRoomSnapshot(roomId),
    });
  } catch (error) {
    next(error);
  }
}

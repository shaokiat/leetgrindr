// event types for socket.io

// from client
export const JOIN_ROOM_EVENT = "joinRoom";
export const CODE_MODIFIED_EVENT = "codeModified";
export const CODE_EXECUTED_EVENT = "codeExecuted";
export const CODE_SAVED_EVENT = "codeSaved";
export const DISCONNECT_ROOM_EVENT = "disconnectRoom";

// from server
export const INITIALSTATE = "initialState";
export const ROOM_CONNECTION = "roomConnection";

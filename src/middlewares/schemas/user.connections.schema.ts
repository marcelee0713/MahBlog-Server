import { z } from "zod";
import { SortOrderArr } from "../../types";
import { ConnectionStatusArr } from "../../types/user/user.connections.types";

export const createUserConnectionsSchema = z.object({
  body: z.object({
    targetUserId: z.string().trim(),
  }),
});

export const getUserTotalConnectionsSchema = z.object({
  body: z.object({
    searchNameInput: z.string().max(255).trim().optional(),
  }),
});

export const getUserTotalConnectionsCountSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
  }),
});

export const getUserPendingConnectionsSchema = z.object({
  body: z.object({
    dateOrder: z.enum(SortOrderArr),
  }),
});

export const onUpdateUserConnectionsSchema = z.object({
  body: z.object({
    connectionId: z.string().trim(),
    sourceUserId: z.string().trim(),
    status: z.enum(ConnectionStatusArr),
  }),
});

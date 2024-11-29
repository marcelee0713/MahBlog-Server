import { z } from "zod";
import { SortOrderArr } from "../../../ts/types";
import { ConnectionStatusArr } from "../../../ts/types/user/user.connections.types";

export const createUserConnectionsSchema = z.object({
  body: z.object({
    targetUserId: z.string().trim(),
  }),
});

export const getUserConnectionsSchema = z.object({
  body: z.object({
    searchNameInput: z.string().max(255).trim().optional(),
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
    dateOrder: z.enum(SortOrderArr),
  }),
});

export const getUserTotalConnectionsCountSchema = z.object({
  body: z.object({
    userId: z.string().trim(),
  }),
});

export const getUserPendingConnectionsSchema = z.object({
  body: z.object({
    pagination: z.object({
      skip: z.number(),
      take: z.number(),
    }),
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

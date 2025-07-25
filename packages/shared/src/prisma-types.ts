import { gameIncludes, SortOptions } from ".";
import { Prisma } from "../../server/generated/prisma";

export type Game = Prisma.GameGetPayload<{
  include: typeof gameIncludes;
}>;

export type GenresWithGames = Prisma.GenreGetPayload<{
  include: {
    games: true;
  };
}>;

export type User = Prisma.UserGetPayload<{
  include: {
    reviews: true;
    library: true;
  };
}>;

export type Library = Prisma.UserGameGetPayload<{
  include: {
    game: { include: typeof gameIncludes };
  };
}>[];

export type PlatformWithGames = Prisma.PlatformGetPayload<{
  include: {
    games: true;
  };
}>;

export const mappedSort: Record<
  SortOptions,
  Prisma.GameFindManyArgs["orderBy"]
> = {
  za: { title: "desc" },
  az: { title: "asc" },
  rel_date: { title: "desc" },
  rating: { rating: "desc" },
};

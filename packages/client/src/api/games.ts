import { safeFetch, type RouteError } from "@/utils";
import {
  filterStateSchema,
  type FilterState,
  type Game,
  type GenresWithGames,
  type Library,
  type PlatformWithGames,
} from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

const getAllGames = (filters?: Partial<FilterState>) =>
  queryOptions({
    queryKey: ["game", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      const parsed = filterStateSchema.parse(filters ?? {});
      parsed.genres.forEach((g) => params.append("genre", g));
      parsed.platforms.forEach((p) => params.append("platform", p));
      params.set("sort", parsed.sort);
      params.set("page", parsed.page.toString());
      return safeFetch<{ games: Game[]; total: number }>(
        `games?${params.toString()}`,
        {},
      );
    },
  });

const getGameById = (id: string) =>
  queryOptions({
    queryKey: ["game", id],
    queryFn: () => safeFetch<Game>(`games/${id}`, {}),
  });

const getAllGenres = () =>
  queryOptions({
    queryKey: ["genre"],
    queryFn: () => safeFetch<GenresWithGames[]>("genres", {}),
  });

const getAllPlatforms = () =>
  queryOptions({
    queryKey: ["platform"],
    queryFn: () => safeFetch<PlatformWithGames[]>("platforms", {}),
  });

const getLibrary = () =>
  queryOptions({
    queryKey: ["library"],
    queryFn: () =>
      safeFetch<Library>("library", {
        credentials: "include",
      }),
    retry(failureCount, error: RouteError) {
      if (error.status === 401) return false;
      return failureCount < 3;
    },
  });

export { getAllGames, getGameById, getAllGenres, getLibrary, getAllPlatforms };

import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GameNews } from "@/components/game-news";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuthStore } from "@/store/auth";
import { getAllGames } from "@/api/games";
import { format } from "date-fns";
import HeartBtn from "@/components/heart-btn";
import useLibrary from "@/lib/hooks/use-library";
import AddToLibraryButton from "@/components/add-to-library-btn";
import HoverCard from "@/components/hover-card";
import useGames from "@/lib/hooks/use-games";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(getAllGames());
  },
});

function RouteComponent() {
  const user = useAuthStore((s) => s.user);
  const { games } = useGames();
  const featured = games[Math.floor(Math.random() * games.length)];
  const releaseDate = featured.releaseDate
    ? format(featured.releaseDate, "dd MMM yyyy")
    : "Unkown";

  const { isFavourite, isInLibrary } = useLibrary();

  return (
    <div className="flex flex-col gap-4 mt-4 mx-4 lg:mx-10 py-3 px-6">
      <Card className="order-1 w-[85%] mx-auto py-3 flex flex-col lg:flex-row">
        <CardHeader className="w-full lg:w-[45%]">
          <h3 className="text-2xl font-bold">Featured Game</h3>
          <img
            className="lg:h-auto lg:w-[16rem] rounded-md object-top-left flex-shrink-0"
            src={featured.coverImage?.url.replace("t_thumb", "t_original")}
            alt={featured.title}
          />
        </CardHeader>
        <CardContent className="lg:w-[85%] flex flex-col justify-between">
          <h3 className="text-xl font-semibold">{featured.title}</h3>
          <p className="text-sm my-2 text-muted-foreground line-clamp-4">
            {featured.summary}
          </p>
          <div className="flex flex-col gap-4 mt-2 flex-wrap">
            <h3 className="text-md text-muted-foreground">Genres</h3>
            <div className="flex flex-row gap-x-2 flex-wrap">
              {featured.genres.map((genre) => (
                <Badge
                  variant="outline"
                  className="text-foreground outline outline-primary"
                  key={genre.id}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 my-4 ">
            <h3 className="text-muted-foreground">Platforms </h3>
            <div className="flex flex-row gap-x-2 flex-wrap gap-y-2">
              {featured.platforms.map((platform) => (
                <Badge
                  variant="secondary"
                  className="bg-foreground text-muted"
                  key={platform.id}
                >
                  {platform.name}
                </Badge>
              ))}
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground">{releaseDate}</h3>
          <CardAction className="flex flex-row my-auto gap-4 ">
            <Button>
              <Link
                to="/discover/$gameId"
                params={{ gameId: `${featured.igdbId}` }}
              >
                Go to Game page
              </Link>
            </Button>
            {user && (
              <>
                <AddToLibraryButton
                  inLibrary={isInLibrary(featured)}
                  game={featured}
                />
                <HeartBtn
                  id={featured.igdbId}
                  isFavourite={isFavourite(featured)}
                />
              </>
            )}
          </CardAction>
        </CardContent>
      </Card>
      <GameNews className="order-3 row-start-2 " />
      <div className="order-2 border rounded-md bg-card py-2 px-8 h-full">
        <h3 className="text-2xl font-semibold">Popular games</h3>
        <Carousel className="mt-6 mx-6" opts={{ loop: true }}>
          <CarouselContent>
            {games.map((game) => (
              <CarouselItem key={game.igdbId} className="basis-1/5 ml-2">
                <HoverCard game={game}>
                  <span className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-lg font-semibold text-white">
                    {game.title}
                  </span>
                </HoverCard>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

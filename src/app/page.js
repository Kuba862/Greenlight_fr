"use client";

import { useState } from "react";
import { Clock3 } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import AppHeader from "@/components/layout/AppHeader";
import ThemeToggle from "@/components/UI/ThemeToggle";
import StopsSidebar from "@/components/stops/StopsSidebar";
import StopHeader from "@/components/stops/StopHeader";

import styles from "@/app/page.module.scss";

// Przykładowe dane do sprawdzenia interfejsu.
const DEMO_STOPS = [
  { id: "demo-bagatela", name: "Teatr Bagatela" },
  { id: "demo-mogilskie", name: "Rondo Mogilskie" },
  { id: "demo-dworzec", name: "Dworzec Główny" },
  { id: "demo-inwalidow", name: "Plac Inwalidów" },
  { id: "demo-poczta", name: "Poczta Główna" },
];

function normalizeSearch(value) {
  return value
    .trim()
    .toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
}

export default function HomePage() {
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [selectedStopId, setSelectedStopId] = useState(
    DEMO_STOPS[0].id,
  );
  const [favoriteStopIds, setFavoriteStopIds] = useState([]);

  const normalizedSearch = normalizeSearch(search);

  const filteredStops = DEMO_STOPS.filter((stop) =>
    normalizeSearch(stop.name).includes(normalizedSearch),
  ).map((stop) => ({
    ...stop,
    description: favoriteStopIds.includes(stop.id)
      ? "Zapisany przystanek"
      : "Przystanek tramwajowy",
  }));

  const selectedStop =
    DEMO_STOPS.find((stop) => stop.id === selectedStopId) ??
    DEMO_STOPS[0];

  const isSelectedStopFavorite = favoriteStopIds.includes(
    selectedStop.id,
  );

  function handleToggleFavorite() {
    const stopId = selectedStop.id;

    setFavoriteStopIds((currentIds) => {
      if (currentIds.includes(stopId)) {
        return currentIds.filter((id) => id !== stopId);
      }

      return [...currentIds, stopId];
    });
  }

  const header = (
    <AppHeader
      actions={
        <ThemeToggle
          theme={theme}
          onThemeChange={setTheme}
        />
      }
    />
  );

  const sidebar = (
    <StopsSidebar
      search={search}
      onSearchChange={setSearch}
      stops={filteredStops}
      selectedStopId={selectedStopId}
      onSelectStop={setSelectedStopId}
    />
  );

  return (
    <AppShell
      theme={theme}
      header={header}
      sidebar={sidebar}
    >
      <div className={styles.preview}>
        <span className={styles.demoBadge}>
          Dane przykładowe
        </span>

        <StopHeader
          name={selectedStop.name}
          isFavorite={isSelectedStopFavorite}
          onToggleFavorite={handleToggleFavorite}
        />

        <section
          className={styles.departuresPlaceholder}
          aria-labelledby="departures-heading"
        >
          <Clock3
            size={30}
            strokeWidth={1.5}
            aria-hidden="true"
          />

          <h2 id="departures-heading">
            Tablica odjazdów
          </h2>

          <p>
            Odjazdy nie są dostępne w tym podglądzie.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
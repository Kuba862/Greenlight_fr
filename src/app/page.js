"use client";

import { useState } from "react";
import { Clock3, TramFront } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import AppHeader from "@/components/layout/AppHeader";
import ThemeToggle from "@/components/UI/ThemeToggle";
import StopsSidebar from "@/components/stops/StopsSidebar";

import styles from "@/app/page.module.scss";

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

  const normalizedSearch = normalizeSearch(search);

  const filteredStops = DEMO_STOPS.filter((stop) =>
    normalizeSearch(stop.name).includes(normalizedSearch),
  );

  const selectedStop =
    DEMO_STOPS.find((stop) => stop.id === selectedStopId) ??
    DEMO_STOPS[0];

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

        <div
          className={styles.selectedStop}
          aria-live="polite"
        >
          <p className={styles.stopType}>
            <TramFront
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
            />

            <span>Przystanek tramwajowy</span>
          </p>

          <h1>{selectedStop.name}</h1>

          <p className={styles.location}>Kraków</p>
        </div>

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
"use client";

import { useState } from "react";
import { Clock3, TramFront } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import AppHeader from "@/components/layout/AppHeader";
import ThemeToggle from "@/components/UI/ThemeToggle";
import StopSearch from "@/components/stops/StopSearch";
import StopListItem from "@/components/stops/StopListItem";

import styles from "./page.module.scss";

const DUMB_STOPS = [
  { id: "bagatela", name: "Teatr Bagatela" },
  { id: "mogilskie", name: "Rondo Mogilskie" },
  { id: "dworzec", name: "Dworzec Główny" },
  { id: "inwalidow", name: "Plac Inwalidów" },
  { id: "poczta", name: "Poczta Główna" }
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
  const [selectedStopId, setSelectedStopId] = useState(DUMB_STOPS[0].id);

  const normalizedSearch = normalizeSearch(search);

  const filteredStops = DUMB_STOPS.filter((stop) => normalizeSearch(stop.name).includes(normalizedSearch),);

  const selectedStop =
    DUMB_STOPS.find((stop) => stop.id === selectedStopId) ??
    DUMB_STOPS[0];

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
    <div className={styles.sidebarContent}>
      <div className={styles.sidebarHeading}>
        <p className={styles.eyebrow}>Dobrze być w drodze</p>
        <h1>Gdzie wsiadasz?</h1>
      </div>

      <StopSearch value={search} onChange={setSearch} />

      <p className={styles.resultCount} role="status">Znalezione przystanki: {filteredStops.length}</p>

      {filteredStops.length > 0 ? (
        <ul className={styles.stopList} aria-label="Przystanki">
          {filteredStops.map((stop) => (
            <li key={stop.id}>
            <StopListItem name={stop.name} description="Przystanek tramwajowy" isSelected={selectedStopId === stop.id} onSelect={() => setSelectedStopId(stop.id)} />
            </li>
          ))}
        </ul>  
      ): (
        <div className={styles.emptySearch}>
          <p>Nie znaleziono przystanku.</p>
          <span>Spróbuj wpisać inną nazwę.</span>
        </div>
      )}
    </div>
  );

  return (
    <AppShell theme={theme} header={header} sidebar={sidebar}>
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
  )
}
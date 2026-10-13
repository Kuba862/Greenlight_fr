"use client";

import { useEffect, useState } from "react";
import { Clock3, Route, Star } from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import AppHeader from "@/components/layout/AppHeader";
import AppNavigation from "@/components/layout/AppNavigation";
import ThemeToggle from "@/components/UI/ThemeToggle";
import StopSearch from "@/components/stops/StopSearch";
import StopList from "@/components/stops/StopList";

import { getLines } from "@/lib/api";
import styles from "@/app/page.module.scss";

const PAGE_SIZE = 20;

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
  const [activeView, setActiveView] = useState("lines");

  const [search, setSearch] = useState("");
  const [selectedStopId, setSelectedStopId] = useState(DEMO_STOPS[0].id);

  const [linesRequest, setLinesRequest] = useState({
    offset: 0,
  });

  const [linesResult, setLinesResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLines() {
      try {
        const data = await getLines({
          source: "T",
          limit: PAGE_SIZE,
          offset: linesRequest.offset,
          signal: controller.signal,
        });

        const hasValidPagination =
          Number.isInteger(data?.total) &&
          data.total >= 0 &&
          Number.isInteger(data?.limit) &&
          data.limit > 0 &&
          data?.offset === linesRequest.offset;

        const hasValidItems =
          Array.isArray(data?.items) &&
          data.items.every(
            (line) =>
              typeof line?.route_id === "string" &&
              typeof line?.short_name === "string",
          );

        if (!hasValidPagination || !hasValidItems) {
          throw new Error("API zwróciło nieoczekiwany format listy linii.");
        }

        if (controller.signal.aborted) {
          return;
        }

        setLinesResult({
          request: linesRequest,
          data,
          error: null,
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Błąd pobierania linii:", error);

        const message =
          error instanceof TypeError
            ? "Nie udało się połączyć z backendem."
            : error.message || "Nie udało się pobrać linii.";

        setLinesResult({
          request: linesRequest,
          data: null,
          error: message,
        });
      }
    }

    loadLines();

    return () => {
      controller.abort();
    };
  }, [linesRequest]);

  const isLoadingLines = linesResult?.request !== linesRequest;

  const linesPage = isLoadingLines ? null : linesResult?.data;
  const linesError = isLoadingLines ? null : linesResult?.error;

  const normalizedSearch = normalizeSearch(search);

  const filteredStops = DEMO_STOPS.filter((stop) =>
    normalizeSearch(stop.name).includes(normalizedSearch),
  ).map((stop) => ({
    ...stop,
    description: "Przystanek przykładowy",
  }));

  const selectedStop =
    DEMO_STOPS.find((stop) => stop.id === selectedStopId) ?? DEMO_STOPS[0];

  function handleRetryLines() {
    setLinesRequest((current) => ({
      offset: current.offset,
    }));
  }

  function handlePreviousPage() {
    if (!linesPage) {
      return;
    }

    setLinesRequest({
      offset: Math.max(0, linesPage.offset - linesPage.limit),
    });
  }

  function handleNextPage() {
    if (!linesPage) {
      return;
    }

    setLinesRequest({
      offset: linesPage.offset + linesPage.limit,
    });
  }

  const header = (
    <AppHeader
      actions={<ThemeToggle theme={theme} onThemeChange={setTheme} />}
    />
  );

  const sidebar =
    activeView === "stops" ? (
      <div className={styles.sidebarContent}>
        <div>
          <p className={styles.eyebrow}>Kraków</p>
          <h2 className={styles.sidebarTitle}>Znajdź przystanek</h2>
        </div>

        <span className={styles.demoBadge}>Dane przykładowe</span>

        <StopSearch value={search} onChange={setSearch} />

        <StopList
          stops={filteredStops}
          selectedStopId={selectedStopId}
          onSelect={setSelectedStopId}
        />
      </div>
    ) : (
      <div className={styles.sidebarContent}>
        <div>
          <p className={styles.eyebrow}>Kraków</p>
          <h2 className={styles.sidebarTitle}>Twój dojazd</h2>
        </div>

        <p className={styles.description}>
          Sprawdź linie, znajdź przystanek i zaplanuj podróż.
        </p>

        <div className={styles.sidebarNote}>
          Na tym etapie dostępna jest lista linii tramwajowych.
        </div>
      </div>
    );

  return (
    <AppShell theme={theme} header={header} sidebar={sidebar}>
      <div className={styles.page}>
        <AppNavigation activeView={activeView} onViewChange={setActiveView} />

        {activeView === "lines" && (
          <section className={styles.section} aria-labelledby="lines-heading">
            <header className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Rozkład jazdy</p>

              <h1 id="lines-heading" className={styles.title}>
                Linie tramwajowe
              </h1>

              <p className={styles.description}>
                Lista linii dostępnych w rozkładzie.
              </p>
            </header>

            {isLoadingLines && (
              <div className={styles.state} role="status">
                Pobieranie linii…
              </div>
            )}

            {linesError && (
              <div className={styles.state}>
                <p role="alert">{linesError}</p>

                <button
                  type="button"
                  className={styles.button}
                  onClick={handleRetryLines}
                >
                  Spróbuj ponownie
                </button>
              </div>
            )}

            {linesPage && linesPage.items.length === 0 && (
              <div className={styles.state} role="status">
                Brak linii do wyświetlenia na tej stronie.
              </div>
            )}

            {linesPage && linesPage.items.length > 0 && (
              <>
                <p className={styles.resultCount} role="status">
                  Wyświetlane linie: {linesPage.offset + 1}–
                  {linesPage.offset + linesPage.items.length}
                  {" z "}
                  {linesPage.total}
                </p>

                <ul className={styles.lineList}>
                  {linesPage.items.map((line) => (
                    <li
                      key={`${line.source ?? "T"}:${line.route_id}`}
                      className={styles.lineCard}
                    >
                      <span
                        className={styles.lineNumber}
                        aria-label={`Linia ${line.short_name}`}
                      >
                        {line.short_name || "—"}
                      </span>

                      <p className={styles.lineName}>
                        {line.long_name ||
                          `Linia tramwajowa ${line.short_name}`}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {linesPage &&
              (linesPage.offset > 0 ||
                linesPage.offset + linesPage.limit < linesPage.total) && (
                <nav
                  className={styles.pagination}
                  aria-label="Strony listy linii"
                >
                  <button
                    type="button"
                    className={styles.button}
                    disabled={linesPage.offset === 0}
                    onClick={handlePreviousPage}
                  >
                    Poprzednia
                  </button>

                  <button
                    type="button"
                    className={styles.button}
                    disabled={
                      linesPage.offset + linesPage.limit >= linesPage.total
                    }
                    onClick={handleNextPage}
                  >
                    Następna
                  </button>
                </nav>
              )}
          </section>
        )}

        {activeView === "stops" && (
          <section className={styles.section} aria-labelledby="stop-heading">
            <header className={styles.sectionHeader}>
              <span className={styles.demoBadge}>Dane przykładowe</span>

              <h1 id="stop-heading" className={styles.title}>
                {selectedStop.name}
              </h1>

              <p className={styles.description}>
                Linie i odjazdy z przystanku.
              </p>
            </header>

            <div className={styles.state}>
              <Clock3 size={28} aria-hidden="true" />
              <h2>Tablica odjazdów</h2>
              <p>Odjazdy nie są jeszcze dostępne w tym podglądzie.</p>
            </div>
          </section>
        )}

        {activeView === "journey" && (
          <section className={styles.section} aria-labelledby="journey-heading">
            <h1 id="journey-heading" className={styles.title}>
              Zaplanuj trasę
            </h1>

            <div className={styles.state}>
              <Route size={28} aria-hidden="true" />
              <h2>Planer tras jest w przygotowaniu</h2>
              <p>
                Tutaj sprawdzisz połączenia między wybranymi miejscami, godziny
                przejazdu i przesiadki.
              </p>
            </div>
          </section>
        )}

        {activeView === "favorites" && (
          <section
            className={styles.section}
            aria-labelledby="favorites-heading"
          >
            <h1 id="favorites-heading" className={styles.title}>
              Ulubione
            </h1>

            <div className={styles.state}>
              <Star size={28} aria-hidden="true" />
              <h2>Ulubione są w przygotowaniu</h2>
              <p>Tutaj pojawią się zapisane linie i trasy.</p>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

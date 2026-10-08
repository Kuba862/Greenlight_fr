"use client";

import { CornerDownRight } from "lucide-react";

import StopSearch from "@/components/stops/StopSearch";
import StopList from "@/components/stops/StopList";
import styles from "@/components/stops/StopsSidebar.module.scss";

export default function StopsSidebar({
  search = "",
  onSearchChange,
  stops = [],
  selectedStopId = null,
  onSelectStop,
  isLoading = false,
  error = null,
  onRetry,
}) {
  const showResultCount =
    !isLoading && !error && stops.length > 0;

  return (
    <div className={styles.sidebar}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          Dobrze być w drodze
        </p>

        <h2 className={styles.title}>
          Gdzie wsiadasz?
        </h2>
      </div>

      <StopSearch
        value={search}
        onChange={onSearchChange}
      />

      {showResultCount && (
        <p className={styles.resultCount} role="status">
          Widoczne przystanki: {stops.length}
        </p>
      )}

      <StopList
        stops={stops}
        selectedStopId={selectedStopId}
        onSelect={onSelectStop}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />

      <p className={styles.hint}>
        <CornerDownRight
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
        />

        <span>
          Wybierz przystanek, a potem stanowisko,
          z którego ruszasz.
        </span>
      </p>
    </div>
  );
}
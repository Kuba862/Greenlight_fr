"use client";

import StopListItem from "@/components/stops/StopListItem";
import styles from "@/components/stops/StopList.module.scss";

export default function StopList({
    stops = [],
    selectedStopId = null,
    onSelect,
    isLoading = false,
    error = null,
    onRetry,
    emptyMessage = "Nie znaleziono przystanków",
    emptyHint = "Spróbuj wpisać inną nazwę",
}) {

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <p className={styles.message} role="status">Ładowanie przystanków</p>
                <div className={styles.skeletons} aria-hidden="true">
                    {[0, 1, 2].map((index) => (
                        <div key={key} className={styles.skeleton} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        const errorMessage = typeof error === "string" ? error : "Spróbuj ponownie za chwilę";

        return (
            <div className={styles.state}>
                <div role="alert">
                    <p className={styles.title}>Nie udało się wczytać przystanków</p>

                    <p className={styles.message}>{errorMessage}</p>
                </div>

                {onRetry && (
                    <button type="button" className={styles.retryButton} onClick={onRetry}>Spróbuj ponownie</button>
                )}
            </div>
        );
    }

    if (stops.length === 0) {
        return (
            <div className={styles.state} role="status">
                <p className={styles.title}>{emptyMessage}</p>

                {emptyHint && (
                    <p className={styles.message}>{emptyHint}</p>
                )}
            </div>
        );
    }

    return (
        <ul className={styles.list} aria-label="Przystanki">
            {stops.map((stop) => (
                <li key={stop.id} className={styles.listItem}>
                    <StopListItem name={stop.name} description={stop.description ?? "Przystanek tramwajowy"} isSelected={selectedStopId === stop.id} onSelect={() => onSelect(stop.id)} />
                </li>
            ))}
        </ul>
    );
}
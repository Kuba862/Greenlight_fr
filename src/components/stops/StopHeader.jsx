"use client";

import { Bookmark, BookmarkCheck, TramFront } from "lucide-react";
import styles from "@/components/stops/StopHeader.module.scss";

export default function StopHeader({ name, isFavorite = false, onToggleFavorite }) {
    const FavoriteIcon = isFavorite ? BookmarkCheck : Bookmark;

    return (
        <header className={styles.header}>
            <div className={styles.content} aria-live="polite">
                <p className={styles.stopType}>
                    <TramFront 
                        size={16} 
                        strokeWidth={1.75} 
                        aria-hidden="true" 
                    />
                    <span>Przystanek tramwajowy</span>
                </p>

                <h1 className={styles.name}>{name}</h1>
                <p className={styles.location}>Kraków</p>
            </div>

            <button 
                type="button" 
                className={styles.favoriteButton} 
                aria-label={`Zapisz przystanek ${name}`} 
                aria-pressed={isFavorite} 
                title={isFavorite ? "Usuń z zapisanych" : "Dodaj do zapisanych"} 
                onClick={onToggleFavorite}>
                    <FavoriteIcon 
                        size={20} 
                        strokeWidth={1.75} 
                        aria-hidden="true" 
                    />
            </button>
        </header>
    )
}
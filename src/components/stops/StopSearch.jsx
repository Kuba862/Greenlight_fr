"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import styles from "@/components/stops/StopSearch.module.scss";

export default function StopSearch({ value = "", onChange }) {
    const inputRef = useRef(null);

    function handleClear() {
        onChange("");
        inputRef.current?.focus();
    }

    return (
        <div className={styles.search} role="search" aria-label="Wyszukiwanie przystanków">
            <Search className={styles.searchIcon} size={18} strokeWidth={1.75} aria-hidden="true" />
            <input 
                type="search" 
                ref={inputRef} 
                className={styles.input} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder="Znajdź przystanek" 
                aria-label="Nazwa przystanku" 
                autoComplete="off" 
                spellCheck={false} 
                enterKeyHint="search"
                />

                {value.length > 0 && (
                    <button 
                        type="button"
                        className={styles.clearButton} 
                        onClick={handleClear}
                        aria-label="Wyczyść wyszukiwanie"
                    >
                        <X
                            size={16} 
                            strokeWidth={1.75} 
                            aria-hidden="true"
                        />
                    </button>
                )}
        </div>
    );
}
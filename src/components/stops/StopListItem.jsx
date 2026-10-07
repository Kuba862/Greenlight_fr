"use client";

import {ChevronRight, TramFront } from "lucide-react";
import styles from "@/components/stops/StopListItem.module.scss";

export default function StopListItem({
    name, description, isSelected = false, onSelect
}) {
    return (
        <button 
            type="button" 
            className={styles.item} 
            aria-pressed={isSelected} 
            onClick={onSelect}
        >
            <TramFront 
                className={styles.icon} 
                size={18} 
                strokeWidth={1.75} 
                aria-hidden="true" 
            />

            <span className={styles.content}>
                <span className={styles.name}>{name}</span>

                {description && (
                    <span className={styles.description}>{description}</span>
                )}
            </span>

            <ChevronRight 
                className={styles.chevron}
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
            />
        </button>
    )
}
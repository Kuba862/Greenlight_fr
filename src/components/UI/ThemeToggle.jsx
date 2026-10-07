"use client";

import { Moon, Sun } from "lucide-react";
import styles from "@/components/UI/ThemeToggle.module.scss";

export default function ThemeToggle({ theme, onThemeChange }) {
    return (
        <div className={styles.toggle} role="group" aria-label="Wybór motywu">
            <button type="button" className={styles.button} aria-pressed={theme === "light"} onClick={() => onThemeChange("light")}>
                <Sun size={16} strokeWidth={.75} aria-hidden="true" />

                <span>Jasny</span>
            </button>

            <button type="button" className={styles.button} aria-pressed={theme === "dark"} onClick={() => onThemeChange("dark")} >
                <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>Ciemny</span>
            </button>
        </div>
    );
}
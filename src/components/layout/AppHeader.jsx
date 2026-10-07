import Link from "next/link";
import { MapPin, TramFront } from "lucide-react";
import styles from "@/components/layout/AppHeader.module.scss";

export default function AppHeader({ actions = null }) {
    return (
        <div className={styles.header}>
            <Link href="/" className={styles.brandIcon} aria-label="Mój dojazd - strona główna" >
                <span className={styles.brandIcon}>
                    <TramFront size={23} strokeWidth={1.75} aria-hidden="true" />
                </span>

                <span className={styles.brandText} >mój
                    <span className={styles.brandSecondary}>dojazd</span>
                    <span className={styles.brandDot} aria-hidden="true">.</span>
                </span>
            </Link>

            <div className={styles.location}>
                <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />

                <span>Kraków</span>

                <span className={styles.separator} aria-hidden="true" >.</span>
                <span>Tramwaje</span>
            </div>

            {actions ? (
                <div className={styles.actions}>{actions}</div>
            ) : null}
        </div>
    );
}
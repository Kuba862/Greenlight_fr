import styles from "@/components/layout/AppShell.module.scss";

export default function AppShell({
    header, sidebar, children, theme = "light"
}) {
    return (
        <div className={styles.shell} data-theme={theme} >
            <header className={styles.header}>{header}</header>
            <div className={styles.content}>
                <aside className={styles.sidebar} aria-label="Wybór przystanku">{sidebar}</aside>
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    )
}
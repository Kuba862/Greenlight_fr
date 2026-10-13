import styles from "@/components/layout/AppNavigation.module.scss";

const NAVIGATION_ITEMS = [
    {
        id: "stops",
        label: "Przystanki",
        icon: MapPin,
    },
    {
        id: "lines",
        label: "Linie",
        icon: TramFront,
    },
    {
        id: "journey",
        label: "Zaplanuj trasę",
        icon: Route,
    },
    {
        id: "favorites",
        label: "Ulubione",
        icon: Star,
    }
];

export default function AppNavigation({
    activeView = "stops",
    onViewChange,
}) {
    return (
        <nav className={styles.navigation} aria-label="Główne widoki aplikacji">
            {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                    <button
                        key={item.id}
                        type="button"
                        className={styles.button}
                        aria-pressed={isActive}
                        onClick={() => onViewChange(item.id)}>
                        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
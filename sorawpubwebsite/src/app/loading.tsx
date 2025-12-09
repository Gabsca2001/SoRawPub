import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.spinnerContainer}>
                {/* Cerchio esterno */}
                <div className={styles.spinnerOuter}></div>
                {/* Cerchio interno */}
                <div className={styles.spinnerInner}></div>
            </div>
            
            {/* Testo opzionale */}
            <div className={styles.loadingText}>So Raw</div>
        </div>
    );
}
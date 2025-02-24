import { ClipLoader } from 'react-spinners';

export const Spinner = () => (
    <div style={styles.overlay}>
        <ClipLoader
            color="#5030e5"
            size={50}
            aria-label="Loading Spinner"
        />
    </div>
);

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    }
};
